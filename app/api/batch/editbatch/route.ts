import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ── GET /api/batches/[id] ────────────────────────────────
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const batch = await prisma.batch.findUnique({
      where:   { id: params.id },
      include: { bookings: { orderBy: { createdAt: "desc" } } },
    });

    if (!batch)
      return NextResponse.json(
        { success: false, error: "Batch not found." },
        { status: 404 }
      );

    return NextResponse.json({ success: true, batch });
  } catch (err) {
    console.error("[GET /api/batches/[id]]", err);
    return NextResponse.json(
      { success: false, error: "Server error." },
      { status: 500 }
    );
  }
}

// ── PATCH /api/batches/[id] ──────────────────────────────
// Updatable fields: status, instructor, description, totalSeats
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { status, instructor, description, totalSeats } = body;

    // Fetch current batch
    const existing = await prisma.batch.findUnique({ where: { id: params.id } });
    if (!existing)
      return NextResponse.json(
        { success: false, error: "Batch not found." },
        { status: 404 }
      );

    // If updating totalSeats, must be >= bookedSeats
    if (totalSeats !== undefined) {
      if (isNaN(Number(totalSeats)) || Number(totalSeats) < 1)
        return NextResponse.json(
          { success: false, error: "Total seats must be at least 1." },
          { status: 400 }
        );
      if (Number(totalSeats) < existing.bookedSeats)
        return NextResponse.json(
          { success: false, error: `Cannot set seats below already booked count (${existing.bookedSeats}).` },
          { status: 400 }
        );
    }

    const batch = await prisma.batch.update({
      where: { id: params.id },
      data: {
        ...(status      !== undefined && { status }),
        ...(instructor  !== undefined && { instructor: instructor?.trim() || null }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(totalSeats  !== undefined && { totalSeats: Number(totalSeats) }),
      },
    });

    return NextResponse.json({ success: true, batch });
  } catch (err) {
    console.error("[PATCH /api/batches/[id]]", err);
    return NextResponse.json(
      { success: false, error: "Server error." },
      { status: 500 }
    );
  }
}