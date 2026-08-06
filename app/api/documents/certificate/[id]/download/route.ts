import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pageToPdf } from "@/lib/browser-pdf";

export const runtime = "nodejs";
export const maxDuration = 60;

function filename(name: string) {
  return name.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const student = await prisma.student.findUnique({
    where: { id },
    select: { fullName: true },
  });

  if (!student) {
    return NextResponse.json({ error: "Student not found." }, { status: 404 });
  }

  const documentUrl = new URL(`/documents/certificate/${id}`, request.url);
  const pdf = await pageToPdf(documentUrl.toString());

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="certificate-${filename(student.fullName)}.pdf"`,
    },
  });
}
