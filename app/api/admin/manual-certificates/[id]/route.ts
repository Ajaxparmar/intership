import { NextResponse } from "next/server";
import { mkdir, unlink, writeFile } from "node:fs/promises";
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
  if (!file || file.size === 0) return null;
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

async function removeUploadedFile(certificateUrl: string | null) {
  if (!certificateUrl?.startsWith(`${CERTIFICATE_PUBLIC_PATH}/`)) return;
  try {
    await unlink(join(process.cwd(), "public", certificateUrl));
  } catch {
    // Keep the admin action successful even if an old file is already gone.
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const studentName = formData.get("studentName")?.toString().trim() ?? "";
    const phone = cleanPhone(formData.get("phone")?.toString() ?? "");
    const certificateNo = cleanCertificateNo(formData.get("certificateNo")?.toString() ?? "");
    const issuedAt = formData.get("issuedAt")?.toString().trim() || null;
    const notes = formData.get("notes")?.toString().trim() || null;
    const file = formData.get("certificateFile") as File | null;

    if (!studentName || !phone || !certificateNo) {
      return NextResponse.json({ error: "Student name, phone number, and certificate number are required." }, { status: 400 });
    }
    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json({ error: "Enter a valid 10 digit phone number." }, { status: 400 });
    }

    const existing = await prisma.manualCertificate.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Certificate not found." }, { status: 404 });
    }

    const duplicate = await prisma.manualCertificate.findUnique({ where: { certificateNo } });
    if (duplicate && duplicate.id !== id) {
      return NextResponse.json({ error: "This certificate number is already uploaded." }, { status: 409 });
    }

    const savedFile = file && file.size > 0 ? await saveCertificateFile(file, certificateNo) : null;
    const certificate = await prisma.manualCertificate.update({
      where: { id },
      data: {
        studentName,
        phone,
        certificateNo,
        issuedAt,
        notes,
        ...(savedFile ?? {}),
      },
    });

    if (savedFile) await removeUploadedFile(existing.certificateUrl);

    return NextResponse.json({ success: true, certificate });
  } catch (error) {
    console.error("Update manual certificate error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not update certificate." },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const certificate = await prisma.manualCertificate.findUnique({ where: { id } });
    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found." }, { status: 404 });
    }

    await prisma.manualCertificate.delete({ where: { id } });
    await removeUploadedFile(certificate.certificateUrl);

    return NextResponse.json({ success: true, deletedCertificate: certificate.certificateNo });
  } catch (error) {
    console.error("Delete manual certificate error:", error);
    return NextResponse.json({ error: "Could not delete certificate." }, { status: 500 });
  }
}
