import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { certificateDocument } from "@/lib/generated-documents";

async function certificateRefSequence(student: { id: string; createdAt: Date }) {
  const offer = await prisma.offerLetter.findFirst({
    where: { studentId: student.id },
    orderBy: { createdAt: "asc" },
  });

  if (offer) {
    return prisma.offerLetter.count({
      where: {
        createdAt: { lte: offer.createdAt },
      },
    });
  }

  return prisma.student.count({
    where: {
      createdAt: { lte: student.createdAt },
    },
  });
}

export default async function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const student = await prisma.student.findUnique({
    where: { id },
  });

  if (!student) notFound();

  const refSequence = await certificateRefSequence(student);

  return certificateDocument(student, refSequence);
}
