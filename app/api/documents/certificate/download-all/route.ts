import { NextResponse } from "next/server";
import JSZip from "jszip";
import { prisma } from "@/lib/prisma";
import { pagesToPdf } from "@/lib/browser-pdf";

export const runtime = "nodejs";
export const maxDuration = 300;

function filename(name: string) {
  return name.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
}

export async function GET(request: Request) {
  const students = await prisma.student.findMany({
    select: { id: true, fullName: true },
    orderBy: { fullName: "asc" },
  });

  if (students.length === 0) {
    return NextResponse.json({ error: "No students found." }, { status: 404 });
  }

  const urls = students.map(
    (student) => new URL(`/documents/certificate/${student.id}`, request.url).toString()
  );
  const pdfs = await pagesToPdf(urls);

  const zip = new JSZip();
  students.forEach((student, index) => {
    const uniqueSuffix = student.id.slice(-6);
    zip.file(`certificate-${filename(student.fullName)}-${uniqueSuffix}.pdf`, pdfs[index]);
  });

  const archive = await zip.generateAsync({ type: "nodebuffer" });

  return new NextResponse(archive, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="certificates.zip"`,
    },
  });
}
