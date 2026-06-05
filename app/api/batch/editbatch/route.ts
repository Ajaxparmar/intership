import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    const { id, status, instructor, description, totalSeats } = body;

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

    // Validate totalSeats if provided
    if (totalSeats !== undefined) {
      const newTotal = Number(totalSeats);
      if (isNaN(newTotal) || newTotal < 1) {
        return NextResponse.json(
          { success: false, error: "Total seats must be at least 1." },
          { status: 400 }
        );
      }
      if (newTotal < existing.bookedSeats) {
        return NextResponse.json(
          { success: false, error: `Cannot set seats below already booked count (${existing.bookedSeats}).` },
          { status: 400 }
        );
      }
    }

    const batch = await prisma.batch.update({
      where: { id },
      data: {
        ...(status !== undefined && { status }),
        ...(instructor !== undefined && { instructor: instructor?.trim() || null }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(totalSeats !== undefined && { totalSeats: Number(totalSeats) }),
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