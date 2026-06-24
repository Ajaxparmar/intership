import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
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

function generateStudentPassword(fullName: string, phone: string) {
  const namePrefix = fullName.replace(/[^a-zA-Z]/g, "").slice(0, 4).toLowerCase();
  return `${namePrefix}@${phone.slice(-4)}`;
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

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(searchParams.get("pageSize") || DEFAULT_PAGE_SIZE)));
    const query = searchParams.get("query")?.trim();
    const where = query
      ? {
          OR: [
            { fullName: { contains: query, mode: "insensitive" as const } },
            { phone: { contains: query } },
            { email: { contains: query, mode: "insensitive" as const } },
            { courseName: { contains: query, mode: "insensitive" as const } },
            { batchName: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : undefined;

    const [students, totalStudents] = await Promise.all([
      prisma.student.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          fullName: true,
          phone: true,
          email: true,
          address: true,
          fatherName: true,
          collegeUniversity: true,
          profileImage: true,
          courseName: true,
          batchId: true,
          batchName: true,
          duration: true,
          startDate: true,
          endDate: true,
          totalFee: true,
          paidFee: true,
          feeStatus: true,
          nextDueDate: true,
          feeNotes: true,
          attendance: { orderBy: { date: "desc" }, take: 10 },
          offerLetters: {
            orderBy: { createdAt: "desc" },
            select: { id: true },
          },
        },
      }),
      prisma.student.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      students,
      pagination: {
        page,
        pageSize,
        totalStudents,
        totalPages: Math.max(1, Math.ceil(totalStudents / pageSize)),
      },
    });
  } catch (error) {
    console.error("List students error:", error);
    return NextResponse.json({ error: "Failed to load students." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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

    const existing = await prisma.student.findUnique({ where: { phone } });
    if (existing) {
      return NextResponse.json({ error: "A student with this phone number already exists." }, { status: 409 });
    }

    const password = generateStudentPassword(fullName, phone);
    const profileImage = await saveStudentImage(formData.get("profileImage") as File | null, phone);
    const nextDueDate = get("nextDueDate") || undefined;
    const batch = batchId
      ? await prisma.batch.findUnique({ where: { id: batchId } })
      : null;

    if (batchId && !batch) {
      return NextResponse.json({ error: "Selected batch was not found." }, { status: 404 });
    }

    const student = await prisma.student.create({
      data: {
        fullName,
        phone,
        passwordHash: hashPassword(password),
        user: {
          create: {
            fullName,
            phone,
            email: get("email") || undefined,
            passwordHash: hashPassword(password),
            role: "STUDENT",
          },
        },
        email: get("email") || undefined,
        address: get("address") || undefined,
        fatherName: get("fatherName") || undefined,
        collegeUniversity,
        profileImage,
        courseName: batch?.course || typedCourseName,
        batch: batch ? { connect: { id: batch.id } } : undefined,
        batchName: batch?.name || get("batchName") || undefined,
        duration: get("duration") || undefined,
        startDate: batch?.startDate || get("startDate") || undefined,
        endDate: batch?.endDate || get("endDate") || undefined,
        totalFee,
        paidFee,
        feeStatus: feeStatus(totalFee, paidFee, nextDueDate),
        nextDueDate,
        feeNotes: get("feeNotes") || undefined,
        feeReceipts: paidFee > 0
          ? {
              create: {
                receiptNo: `RCP-${Date.now()}`,
                amount: paidFee,
                paidOn: new Date().toISOString().slice(0, 10),
                paymentMode: get("paymentMode") || "UPI",
                notes: "Initial payment received during student registration.",
              },
            }
          : undefined,
        offerLetters: {
          create: {
            title: get("offerTitle") || "Industrial Training Offer Letter",
            issueDate: get("offerIssueDate") || new Date().toISOString().slice(0, 10),
            notes: get("offerNotes") || undefined,
          },
        },
      },
      include: { offerLetters: true, attendance: true, batch: true, group: true, feeReceipts: true, leaveRequests: true },
    });

    await Promise.all([
      ...student.offerLetters.map((letter) =>
        prisma.offerLetter.update({
          where: { id: letter.id },
          data: { letterUrl: `/documents/offer-letter/${letter.id}` },
        })
      ),
      ...student.feeReceipts.map((receipt) =>
        prisma.feeReceipt.update({
          where: { id: receipt.id },
          data: { receiptUrl: `/documents/fee-receipt/${receipt.id}` },
        })
      ),
    ]);

    const savedStudent = await prisma.student.findUniqueOrThrow({
      where: { id: student.id },
      include: { offerLetters: true, attendance: true, batch: true, group: true, feeReceipts: true, leaveRequests: true },
    });
    const { passwordHash, ...safeStudent } = savedStudent;
    void passwordHash;
    return NextResponse.json({ success: true, student: safeStudent, generatedPassword: password }, { status: 201 });
  } catch (error) {
    console.error("Create student error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to register student." },
      { status: 500 }
    );
  }
}
