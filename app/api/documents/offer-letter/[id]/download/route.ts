import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pageToPdf } from "@/lib/browser-pdf";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const offer = await prisma.offerLetter.findUnique({
    where: { id },
    include: { student: true },
  });

  if (!offer) {
    return NextResponse.json({ error: "Offer letter not found." }, { status: 404 });
  }

  const documentUrl = new URL(`/documents/offer-letter/${offer.id}`, request.url);
  const pdf = await pageToPdf(documentUrl.toString());
  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="offer-letter-${offer.student.fullName.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.pdf"`,
    },
  });
}
