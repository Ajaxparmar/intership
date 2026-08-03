import { NextResponse } from "next/server";
import { BatchStatus, BatchType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const BATCH_TYPES = new Set<BatchType>(["ONLINE", "OFFLINE", "HYBRID"]);
const BATCH_STATUSES = new Set<BatchStatus>(["UPCOMING", "ONGOING", "FULL", "COMPLETED"]);

// ── GET /api/batch/editbatch ────────────────────────────────
export async function GET(
  _req: Request,
  // No params needed since this is NOT a dynamic route
) {
  try {
    // If you need to fetch a specific batch, you should accept `id` in the request body or query params.
    // For now, returning all batches or adjust as needed.
    const batches = await prisma.batch.findMany({
      include: { bookings: { orderBy: { createdAt: "desc" } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, batches });
  } catch (err) {
    console.error("[GET /api/batch/editbatch]", err);
    return NextResponse.json(
      { success: false, error: "Server error." },
      { status: 500 }
    );
  }
}

// ── PATCH /api/batch/editbatch ──────────────────────────────
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      name,
      course,
      batchType,
      instructor,
      startDate,
      endDate,
      timingStart,
      timingEnd,
      days,
      totalSeats,
      status,
      description,
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Batch ID is required." },
        { status: 400 }
      );
    }

    const existing = await prisma.batch.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Batch not found." },
        { status: 404 }
      );
    }

    if (!name?.trim() || !course?.trim() || !batchType || !startDate || !endDate || !timingStart || !timingEnd) {
      return NextResponse.json(
        { success: false, error: "Name, course, type, dates, and timings are required." },
        { status: 400 }
      );
    }

    if (!BATCH_TYPES.has(batchType)) {
      return NextResponse.json({ success: false, error: "Invalid batch type." }, { status: 400 });
    }

    if (!BATCH_STATUSES.has(status)) {
      return NextResponse.json({ success: false, error: "Invalid batch status." }, { status: 400 });
    }

    if (endDate <= startDate) {
      return NextResponse.json({ success: false, error: "End date must be after start date." }, { status: 400 });
    }

    if (timingEnd <= timingStart) {
      return NextResponse.json({ success: false, error: "End time must be after start time." }, { status: 400 });
    }

    if (!Array.isArray(days) || days.length === 0) {
      return NextResponse.json({ success: false, error: "Select at least one class day." }, { status: 400 });
    }

    const newTotal = Number(totalSeats);
    if (!Number.isInteger(newTotal) || newTotal < 1) {
      return NextResponse.json(
        { success: false, error: "Total seats must be a whole number of at least 1." },
        { status: 400 }
      );
    }

    if (newTotal < existing.bookedSeats) {
      return NextResponse.json(
        { success: false, error: `Cannot set seats below already booked count (${existing.bookedSeats}).` },
        { status: 400 }
      );
    }

    const nextStatus: BatchStatus =
      existing.bookedSeats >= newTotal && status !== "COMPLETED" ? "FULL" : status;

    const batch = await prisma.batch.update({
      where: { id },
      data: {
        name: name.trim(),
        course: course.trim(),
        batchType,
        instructor: instructor?.trim() || null,
        startDate,
        endDate,
        timingStart,
        timingEnd,
        days,
        totalSeats: newTotal,
        status: nextStatus,
        description: description?.trim() || null,
      },
    });

    return NextResponse.json({ success: true, batch });
  } catch (err) {
    console.error("[PATCH /api/batch/editbatch]", err);
    return NextResponse.json(
      { success: false, error: "Server error." },
      { status: 500 }
    );
  }
}
