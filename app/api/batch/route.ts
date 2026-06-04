// 

// app/api/batches/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ── Helpers ───────────────────────────────────────────────
function err400(error: string) {
  return NextResponse.json({ success: false, error }, { status: 400 });
}

/** Accepts formats: 10 digits, optionally prefixed with +91 or 0 */
function isValidIndianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  return /^(\+91|0)?[6-9]\d{9}$/.test(cleaned);
}

// ── GET /api/batches ──────────────────────────────────────
// Query params: ?course=&status=&batchType=
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const course    = searchParams.get("course")    ?? undefined;
    const status    = searchParams.get("status")    ?? undefined;
    const batchType = searchParams.get("batchType") ?? undefined;

    const batches = await prisma.batch.findMany({
      where: {
        ...(course    && { course }),
        ...(status    && { status:    status    as any }),
        ...(batchType && { batchType: batchType as any }),
      },
      include: { _count: { select: { bookings: true } } },
      orderBy: [
        // Sort by status priority first
        { status: "asc" },
        // Then by startDate ascending within the same status
        { startDate: "asc" },
      ],
    });

    return NextResponse.json({ success: true, batches });
  } catch (err) {
    console.error("[GET /api/batches]", err);
    return NextResponse.json(
      { success: false, error: "Server error." },
      { status: 500 }
    );
  }
}

// ── POST /api/batches ─────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name, course, batchType, instructor,
      startDate, endDate, timingStart, timingEnd,
      days, totalSeats, description,
      instructorPhone,   // optional instructor contact
    } = body;

    // ── Required field validation ──────────────────────────
    if (!name?.trim())
      return err400("Batch name is required.");
    if (!course)
      return err400("Course is required.");
    if (!batchType)
      return err400("Batch type is required.");
    if (!startDate)
      return err400("Start date is required.");
    if (!endDate)
      return err400("End date is required.");
    if (endDate <= startDate)
      return err400("End date must be after start date.");
    if (!timingStart)
      return err400("Start time is required.");
    if (!timingEnd)
      return err400("End time is required.");
    if (timingEnd <= timingStart)
      return err400("End time must be after start time.");
    if (!days?.length)
      return err400("Select at least one class day.");
    if (!totalSeats || isNaN(Number(totalSeats)) || Number(totalSeats) < 1)
      return err400("Total seats must be at least 1.");

    // ── Phone validation (optional field) ─────────────────
    if (instructorPhone?.trim() && !isValidIndianPhone(instructorPhone.trim())) {
      return err400(
        "Instructor phone must be a valid 10-digit Indian mobile number (starts with 6–9), optionally prefixed with +91 or 0."
      );
    }

    const batch = await prisma.batch.create({
      data: {
        name:            name.trim(),
        course,
        batchType,
        instructor:      instructor?.trim()      || null,
        startDate,
        endDate,
        timingStart,
        timingEnd,
        days,
        totalSeats:  Number(totalSeats),
        description: description?.trim() || null,
        status:      "UPCOMING",
      },
    });

    return NextResponse.json({ success: true, batch }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/batches]", err);
    return NextResponse.json(
      { success: false, error: "Server error." },
      { status: 500 }
    );
  }
}