import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone")?.trim();

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required." },
        { status: 400 }
      );
    }

    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("localhost")) {
      return NextResponse.json({
        success: true,
        message: "Student lookup received (Development Mock)",
        students: [],
      });
    }

    const students = await prisma.application.findMany({
      where: { phone },
      orderBy: { createdAt: "desc" },
    });

    if (students.length === 0) {
      return NextResponse.json(
        { error: "No student found for this phone number." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, students });
  } catch (error) {
    console.error("Student lookup error:", error);
    return NextResponse.json(
      { error: "Failed to fetch student data." },
      { status: 500 }
    );
  }
}
