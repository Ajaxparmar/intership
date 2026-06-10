"use client";

import React, { FormEvent, useEffect, useState } from "react";
import Header from "@/app/components/Header";
import { BookOpen, CalendarCheck, Download, ExternalLink, FileText, IndianRupee, Lock, LogOut, Phone, ReceiptText, User } from "lucide-react";

type Student = {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  fatherName?: string;
  address?: string;
  collegeUniversity?: string;
  profileImage?: string;
  courseName: string;
  batchName?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  totalFee: number;
  paidFee: number;
  feeStatus: string;
  nextDueDate?: string;
  feeNotes?: string;
  attendance: { id: string; date: string; status: string; remarks?: string }[];
  offerLetters: { id: string; title: string; issueDate: string; letterUrl?: string; notes?: string }[];
  feeReceipts: { id: string; receiptNo: string; amount: number; paidOn: string; paymentMode?: string; receiptUrl?: string }[];
};

const STUDENT_SESSION_KEY = "codescaler-student-session";

export default function StudentLoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [restoringSession, setRestoringSession] = useState(true);

  useEffect(() => {
    try {
      const savedStudent = window.localStorage.getItem(STUDENT_SESSION_KEY);
      if (savedStudent) setStudent(JSON.parse(savedStudent));
    } catch {
      window.localStorage.removeItem(STUDENT_SESSION_KEY);
    } finally {
      setRestoringSession(false);
    }
  }, []);

  const logout = () => {
    window.localStorage.removeItem(STUDENT_SESSION_KEY);
    setStudent(null);
    setPhone("");
    setPassword("");
    setError("");
  };

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");
      setStudent(data.student);
      window.localStorage.setItem(STUDENT_SESSION_KEY, JSON.stringify(data.student));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const due = student ? Math.max(0, student.totalFee - student.paidFee) : 0;
  const attendanceCounts = student?.attendance.reduce<Record<string, number>>((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {}) ?? {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/40">
      <Header active="student-login" />

      <main className="max-w-6xl mx-auto px-4 py-12">
        {restoringSession ? (
          <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center font-bold text-slate-500 shadow-xl shadow-slate-200/70">
            Restoring your session...
          </div>
        ) : !student ? (
          <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/70 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <User size={30} />
              </div>
              <h1 className="text-3xl font-black text-slate-900">Student Login</h1>
              <p className="text-sm text-slate-500 mt-2">Use your registered phone number and password.</p>
            </div>

            <form onSubmit={login} className="space-y-5">
              <Input icon={<Phone size={16} />} label="Phone Number" value={phone} onChange={setPhone} required />
              <Input icon={<Lock size={16} />} label="Password" type="password" value={password} onChange={setPassword} required />
              {error && <p className="rounded-2xl bg-red-50 border border-red-100 p-3 text-sm font-bold text-red-600">{error}</p>}
              <button disabled={loading} className="w-full rounded-2xl bg-blue-600 py-3 font-black text-white shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-60">
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row gap-5 md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center text-slate-400">
                  {student.profileImage ? <img src={student.profileImage} alt={student.fullName} className="w-full h-full object-cover" /> : <User size={30} />}
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-wider text-blue-600">Welcome back</p>
                  <h1 className="text-3xl font-black text-slate-900">{student.fullName}</h1>
                  <p className="text-sm text-slate-500">{student.phone} {student.email ? `• ${student.email}` : ""}</p>
                </div>
              </div>
              <button onClick={logout} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-50 px-5 py-3 font-black text-red-600 transition hover:bg-red-100">
                <LogOut size={17} /> Logout
              </button>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <section className="bg-white rounded-3xl border border-slate-200 p-6">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-5">
                  <User size={20} className="text-blue-600" /> Student Profile
                </h2>
                <div className="mx-auto mb-5 flex h-44 w-44 items-center justify-center overflow-hidden rounded-3xl bg-slate-100 text-slate-400 ring-4 ring-blue-50">
                  {student.profileImage ? (
                    <img src={student.profileImage} alt={`${student.fullName} profile`} className="h-full w-full object-cover" />
                  ) : (
                    <User size={54} />
                  )}
                </div>
                <div className="space-y-3">
                  <Info label="Name" value={student.fullName} />
                  <Info label="Phone Number" value={student.phone} />
                  <Info label="Email" value={student.email || "Not added"} />
                  <Info label="College / University" value={student.collegeUniversity || "Not added"} />
                  <Info label="Address" value={student.address || "Not added"} />
                </div>
              </section>

              <section className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-5">
                  <BookOpen size={20} className="text-blue-600" /> Course Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Info label="Course" value={student.courseName} />
                  <Info label="Batch" value={student.batchName || "Not assigned"} />
                  <Info label="Duration" value={student.duration || "Not added"} />
                  <Info label="Start Date" value={student.startDate || "Not added"} />
                  <Info label="End Date" value={student.endDate || "Not added"} />
                  <Info label="Father Name" value={student.fatherName || "Not added"} />
                </div>
              </section>

              <section className="bg-white rounded-3xl border border-slate-200 p-6">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-5">
                  <IndianRupee size={20} className="text-emerald-600" /> Fee Information
                </h2>
                <div className="space-y-3">
                  <FeeRow label="Total Fee" value={`₹${student.totalFee}`} />
                  <FeeRow label="Paid Fee" value={`₹${student.paidFee}`} />
                  <FeeRow label="Due Fee" value={`₹${due}`} highlight={due === 0 ? "green" : "amber"} />
                  <FeeRow label="Status" value={student.feeStatus} />
                  {student.nextDueDate && <FeeRow label="Next Due" value={student.nextDueDate} />}
                </div>
                {student.feeNotes && <p className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">{student.feeNotes}</p>}
              </section>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <section className="bg-white rounded-3xl border border-slate-200 p-6">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-5">
                  <CalendarCheck size={20} className="text-purple-600" /> Attendance
                </h2>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <Stat label="Present" value={attendanceCounts.PRESENT || 0} />
                  <Stat label="Absent" value={attendanceCounts.ABSENT || 0} />
                  <Stat label="Leave" value={attendanceCounts.LEAVE || 0} />
                </div>
                <div className="space-y-2">
                  {student.attendance.length === 0 && <p className="text-sm text-slate-500">No attendance records added yet.</p>}
                  {student.attendance.map((item) => (
                    <div key={item.id} className="flex justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
                      <span>{item.date}</span>
                      <span>{item.status}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-white rounded-3xl border border-slate-200 p-6">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-5">
                  <FileText size={20} className="text-blue-600" /> Offer Letters
                </h2>
                <div className="space-y-3">
                  {student.offerLetters.length === 0 && <p className="text-sm text-slate-500">No offer letter issued yet.</p>}
                  {student.offerLetters.map((letter) => (
                    <div key={letter.id} className="rounded-2xl border border-slate-200 p-4">
                      <p className="font-black text-slate-900">{letter.title}</p>
                      <p className="text-sm text-slate-500">Issued on {letter.issueDate}</p>
                      {letter.notes && <p className="text-sm text-slate-600 mt-2">{letter.notes}</p>}
                      <DocumentActions viewUrl={letter.letterUrl || `/documents/offer-letter/${letter.id}`} downloadUrl={`/api/documents/offer-letter/${letter.id}/download`} />
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-white rounded-3xl border border-slate-200 p-6">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-5">
                  <ReceiptText size={20} className="text-emerald-600" /> Fee Receipts
                </h2>
                <div className="space-y-3">
                  {student.feeReceipts.length === 0 && <p className="text-sm text-slate-500">No fee receipt generated yet.</p>}
                  {student.feeReceipts.map((receipt) => (
                    <div key={receipt.id} className="rounded-2xl border border-slate-200 p-4">
                      <p className="font-black text-slate-900">{receipt.receiptNo}</p>
                      <p className="text-sm text-slate-500">₹{receipt.amount} paid on {receipt.paidOn}</p>
                      {receipt.paymentMode && <p className="mt-1 text-xs font-bold text-slate-500">Mode: {receipt.paymentMode}</p>}
                      <DocumentActions viewUrl={receipt.receiptUrl || `/documents/fee-receipt/${receipt.id}`} downloadUrl={`/api/documents/fee-receipt/${receipt.id}/download`} />
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Input({ label, value, onChange, icon, type = "text", required }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>}
        <input
          required={required}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white ${icon ? "pl-9" : ""}`}
        />
      </div>
    </label>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</p>
      <p className="font-bold text-slate-800 mt-1">{value}</p>
    </div>
  );
}

function FeeRow({ label, value, highlight }: { label: string; value: string; highlight?: "green" | "amber" }) {
  const color = highlight === "green" ? "text-emerald-700" : highlight === "amber" ? "text-amber-700" : "text-slate-800";
  return (
    <div className="flex justify-between border-b border-slate-100 pb-2 text-sm">
      <span className="font-bold text-slate-500">{label}</span>
      <span className={`font-black ${color}`}>{value}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3 text-center">
      <p className="text-2xl font-black text-slate-900">{value}</p>
      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</p>
    </div>
  );
}

function DocumentActions({ viewUrl, downloadUrl }: { viewUrl: string; downloadUrl: string }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <a href={viewUrl} target="_blank" className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-2 text-xs font-black text-white">
        <ExternalLink size={13} /> View
      </a>
      <a href={downloadUrl} className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-700">
        <Download size={13} /> Download
      </a>
    </div>
  );
}
