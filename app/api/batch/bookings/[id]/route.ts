// // app/api/batch/bookings/[id]/route.ts

// import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// // Updated Context type for Next.js 15+
// type Context = {
//   params: Promise<{ id: string }>;
// };

// // ✅ PUT — Update Booking
// export async function PUT(req: NextRequest, context: Context) {
//   try {
//     const { id } = await context.params;   // ← Await the promise
//     const body = await req.json();

//     const { fullName, whatsappNo, email, college } = body;

//     if (!fullName || !whatsappNo || !email || !college) {
//       return NextResponse.json(
//         { success: false, error: "All fields are required." },
//         { status: 400 }
//       );
//     }

//     const bookingData = await prisma.bookedSeat.findUnique({
//       where: { id },
//     });

//     if (!bookingData) {
//       return NextResponse.json(
//         { success: false, error: "Booking not found." },
//         { status: 404 }
//       );
//     }

//     const existing = await prisma.bookedSeat.findFirst({
//       where: {
//         email,
//         batchId: bookingData.batchId,
//         NOT: { id },
//       },
//     });

//     if (existing) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "This email is already booked for this batch.",
//         },
//         { status: 409 }
//       );
//     }

//     const updated = await prisma.bookedSeat.update({
//       where: { id },
//       data: { fullName, whatsappNo, email, college },
//       include: {
//         batch: {
//           select: {
//             id: true,
//             name: true,
//             course: true,
//             batchType: true,
//           },
//         },
//       },
//     });

//     return NextResponse.json({ success: true, booking: updated });
//   } catch (err: any) {
//     if (err.code === "P2025") {
//       return NextResponse.json(
//         { success: false, error: "Booking not found." },
//         { status: 404 }
//       );
//     }

//     console.error("[bookings PUT]", err);
//     return NextResponse.json(
//       { success: false, error: "Failed to update booking." },
//       { status: 500 }
//     );
//   }
// }

// // ✅ DELETE — Delete Booking + Decrement Seats
// export async function DELETE(req: NextRequest, context: Context) {
//   try {
//     const { id } = await context.params;   // ← Await the promise

//     const booking = await prisma.bookedSeat.findUnique({
//       where: { id },
//     });

//     if (!booking) {
//       return NextResponse.json(
//         { success: false, error: "Booking not found." },
//         { status: 404 }
//       );
//     }

//     await prisma.$transaction([
//       prisma.bookedSeat.delete({ where: { id } }),
//       prisma.batch.update({
//         where: { id: booking.batchId },
//         data: { bookedSeats: { decrement: 1 } },
//       }),
//     ]);

//     return NextResponse.json({ success: true });
//   } catch (err: any) {
//     if (err.code === "P2025") {
//       return NextResponse.json(
//         { success: false, error: "Booking not found." },
//         { status: 404 }
//       );
//     }

//     console.error("[bookings DELETE]", err);
//     return NextResponse.json(
//       { success: false, error: "Failed to delete booking." },
//       { status: 500 }
//     );
//   }
// }


// app/api/batch/bookings/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { BatchStatus, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Context = {
  params: Promise<{ id: string }>;
};

function nextBatchStatus(status: BatchStatus, totalSeats: number, bookedSeats: number): BatchStatus {
  if (status === "COMPLETED") return status;
  if (bookedSeats >= totalSeats) return "FULL";
  if (status === "FULL") return "UPCOMING";
  return status;
}

