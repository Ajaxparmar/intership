import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { offerRefNo } from "@/lib/generated-documents";

function cleanCertificateNo(value: string) {
  return value.trim().replace(/\s+/g, " ").toUpperCase();
}

function cleanName(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function sequenceFromCertificateNo(value: string) {
  const match = value.match(/^CS\/INT\/OFF\/2026\/0*(\d+)$/);
  return match ? Number(match[1]) : null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const certificateNo = cleanCertificateNo(searchParams.get("certificateNo") ?? "");
    const name = cleanName(searchParams.get("name") ?? "");

    if (!certificateNo || !name) {
      return NextResponse.json({ error: "Certificate number and student name are required." }, { status: 400 });
    }

    const manualCertificate = await prisma.manualCertificate.findUnique({
      where: { certificateNo },
    });

    if (manualCertificate && cleanName(manualCertificate.studentName) === name) {
      return NextResponse.json({
        success: true,
        certificate: {
          studentName: manualCertificate.studentName,
          phone: manualCertificate.phone,
          certificateNo: manualCertificate.certificateNo,
          certificateUrl: manualCertificate.certificateUrl,
          issuedAt: manualCertificate.issuedAt,
          createdAt: manualCertificate.createdAt,
        },
      });
    }

    const refSequence = sequenceFromCertificateNo(certificateNo);
    if (refSequence) {
      const offer = await prisma.offerLetter.findFirst({
        orderBy: { createdAt: "asc" },
        skip: refSequence - 1,
        include: { student: true },
      });

      if (offer && cleanName(offer.student.fullName) === name && offerRefNo(refSequence) === certificateNo) {
        return NextResponse.json({
          success: true,
          certificate: {
            studentName: offer.student.fullName,
            phone: offer.student.phone,
            certificateNo,
            certificateUrl: `/documents/certificate/${offer.student.id}`,
            issuedAt: offer.student.certificateIssueDate,
            createdAt: offer.student.createdAt,
          },
        });
      }
    }

    return NextResponse.json({ error: "No verified certificate found for these details." }, { status: 404 });
  } catch (error) {
    console.error("Verify certificate error:", error);
    return NextResponse.json({ error: "Could not verify certificate. Please try again." }, { status: 500 });
  }
}
