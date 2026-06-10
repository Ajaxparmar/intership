import React from "react";
import FeeSlipTemplate from "@/app/components/FeeSlipTemplate";
import OfferLetterTemplate from "@/app/components/OfferLetterTemplate";

export type StudentDocumentData = {
  id: string;
  fullName: string;
  phone: string;
  fatherName: string | null;
  address: string | null;
  collegeUniversity: string | null;
  courseName: string;
  batchName: string | null;
  duration: string | null;
  startDate: string | null;
};

export type ReceiptDocumentData = {
  id: string;
  receiptNo: string;
  amount: number;
  paidOn: string;
  paymentMode: string | null;
  student: StudentDocumentData;
};

export type OfferDocumentData = {
  id: string;
  issueDate: string;
  student: StudentDocumentData;
};

const logoPath = "/android-chrome-192x192.png";

function sequence(id: string) {
  return parseInt(id.slice(-6), 16).toString().slice(-6);
}

export function receiptDocument(receipt: ReceiptDocumentData) {
  const student = receipt.student;
  return (
    <FeeSlipTemplate
      refSequence={sequence(receipt.id)}
      name={student.fullName}
      fatherName={student.fatherName || ""}
      rollNumber={student.phone}
      course={student.courseName}
      university={student.collegeUniversity || ""}
      address={student.address || ""}
      domain={student.courseName}
      batchDateTime={[student.batchName, student.startDate].filter(Boolean).join(" | ")}
      amount={receipt.amount}
      paymentMode={receipt.paymentMode || "Payment"}
      paymentDate={receipt.paidOn}
      logoPath={logoPath}
      stampPath="/SignandStamp.png"
    />
  );
}

export function offerDocument(offer: OfferDocumentData, refSequence: number) {
  const student = offer.student;
  return (
    <OfferLetterTemplate
      refSequence={String(refSequence)}
      name={student.fullName}
      phoneNumber={student.phone}
      course={student.courseName}
      university={student.collegeUniversity || ""}
      domain={student.courseName}
      date={offer.issueDate}
      logoPath={logoPath}
      stampPath="/SignandStamp.png"
    />
  );
}

function escapeHtml(value: string | number | null) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function downloadShell(title: string, heading: string, rows: [string, string | number | null][], message: string, footerImage?: string) {
  const details = rows.map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`).join("");
  const image = footerImage ? `<div class="signature"><img src="${escapeHtml(footerImage)}" alt="Signature and Stamp"></div>` : "";
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>
body{margin:0;background:#f1f5f9;color:#1e293b;font:15px Arial,sans-serif}.page{box-sizing:border-box;width:794px;min-height:1123px;margin:24px auto;padding:56px;background:#fff}.brand{color:#2563eb;font-size:28px;font-weight:800}.heading{margin:40px 0 24px;padding:16px;background:#eff6ff;color:#1e3a8a;text-align:center}table{width:100%;border-collapse:collapse}th,td{border:1px solid #cbd5e1;padding:12px;text-align:left}th{width:34%;background:#f8fafc}.message{margin-top:32px;line-height:1.7}.signature{margin-top:48px}.signature img{width:180px;max-height:145px;object-fit:contain}.footer{margin-top:48px;border-top:2px solid #2563eb;padding-top:16px;color:#64748b;font-size:12px}@media print{body{background:#fff}.page{margin:0}}
</style></head><body><main class="page"><div class="brand">Code Scaler</div><h1 class="heading">${escapeHtml(heading)}</h1><table>${details}</table><p class="message">${escapeHtml(message)}</p>${image}<div class="footer">Code Scaler | Jind, Haryana | www.codescaler.com | +91 9588161422</div></main></body></html>`;
}

export function receiptDownloadHtml(receipt: ReceiptDocumentData, stampUrl = "/SignandStamp.png") {
  return downloadShell(receipt.receiptNo, "Payment Receipt - Internship Fee", [
    ["Receipt Number", receipt.receiptNo],
    ["Student Name", receipt.student.fullName],
    ["Phone / Roll Number", receipt.student.phone],
    ["Course", receipt.student.courseName],
    ["Batch", receipt.student.batchName],
    ["Amount Paid", `INR ${receipt.amount.toLocaleString("en-IN")}`],
    ["Payment Date", receipt.paidOn],
    ["Payment Mode", receipt.paymentMode || "Payment"],
  ], "This receipt confirms payment received by Code Scaler towards the Industrial Internship Program.", stampUrl);
}

export function offerDownloadHtml(offer: OfferDocumentData, title: string, stampUrl = "/SignandStamp.png") {
  return downloadShell(title, "Internship Offer Letter", [
    ["Student Name", offer.student.fullName],
    ["Phone / Roll Number", offer.student.phone],
    ["Course / Domain", offer.student.courseName],
    ["College / University", offer.student.collegeUniversity],
    ["Batch", offer.student.batchName],
    ["Duration", offer.student.duration],
    ["Start Date", offer.student.startDate],
    ["Issue Date", offer.issueDate],
  ], "We are pleased to offer you an internship with Code Scaler. This letter serves as your official offer for the Industrial Internship Program.", stampUrl);
}
