import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { FeeStatus } from "@prisma/client";

function feeStatus(totalFee: number, paidFee: number, nextDueDate?: string | null): FeeStatus {
  if (paidFee >= totalFee) return "PAID";
  if (nextDueDate && new Date(nextDueDate) < new Date()) return "OVERDUE";
  return paidFee > 0 ? "PARTIAL" : "PENDING";
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    const amount = Number(data.amount);
    if (!Number.isFinite(amount) || amount <= 0 || !data.paidOn) {
      return NextResponse.json({ error: "Valid amount and payment date are required." }, { status: 400 });
    }

    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }
    const pendingFee = Math.max(0, student.totalFee - student.paidFee);
    if (amount > pendingFee) {
      return NextResponse.json({ error: `Payment cannot exceed the pending fee of ₹${pendingFee}.` }, { status: 400 });
    }

    const receipt = await prisma.feeReceipt.create({
      data: {
        studentId: id,
        receiptNo: data.receiptNo?.trim() || `RCP-${Date.now()}`,
        amount,
        paidOn: data.paidOn,
        paymentMode: data.paymentMode?.trim() || undefined,
        notes: data.notes?.trim() || undefined,
      },
    });
    const paidFee = student.paidFee + amount;
    const [savedReceipt] = await Promise.all([
      prisma.feeReceipt.update({
        where: { id: receipt.id },
        data: { receiptUrl: `/documents/fee-receipt/${receipt.id}` },
      }),
      prisma.student.update({
        where: { id },
        data: {
          paidFee,
          feeStatus: feeStatus(student.totalFee, paidFee, student.nextDueDate),
        },
      }),
    ]);
    return NextResponse.json({ success: true, receipt: savedReceipt }, { status: 201 });
  } catch (error) {
    console.error("Create receipt error:", error);
    return NextResponse.json({ error: "Could not create fee receipt." }, { status: 500 });
  }
}
