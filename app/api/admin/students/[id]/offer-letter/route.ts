import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();

    if (!data.title?.trim()) {
      return NextResponse.json({ error: "Offer letter title is required." }, { status: 400 });
    }

    const offerLetter = await prisma.offerLetter.create({
      data: {
        studentId: id,
        title: data.title.trim(),
        issueDate: data.issueDate || new Date().toISOString().slice(0, 10),
        notes: data.notes?.trim() || undefined,
      },
    });

    const savedOfferLetter = await prisma.offerLetter.update({
      where: { id: offerLetter.id },
      data: { letterUrl: `/documents/offer-letter/${offerLetter.id}` },
    });

    return NextResponse.json({ success: true, offerLetter: savedOfferLetter }, { status: 201 });
  } catch (error) {
    console.error("Offer letter error:", error);
    return NextResponse.json({ error: "Failed to save offer letter." }, { status: 500 });
  }
}
