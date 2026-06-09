import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pageToPdf } from "@/lib/browser-pdf";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const receipt = await prisma.feeReceipt.findUnique({
    where: { id },
    include: { student: true },
  });

  if (!receipt) {
    return NextResponse.json({ error: "Fee receipt not found." }, { status: 404 });
  }

  const documentUrl = new URL(`/documents/fee-receipt/${receipt.id}`, request.url);
  const pdf = await pageToPdf(documentUrl.toString());
  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${receipt.receiptNo}.pdf"`,
    },
  });
}
