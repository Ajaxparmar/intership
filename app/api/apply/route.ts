import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Basic validation
    if (!data.name || !data.email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("localhost")) {
      return NextResponse.json({ 
        success: true, 
        message: "Application received (Development Mock)",
        applicationId: "mock_id_" + Math.random().toString(36).substr(2, 9)
      });
    }

    const application = await prisma.application.create({
      data: {
        name: data.name,
        fatherName: data.fatherName,
        address: data.address,
        gender: data.gender,
        phone: data.phone,
        email: data.email,
        academicClass: data.academicClass,
        yearSemester: data.yearSemester,
        rollNo: data.rollNo,
        collegeName: data.collegeName,
        universityName: data.universityName,
        duration: data.duration,
        domain: data.domain,
        amount: parseFloat(data.amount),
      },
    });

    return NextResponse.json({ success: true, applicationId: application.id }, { status: 201 });
  } catch (error) {
    console.error("Application error:", error);
    return NextResponse.json({ error: "Failed to submit application." }, { status: 500 });
  }
}
