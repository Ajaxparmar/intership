import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const MAX_CERTIFICATE_BYTES = 8 * 1024 * 1024;
const CERTIFICATE_UPLOAD_DIR = join(process.cwd(), "public", "uploads", "manual-certificates");
const CERTIFICATE_PUBLIC_PATH = "/uploads/manual-certificates";

function cleanCertificateNo(value: string) {
  return value.trim().replace(/\s+/g, " ").toUpperCase();
}

function cleanPhone(value: string) {
  return value.replace(/\D/g, "");
}

function safeFilename(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "certificate";
}

function extensionFromFile(file: File) {
  const originalExtension = extname(file.name).replace(".", "").toLowerCase();
  if (originalExtension) return originalExtension;
  if (file.type === "application/pdf") return "pdf";
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

async function saveCertificateFile(file: File, certificateNo: string) {
  if (!file || file.size === 0) {
    throw new Error("Upload the certificate file.");
  }
  if (file.size > MAX_CERTIFICATE_BYTES) {
    throw new Error("Certificate file must be smaller than 8 MB.");
  }
  if (file.type && !file.type.startsWith("image/") && file.type !== "application/pdf") {
    throw new Error("Only PDF or image certificate files are allowed.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = extensionFromFile(file);
  const filename = `${safeFilename(certificateNo)}-${Date.now()}.${extension}`;

  await mkdir(CERTIFICATE_UPLOAD_DIR, { recursive: true });
  await writeFile(join(CERTIFICATE_UPLOAD_DIR, filename), buffer);

  return {
    certificateUrl: `${CERTIFICATE_PUBLIC_PATH}/${filename}`,
    fileName: file.name || filename,
  };
}

export async function GET() {
  try {
    const certificates = await prisma.manualCertificate.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ success: true, certificates });
  } catch (error) {
    console.error("List manual certificates error:", error);
    return NextResponse.json({ error: "Failed to load manual certificates." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const studentName = formData.get("studentName")?.toString().trim() ?? "";
    const phone = cleanPhone(formData.get("phone")?.toString() ?? "");
    const certificateNo = cleanCertificateNo(formData.get("certificateNo")?.toString() ?? "");
    const issuedAt = formData.get("issuedAt")?.toString().trim() || undefined;
    const notes = formData.get("notes")?.toString().trim() || undefined;
    const file = formData.get("certificateFile") as File | null;

    if (!studentName || !phone || !certificateNo) {
      return NextResponse.json({ error: "Student name, phone number, and certificate number are required." }, { status: 400 });
    }
    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json({ error: "Enter a valid 10 digit phone number." }, { status: 400 });
    }

    const existing = await prisma.manualCertificate.findUnique({ where: { certificateNo } });
    if (existing) {
      return NextResponse.json({ error: "This certificate number is already uploaded." }, { status: 409 });
    }

    const savedFile = await saveCertificateFile(file as File, certificateNo);
    const certificate = await prisma.manualCertificate.create({
      data: {
        studentName,
        phone,
        certificateNo,
        issuedAt,
        notes,
        ...savedFile,
      },
    });

    return NextResponse.json({ success: true, certificate }, { status: 201 });
  } catch (error) {
    console.error("Create manual certificate error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not upload certificate." },
      { status: 500 }
    );
  }
}
