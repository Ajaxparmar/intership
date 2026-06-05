import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function normalizeIndianPhone(phone: string) {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  if (!/^(\+91|0)?[6-9]\d{9}$/.test(cleaned)) return null;
  return cleaned.replace(/^(\+91|0)/, "");
}

// ── POST /api/batches/book ───────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { batchId, fullName, whatsappNo, email, college } = body;

    // ── Validation ───────────────────────────────────────
    if (!batchId || !fullName || !whatsappNo || !email || !college)
      return NextResponse.json(
        { success: false, error: "All fields are required." },
        { status: 400 }
      );

    const normalizedPhone = normalizeIndianPhone(whatsappNo);
    if (!normalizedPhone)
      return NextResponse.json(
        { success: false, error: "WhatsApp number must be a valid 10-digit Indian mobile number." },
        { status: 400 }
      );

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
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
        where: { email_batchId: { email, batchId } },
      }),
      prisma.bookedSeat.findFirst({
        where: { whatsappNo: normalizedPhone, batchId },
      }),
    ]);

    if (existingEmail)
      return NextResponse.json(
        { success: false, error: "You have already booked a seat in this batch." },
        { status: 409 }
      );

    if (existingPhone)
      return NextResponse.json(
        { success: false, error: "This WhatsApp number has already booked a seat in this batch." },
        { status: 409 }
      );

    // ── Book seat (atomic transaction) ───────────────────
    const newBookedSeats = batch.bookedSeats + 1;

    const [booking] = await prisma.$transaction([
      prisma.bookedSeat.create({
        data: { batchId, fullName, whatsappNo: normalizedPhone, email, college },
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
    if (err?.code === "P2002")
      return NextResponse.json(
        { success: false, error: "This email or WhatsApp number has already booked a seat in this batch." },
        { status: 409 }
      );

    console.error("[POST /api/batches/book]", err);
    return NextResponse.json(
      { success: false, error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
