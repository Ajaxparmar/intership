// app/api/batch/bookings/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Updated Context type for Next.js 15+
type Context = {
  params: Promise<{ id: string }>;
};

// ✅ PUT — Update Booking
export async function PUT(req: NextRequest, context: Context) {
  try {
    const { id } = await context.params;   // ← Await the promise
    const body = await req.json();

    const { fullName, whatsappNo, email, college } = body;

    if (!fullName || !whatsappNo || !email || !college) {
      return NextResponse.json(
        { success: false, error: "All fields are required." },
        { status: 400 }
      );
    }

    const bookingData = await prisma.bookedSeat.findUnique({
      where: { id },
    });

    if (!bookingData) {
      return NextResponse.json(
        { success: false, error: "Booking not found." },
        { status: 404 }
      );
    }

    const existing = await prisma.bookedSeat.findFirst({
      where: {
        email,
        batchId: bookingData.batchId,
        NOT: { id },
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: "This email is already booked for this batch.",
        },
        { status: 409 }
      );
    }

    const updated = await prisma.bookedSeat.update({
      where: { id },
      data: { fullName, whatsappNo, email, college },
      include: {
        batch: {
          select: {
            id: true,
            name: true,
            course: true,
            batchType: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, booking: updated });
  } catch (err: any) {
    if (err.code === "P2025") {
      return NextResponse.json(
        { success: false, error: "Booking not found." },
        { status: 404 }
      );
    }

    console.error("[bookings PUT]", err);
    return NextResponse.json(
      { success: false, error: "Failed to update booking." },
      { status: 500 }
    );
  }
}

// ✅ DELETE — Delete Booking + Decrement Seats
export async function DELETE(req: NextRequest, context: Context) {
  try {
    const { id } = await context.params;   // ← Await the promise

    const booking = await prisma.bookedSeat.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found." },
        { status: 404 }
      );
    }

    await prisma.$transaction([
      prisma.bookedSeat.delete({ where: { id } }),
      prisma.batch.update({
        where: { id: booking.batchId },
        data: { bookedSeats: { decrement: 1 } },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err.code === "P2025") {
      return NextResponse.json(
        { success: false, error: "Booking not found." },
        { status: 404 }
      );
    }

    console.error("[bookings DELETE]", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete booking." },
      { status: 500 }
    );
  }
}