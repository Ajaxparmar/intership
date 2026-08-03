import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function normalizeIndianPhone(phone: string) {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  if (!/^(\+91|0)?[6-9]\d{9}$/.test(cleaned)) return null;
  return cleaned.replace(/^(\+91|0)/, "");
}

const BOOKING_CONTACT = "9588161422";

function duplicateBookingError(booking: {
  batch: { name: string; course: string; batchType: string };
}) {
  return `A seat is already booked in group "${booking.batch.name}" (${booking.batch.course} - ${booking.batch.batchType}). Please contact ${BOOKING_CONTACT} for help.`;
}

// ── POST /api/batches/book ───────────────────────────────
export async function POST(req: Request) {
  let normalizedPhone: string | null = null;
  let normalizedEmail = "";

  try {
    const body = await req.json();
    const { batchId, fullName, whatsappNo, email, college } = body;

    // ── Validation ───────────────────────────────────────
    if (!batchId || !fullName || !whatsappNo || !email || !college)
      return NextResponse.json(
        { success: false, error: "All fields are required." },
        { status: 400 }
      );

    normalizedPhone = normalizeIndianPhone(whatsappNo);
    if (!normalizedPhone)
      return NextResponse.json(
        { success: false, error: "WhatsApp number must be a valid 10-digit Indian mobile number." },
        { status: 400 }
      );

    normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail))
      return NextResponse.json(
        { success: false, error: "Invalid email address." },
        { status: 400 }
      );

    // ── Fetch batch ──────────────────────────────────────
    const batch = await prisma.batch.findUnique({ where: { id: batchId } });

    if (!batch)
      return NextResponse.json(
        { success: false, error: "Batch not found." },
        { status: 404 }
      );

    if (batch.status === "COMPLETED")
      return NextResponse.json(
        { success: false, error: "This batch has already completed." },
        { status: 409 }
      );

    if (batch.status === "FULL" || batch.bookedSeats >= batch.totalSeats)
      return NextResponse.json(
        { success: false, error: "This batch is full. No seats available." },
        { status: 409 }
      );

    // ── Duplicate check ──────────────────────────────────
    const [existingEmail, existingPhone] = await Promise.all([
      prisma.bookedSeat.findUnique({
        where: { email_batchId: { email: normalizedEmail, batchId } },
        include: { batch: { select: { name: true, course: true, batchType: true } } },
      }),
      prisma.bookedSeat.findFirst({
        where: { whatsappNo: normalizedPhone },
        include: { batch: { select: { name: true, course: true, batchType: true } } },
      }),
    ]);

    if (existingEmail)
      return NextResponse.json(
        { success: false, error: duplicateBookingError(existingEmail) },
        { status: 409 }
      );

    if (existingPhone)
      return NextResponse.json(
        { success: false, error: duplicateBookingError(existingPhone) },
        { status: 409 }
      );

    // ── Book seat (atomic transaction) ───────────────────
    const newBookedSeats = batch.bookedSeats + 1;

    const [booking] = await prisma.$transaction([
      prisma.bookedSeat.create({
        data: { batchId, fullName, whatsappNo: normalizedPhone, email: normalizedEmail, college },
      }),
      prisma.batch.update({
        where: { id: batchId },
        data: {
          bookedSeats: newBookedSeats,
          status: newBookedSeats >= batch.totalSeats ? "FULL" : batch.status,
        },
      }),
    ]);

    return NextResponse.json({
      success:   true,
      message:   "Seat booked successfully!",
      bookingId: booking.id,
    });
  } catch (err: any) {
    // Race condition duplicate
    if (err?.code === "P2002") {
      const existingBooking = await prisma.bookedSeat.findFirst({
        where: {
          OR: [
            ...(normalizedPhone ? [{ whatsappNo: normalizedPhone }] : []),
            ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
          ],
        },
        include: { batch: { select: { name: true, course: true, batchType: true } } },
      });
      return NextResponse.json(
        {
          success: false,
          error: existingBooking
            ? duplicateBookingError(existingBooking)
            : `This email or WhatsApp number already has a booking. Please contact ${BOOKING_CONTACT} for help.`,
        },
        { status: 409 }
      );
    }

    console.error("[POST /api/batches/book]", err);
    return NextResponse.json(
      { success: false, error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
