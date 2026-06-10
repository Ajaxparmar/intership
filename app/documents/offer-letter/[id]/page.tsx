import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { offerDocument } from "@/lib/generated-documents";

export default async function OfferLetterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const offer = await prisma.offerLetter.findUnique({
    where: { id },
    include: { student: true },
  });

  if (!offer) notFound();

  const refSequence = await prisma.offerLetter.count({
    where: {
      createdAt: { lte: offer.createdAt },
    },
  });

  return offerDocument(offer, refSequence);
}
