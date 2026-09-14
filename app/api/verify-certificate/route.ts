import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function cleanCertificateNo(value: string) {
  return value.trim().replace(/\s+/g, " ").toUpperCase();
}

function cleanName(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const certificateNo = cleanCertificateNo(searchParams.get("certificateNo") ?? "");
    const name = cleanName(searchParams.get("name") ?? "");

    if (!certificateNo || !name) {
      return NextResponse.json({ error: "Certificate number and student name are required." }, { status: 400 });
    }

    const certificate = await prisma.manualCertificate.findUnique({
      where: { certificateNo },
    });

    if (!certificate || cleanName(certificate.studentName) !== name) {
      return NextResponse.json({ error: "No verified certificate found for these details." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      certificate: {
        studentName: certificate.studentName,
        phone: certificate.phone,
        certificateNo: certificate.certificateNo,
        certificateUrl: certificate.certificateUrl,
        issuedAt: certificate.issuedAt,
        createdAt: certificate.createdAt,
      },
    });
  } catch (error) {
    console.error("Verify certificate error:", error);
    return NextResponse.json({ error: "Could not verify certificate. Please try again." }, { status: 500 });
  }
}
