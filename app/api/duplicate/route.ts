// app/api/check-duplicate/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const all = await prisma.bookedSeat.findMany({
      select: { id: true, fullName: true, whatsappNo: true, email: true, batchId: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    // Group by whatsappNo
    const byPhone = all.reduce<Record<string, typeof all>>((acc, seat) => {
      (acc[seat.whatsappNo] ??= []).push(seat);
      return acc;
    }, {});

    // Group by email
    const byEmail = all.reduce<Record<string, typeof all>>((acc, seat) => {
      (acc[seat.email] ??= []).push(seat);
      return acc;
    }, {});

    const duplicatePhones = Object.entries(byPhone)
      .filter(([, entries]) => entries.length > 1)
      .map(([whatsappNo, entries]) => ({ whatsappNo, count: entries.length, entries }));

    const duplicateEmails = Object.entries(byEmail)
      .filter(([, entries]) => entries.length > 1)
      .map(([email, entries]) => ({ email, count: entries.length, entries }));

    return NextResponse.json({
      success:         true,
      duplicatePhones,
      duplicateEmails,
      totalDuplicatePhones: duplicatePhones.length,
      totalDuplicateEmails: duplicateEmails.length,
    });

  } catch (err) {
    console.error("[check-duplicate]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}