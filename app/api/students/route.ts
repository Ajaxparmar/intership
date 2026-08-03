import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone")?.replace(/\D/g, "");

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required." },
        { status: 400 }
      );
    }

    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { error: "Phone number must be 10 digits." },
        { status: 400 }
      );
    }

    const student = await prisma.student.findUnique({
      where: { phone },
      select: {
        id: true,
        fullName: true,
        phone: true,
        email: true,
        address: true,
        fatherName: true,
        collegeUniversity: true,
        profileImage: true,
        courseName: true,
        batchName: true,
        duration: true,
        startDate: true,
        endDate: true,
        totalFee: true,
        paidFee: true,
        feeStatus: true,
        nextDueDate: true,
        group: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        batch: {
          select: {
            id: true,
            name: true,
            course: true,
            batchType: true,
            instructor: true,
            startDate: true,
            endDate: true,
            timingStart: true,
            timingEnd: true,
            days: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "No student found for this phone number." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, student });
  } catch (error) {
    console.error("Student lookup error:", error);
    return NextResponse.json(
      { error: "Failed to fetch student data." },
      { status: 500 }
    );
  }
}
