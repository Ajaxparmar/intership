import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { receiptDocument } from "@/lib/generated-documents";

export default async function FeeReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const receipt = await prisma.feeReceipt.findUnique({
    where: { id },
    include: { student: true },
  });

  if (!receipt) notFound();
  return receiptDocument(receipt);
}
