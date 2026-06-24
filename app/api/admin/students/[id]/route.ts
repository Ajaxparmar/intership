import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { prisma } from "@/lib/prisma";
import type { FeeStatus } from "@prisma/client";

export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024;
const IMAGE_UPLOAD_DIR = join(process.cwd(), "public", "uploads", "student-images");
const IMAGE_PUBLIC_PATH = "/uploads/student-images";

function feeStatus(totalFee: number, paidFee: number, nextDueDate?: string): FeeStatus {
  if (paidFee >= totalFee) return "PAID";
  if (nextDueDate && new Date(nextDueDate) < new Date()) return "OVERDUE";
  return paidFee > 0 ? "PARTIAL" : "PENDING";
}

function extensionFromMimeType(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  return "jpg";
}

async function saveStudentImage(file: File | null, phone: string) {
  if (!file || file.size === 0) return undefined;
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image must be smaller than 1.5 MB.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = extensionFromMimeType(file.type);
  const filename = `${phone}-${Date.now()}.${extension}`;

  await mkdir(IMAGE_UPLOAD_DIR, { recursive: true });
  await writeFile(join(IMAGE_UPLOAD_DIR, filename), buffer);

  return `${IMAGE_PUBLIC_PATH}/${filename}`;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const get = (key: string) => formData.get(key)?.toString().trim() ?? "";

    const fullName = get("fullName");
    const phone = get("phone").replace(/\D/g, "");
    const collegeUniversity = get("collegeUniversity");
    const batchId = get("batchId");
    const typedCourseName = get("courseName");
    const totalFee = Number(get("totalFee"));
    const paidFee = Number(get("paidFee") || 0);

    if (!fullName || !phone || !collegeUniversity || (!batchId && !typedCourseName) || !Number.isFinite(totalFee)) {
      return NextResponse.json({ error: "Name, phone, college/university, batch/course, and total fee are required." }, { status: 400 });
    }
    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json({ error: "Phone number must be 10 digits." }, { status: 400 });
    }
    if (totalFee < 0 || paidFee < 0 || paidFee > totalFee) {
      return NextResponse.json({ error: "Fee values are invalid." }, { status: 400 });
    }

    const [student, duplicatePhone, batch] = await Promise.all([
      prisma.student.findUnique({ where: { id } }),
      prisma.student.findUnique({ where: { phone } }),
      batchId ? prisma.batch.findUnique({ where: { id: batchId } }) : Promise.resolve(null),
    ]);

    if (!student) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }
    if (duplicatePhone && duplicatePhone.id !== id) {
      return NextResponse.json({ error: "A different student already uses this phone number." }, { status: 409 });
    }
    if (batchId && !batch) {
      return NextResponse.json({ error: "Selected batch was not found." }, { status: 404 });
    }

    const profileImage = await saveStudentImage(formData.get("profileImage") as File | null, phone);
    const nextDueDate = get("nextDueDate") || undefined;
    const updateData = {
      fullName,
      phone,
      email: get("email") || null,
      address: get("address") || null,
      fatherName: get("fatherName") || null,
      collegeUniversity,
      profileImage: profileImage ?? student.profileImage,
      courseName: batch?.course || typedCourseName,
      batchId: batch?.id || null,
      batchName: batch?.name || get("batchName") || null,
      duration: get("duration") || null,
      startDate: batch?.startDate || get("startDate") || null,
      endDate: batch?.endDate || get("endDate") || null,
      totalFee,
      paidFee,
      nextDueDate: nextDueDate || null,
      feeNotes: get("feeNotes") || null,
      feeStatus: feeStatus(totalFee, paidFee, nextDueDate),
    };

    const updatedStudent = await prisma.student.update({
      where: { id },
      data: updateData as any,
      include: {
        batch: true,
        attendance: { orderBy: { date: "desc" }, take: 10 },
        offerLetters: { orderBy: { createdAt: "desc" } },
        feeReceipts: { orderBy: { createdAt: "desc" } },
      },
    });

    if (student.userId) {
      await prisma.user.updateMany({
        where: { id: student.userId },
        data: {
          fullName,
          phone,
          email: get("email") || null,
        } as any,
      });
    }

    return NextResponse.json({ success: true, student: updatedStudent });
  } catch (error) {
    console.error("Update student error:", error);
    return NextResponse.json({ error: "Could not update student." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const student = await prisma.student.findUnique({
      where: { id },
      select: { id: true, fullName: true, userId: true },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }

    const leadGroupCount = await prisma.studentGroup.count({ where: { teamLeadId: id } });
    if (leadGroupCount > 0) {
      return NextResponse.json(
        { error: "Assign another team lead to this student's groups before deleting the student." },
        { status: 409 }
      );
    }

    await Promise.all([
      prisma.studentAttendance.deleteMany({ where: { studentId: id } }),
      prisma.offerLetter.deleteMany({ where: { studentId: id } }),
      prisma.leaveRequest.deleteMany({ where: { studentId: id } }),
      prisma.feeReceipt.deleteMany({ where: { studentId: id } }),
    ]);

    await prisma.student.delete({ where: { id } });
    if (student.userId) {
      await prisma.user.deleteMany({ where: { id: student.userId } });
    }

    return NextResponse.json({ success: true, deletedStudent: student.fullName });
  } catch (error) {
    console.error("Delete student error:", error);
    return NextResponse.json({ error: "Could not delete student." }, { status: 500 });
  }
}
