import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// College code mapping
const COLLEGE_CODES: Record<string, string> = {
  "CRSU Jind": "01",
  "Govt PG College Jind": "02",
  "Govt PIG College Jind": "03",
  "Hindu Kanya Mahavidyalaya Jind": "04",
  "JIET": "05",
  "Govt College Uchana": "06",
  "GJU Hisar": "07",
};

function getCollegeCode(collegeName: string): string {
  return COLLEGE_CODES[collegeName] ?? "00";
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Required field validation
    const required = [
      "fullName", "address", "whatsappNo", "email",
      "fatherName", "fatherContact", "dob", "gender",
      "aadharCard", "academicClass", "semester",
      "rollNo", "college", "course", "postCode",
    ];
    for (const field of required) {
      if (!data[field]?.toString().trim()) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Dev mock when DB not set
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("localhost")) {
      const collegeCode = getCollegeCode(data.college);
      const mockSeq = Math.floor(Math.random() * 900) + 100;
      const mockRegNo = `CS/2026/${collegeCode}/${String(mockSeq).padStart(3, "0")}`;
      return NextResponse.json({
        success: true,
        message: "Application received (Development Mock)",
        registrationNo: mockRegNo,
      });
    }

    const collegeCode = getCollegeCode(data.college);

    // Count existing admissions for this college to generate sequential number
    const existingCount = await prisma.admission.count({
      where: { college: data.college },
    });
    const seqNumber = String(existingCount + 1).padStart(3, "0");
    const registrationNo = `CS/2026/${collegeCode}/${seqNumber}`;

    const admission = await prisma.admission.create({
      data: {
        fullName: data.fullName,
        address: data.address,
        whatsappNo: data.whatsappNo,
        email: data.email,
        fatherName: data.fatherName,
        fatherContact: data.fatherContact,
        dob: data.dob,
        gender: data.gender,
        aadharCard: data.aadharCard,
        academicClass: data.academicClass,
        semester: data.semester,
        rollNo: data.rollNo,
        college: data.college,
        course: data.course,
        postCode: data.postCode,
        registrationNo,
        collegeCode,
      },
    });

    return NextResponse.json(
      { success: true, registrationNo: admission.registrationNo, admissionId: admission.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admission API error:", error);
    return NextResponse.json({ error: "Failed to submit application." }, { status: 500 });
  }
}