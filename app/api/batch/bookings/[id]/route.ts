// app/api/admin/bookings/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PUT /api/admin/bookings/:id  — edit a booking
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    // Only allow editing these fields
    const { fullName, whatsappNo, email, college } = body;

    if (!fullName || !whatsappNo || !email || !college) {
      return NextResponse.json(
        { success: false, error: "All fields are required." },
        { status: 400 }
      );
    }

    // Check if new email+batchId combo already exists (for a different booking)
    const existing = await prisma.bookedSeat.findFirst({
      where: {
        email,
        batchId: (await prisma.bookedSeat.findUnique({ where: { id } }))?.batchId,
        NOT: { id },
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "This email is already booked for this batch." },
        { status: 409 }
      );
    }

    const updated = await prisma.bookedSeat.update({
      where: { id },
      data:  { fullName, whatsappNo, email, college },
      include: {
        batch: {
          select: { id: true, name: true, course: true, batchType: true },
        },
      },
    });

    return NextResponse.json({ success: true, booking: updated });
  } catch (err: any) {
    if (err.code === "P2025") {
      return NextResponse.json({ success: false, error: "Booking not found." }, { status: 404 });
    }
    console.error("[admin/bookings PUT]", err);
    return NextResponse.json({ success: false, error: "Failed to update booking." }, { status: 500 });
  }
}

// DELETE /api/admin/bookings/:id  — delete a booking + decrement bookedSeats
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Find the booking first so we know which batch to update
    const booking = await prisma.bookedSeat.findUnique({ where: { id } });
    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found." }, { status: 404 });
    }

    // Delete booking and decrement bookedSeats in one transaction
    await prisma.$transaction([
      prisma.bookedSeat.delete({ where: { id } }),
      prisma.batch.update({
        where: { id: booking.batchId },
        data:  { bookedSeats: { decrement: 1 } },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err.code === "P2025") {
      return NextResponse.json({ success: false, error: "Booking not found." }, { status: 404 });
    }
    console.error("[admin/bookings DELETE]", err);
    return NextResponse.json({ success: false, error: "Failed to delete booking." }, { status: 500 });
  }
}