// ✅ PUT — Update Booking (student info + optional batch transfer + batch schedule)
export async function PUT(req: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const {
      fullName,
      whatsappNo,
      email,
      college,
      // Batch transfer (optional — if omitted, stays on current batch)
      batchId,
      // Batch schedule fields (optional — update the batch itself)
      timingStart,
      timingEnd,
      startDate,
      endDate,
    } = body;

    // ── Validate required student fields ──────────────────
    if (!fullName || !whatsappNo || !email || !college) {
      return NextResponse.json(
        { success: false, error: "fullName, whatsappNo, email and college are required." },
        { status: 400 }
      );
    }

    // ── Ensure the booking exists ─────────────────────────
    const existing = await prisma.bookedSeat.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Booking not found." },
        { status: 404 }
      );
    }

    const targetBatchId = batchId ?? existing.batchId;

    // ── If batchId is being changed, validate destination ──
    if (batchId && batchId !== existing.batchId) {
      const destBatch = await prisma.batch.findUnique({ where: { id: batchId } });
      if (!destBatch) {
        return NextResponse.json(
          { success: false, error: "Target batch not found." },
          { status: 404 }
        );
      }

      if (destBatch.status === "COMPLETED") {
        return NextResponse.json(
          { success: false, error: "Target batch has already completed." },
          { status: 409 }
        );
      }

      const destinationBookedCount = await prisma.bookedSeat.count({
        where: { batchId },
      });

      if (destinationBookedCount >= destBatch.totalSeats) {
        return NextResponse.json(
          { success: false, error: "Target batch is full. No seats available." },
          { status: 409 }
        );
      }
    }

    // ── Check unique [email, batchId] constraint ──────────
    // The student should not already exist in the target batch (unless it's the same booking)
    const duplicate = await prisma.bookedSeat.findFirst({
      where: {
        email,
        batchId: targetBatchId,
        NOT: { id },
      },
    });
    if (duplicate) {
      return NextResponse.json(
        { success: false, error: "This email is already booked for the target batch." },
        { status: 409 }
      );
    }

    // ── Build batch schedule update (only fields provided) ─
    const batchScheduleUpdate: Record<string, string> = {};
    if (timingStart !== undefined) batchScheduleUpdate.timingStart = timingStart;
    if (timingEnd   !== undefined) batchScheduleUpdate.timingEnd   = timingEnd;
    if (startDate   !== undefined) batchScheduleUpdate.startDate   = startDate;
    if (endDate     !== undefined) batchScheduleUpdate.endDate     = endDate;

    const isBatchTransfer = targetBatchId !== existing.batchId;

    // ── Run updates in a transaction ──────────────────────
    const [updatedBooking] = await prisma.$transaction(async (tx) => {
      // 1. Update the booking (student info + optional batchId transfer)
      const booking = await tx.bookedSeat.update({
        where: { id },
        data: {
          fullName,
          whatsappNo,
          email,
          college,
          ...(batchId ? { batchId } : {}),
        },
        include: {
          batch: {
            select: {
              id:          true,
              name:        true,
              course:      true,
              batchType:   true,
              timingStart: true,
              timingEnd:   true,
              startDate:   true,
              endDate:     true,
              totalSeats:  true,
              bookedSeats: true,
            },
          },
        },
      });

      // 2. Keep Batch.bookedSeats in sync when the student moves batches.
      if (isBatchTransfer) {
        const affectedBatchIds = [existing.batchId, targetBatchId];
        const affectedBatches = await tx.batch.findMany({
          where: { id: { in: affectedBatchIds } },
          select: {
            id: true,
            status: true,
            totalSeats: true,
          },
        });

        await Promise.all(
          affectedBatches.map(async (affectedBatch) => {
            const bookedSeats = await tx.bookedSeat.count({
              where: { batchId: affectedBatch.id },
            });

            await tx.batch.update({
              where: { id: affectedBatch.id },
              data: {
                bookedSeats,
                status: nextBatchStatus(
                  affectedBatch.status,
                  affectedBatch.totalSeats,
                  bookedSeats
                ),
              },
            });
          })
        );
      }

      // 3. Update the batch schedule (if any schedule fields were provided)
      if (Object.keys(batchScheduleUpdate).length > 0) {
        await tx.batch.update({
          where: { id: targetBatchId },
          data: batchScheduleUpdate,
        });
      }

      return [booking];
    });

    // Merge updated schedule fields into the returned batch object
    // (since the transaction updated the batch after we fetched the booking)
    const responseBooking = {
      ...updatedBooking,
      batch: {
        ...updatedBooking.batch,
        ...batchScheduleUpdate,
      },
    };

    return NextResponse.json({ success: true, booking: responseBooking });
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
    const { id } = await context.params;

    const booking = await prisma.bookedSeat.findUnique({ where: { id } });
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
