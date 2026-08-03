// app/api/admin/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/admin/bookings
// Query params: batchId?, search?, page?, limit?
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const batchId  = searchParams.get("batchId")  || undefined;
    const search   = searchParams.get("search")   || "";
    const page     = Math.max(1, parseInt(searchParams.get("page")  || "1",  10));
    const limit    = Math.min(100, parseInt(searchParams.get("limit") || "20", 10));
    const skip     = (page - 1) * limit;

    const where = {
      ...(batchId ? { batchId } : {}),
      ...(search
        ? {
            OR: [
              { fullName:  { contains: search, mode: "insensitive" as const } },
              { email:     { contains: search, mode: "insensitive" as const } },
              { whatsappNo:{ contains: search, mode: "insensitive" as const } },
              { college:   { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [bookings, total] = await Promise.all([
      prisma.bookedSeat.findMany({
        where,
        include: {
          batch: {
            select: {
              id:         true,
              name:       true,
              course:     true,
              batchType:  true,
              timingStart:true,
              timingEnd:  true,
              startDate:  true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.bookedSeat.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      bookings,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("[admin/bookings GET]", err);
    return NextResponse.json({ success: false, error: "Failed to fetch bookings." }, { status: 500 });
  }
}