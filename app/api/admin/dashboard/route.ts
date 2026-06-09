import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [feeSummary, totalRegistrations, totalGroups, totalBatches, students] = await Promise.all([
      prisma.student.aggregate({ _sum: { paidFee: true } }),
      prisma.student.count(),
      prisma.studentGroup.count(),
      prisma.batch.count(),
      prisma.student.findMany({ select: { courseName: true } }),
    ]);

    const totalCourses = new Set(
      students.map((student) => student.courseName.trim().toLowerCase()).filter(Boolean)
    ).size;

    return NextResponse.json({
      success: true,
      metrics: {
        totalCollection: feeSummary._sum.paidFee ?? 0,
        totalRegistrations,
        totalGroups,
        totalCourses,
        totalBatches,
      },
    });
  } catch (error) {
    console.error("Dashboard metrics error:", error);
    return NextResponse.json({ error: "Could not load dashboard metrics." }, { status: 500 });
  }
}
