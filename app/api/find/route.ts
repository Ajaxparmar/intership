import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rollNo = searchParams.get("rollNo")?.trim();
    const college = searchParams.get("college")?.trim();

    if (!rollNo || !college) {
      return NextResponse.json(
        { error: "Roll number and college are required." },
        { status: 400 }
      );
    }

    // Dev mock
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("localhost")) {
      return NextResponse.json({
        success: true,
        student: {
          fullName: "Demo Student",
          registrationNo: "CS/2026/01/001",
          college,
          academicClass: "B.Tech",
          semester: "6th",
          course: "Full Stack Development",
          rollNo,
          email: "demo@example.com",
          whatsappNo: "9876543210",
          gender: "Male",
          dob: "2002-05-15",
          fatherName: "Demo Father",
          createdAt: new Date().toISOString(),
        },
      });
    }

    const student = await prisma.admission.findFirst({
      where: { rollNo, college },
      select: {
        fullName: true,
        registrationNo: true,
        college: true,
        academicClass: true,
        semester: true,
        course: true,
        rollNo: true,
        email: true,
        whatsappNo: true,
        gender: true,
        dob: true,
        fatherName: true,
        createdAt: true,
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "No registration found for this Roll Number and College. Please check your details or contact support." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, student });
  } catch (error) {
    console.error("Find registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}