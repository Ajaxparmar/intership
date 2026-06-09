"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CalendarCheck, FileText, IndianRupee, Pencil, PlusCircle, Search, Trash2, User, X } from "lucide-react";

type Attendance = {
  id: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "LEAVE";
};

type Student = {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  profileImage?: string;
  courseName: string;
  batchId?: string;
  batchName?: string;
  totalFee: number;
  paidFee: number;
  feeStatus: string;
  nextDueDate?: string;
  attendance: Attendance[];
  offerLetters: { id: string }[];
};

type Batch = {
  id: string;
  name: string;
  course: string;
  startDate: string;
  endDate: string;
};

const today = new Date().toISOString().slice(0, 10);
const initialEditForm = { batchId: "", nextDueDate: "", paymentAmount: "", paymentMode: "UPI", paidOn: today };

export default function StudentsTablePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(today);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editForm, setEditForm] = useState(initialEditForm);
  const [editMessage, setEditMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/students");
      const data = await res.json();
      if (data.success) setStudents(data.students);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
    fetch("/api/batch")
      .then((res) => res.json())
      .then((data) => data.success && setBatches(data.batches));
  }, []);

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return students;
    return students.filter((student) =>
      [student.fullName, student.phone, student.email, student.courseName, student.batchName]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(text)
    );
  }, [query, students]);

  const markAttendance = async (studentId: string, status: Attendance["status"]) => {
    const res = await fetch(`/api/admin/students/${studentId}/attendance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: attendanceDate, status }),
    });
    if (res.ok) await loadStudents();
  };

  const openEdit = (student: Student) => {
    setEditingStudent(student);
    setEditMessage("");
    setEditForm({
      batchId: student.batchId || "",
      nextDueDate: student.nextDueDate || "",
      paymentAmount: "",
      paymentMode: "UPI",
      paidOn: today,
    });
  };

  const saveStudent = async () => {
    if (!editingStudent) return;
    setSaving(true);
    setEditMessage("");

    try {
      const updateRes = await fetch(`/api/admin/students/${editingStudent.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchId: editForm.batchId, nextDueDate: editForm.nextDueDate }),
      });
      const updateData = await updateRes.json();
      if (!updateRes.ok) throw new Error(updateData.error || "Could not update student.");

      const paymentAmount = Number(editForm.paymentAmount || 0);
      if (paymentAmount > 0) {
        const receiptRes = await fetch(`/api/admin/students/${editingStudent.id}/receipt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: paymentAmount,
            paidOn: editForm.paidOn,
            paymentMode: editForm.paymentMode,
            notes: "Pending fee payment received from admin student edit.",
          }),
        });
        const receiptData = await receiptRes.json();
        if (!receiptRes.ok) throw new Error(receiptData.error || "Student updated, but payment could not be recorded.");
      }

      await loadStudents();
      setEditingStudent(null);
    } catch (error) {
      setEditMessage(error instanceof Error ? error.message : "Could not update student.");
    } finally {
      setSaving(false);
    }
  };

  const deleteStudent = async () => {
    if (!deletingStudent) return;
    setDeleting(true);
    setDeleteMessage("");
    try {
      const response = await fetch(`/api/admin/students/${deletingStudent.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not delete student.");
      setDeletingStudent(null);
      await loadStudents();
    } catch (error) {
      setDeleteMessage(error instanceof Error ? error.message : "Could not delete student.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-wider text-blue-600">Students</p>
          <h1 className="text-3xl font-black text-slate-900">All Students</h1>
          <p className="mt-1 text-slate-500">View registered students in one table and update daily attendance.</p>
        </div>
        <Link href="/admin/students/register" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white hover:bg-blue-700">
          <PlusCircle size={18} />
          Register Student
        </Link>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative md:w-96">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, phone, course, batch..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>
          <label className="flex items-center gap-2 text-sm font-black text-slate-600">
            <CalendarCheck size={16} />
            Attendance Date
            <input
              type="date"
              value={attendanceDate}
              onChange={(event) => setAttendanceDate(event.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                {["Student", "Course / Batch", "Fees", "Due Date", "Attendance", "Offers", "Actions"].map((heading) => (
                  <th key={heading} className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm font-bold text-slate-500">Loading students...</td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm font-bold text-slate-500">No students found.</td>
                </tr>
              )}
              {filtered.map((student) => {
                const due = Math.max(0, student.totalFee - student.paidFee);
                const todayAttendance = student.attendance.find((item) => item.date === attendanceDate);

                return (
                  <tr key={student.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-slate-400">
                          {student.profileImage ? <img src={student.profileImage} alt={student.fullName} className="h-full w-full object-cover" /> : <User size={20} />}
                        </div>
                        <div>
                          <p className="font-black text-slate-900">{student.fullName}</p>
                          <p className="text-xs font-semibold text-slate-500">{student.phone}</p>
                          {student.email && <p className="text-xs text-slate-400">{student.email}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-800">{student.courseName}</p>
                      <p className="text-xs font-semibold text-blue-600">{student.batchName || "No batch selected"}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-black text-slate-900">₹{student.paidFee} / ₹{student.totalFee}</p>
                      <span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-black ${
                        due === 0 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        Due ₹{due} • {student.feeStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-600">{student.nextDueDate || "Not set"}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        {(["PRESENT", "ABSENT", "LEAVE"] as Attendance["status"][]).map((status) => (
                          <button
                            key={status}
                            onClick={() => markAttendance(student.id, status)}
                            className={`rounded-xl border px-3 py-2 text-[11px] font-black ${
                              todayAttendance?.status === status
                                ? "border-blue-600 bg-blue-50 text-blue-700"
                                : "border-slate-200 bg-white text-slate-500 hover:border-blue-300"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                        <FileText size={13} />
                        {student.offerLetters.length}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => openEdit(student)} className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-2 text-xs font-black text-white hover:bg-blue-700">
                          <Pencil size={13} /> Edit
                        </button>
                        <button onClick={() => { setDeletingStudent(student); setDeleteMessage(""); }} className="inline-flex items-center gap-1 rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600 hover:bg-red-100">
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <section className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-blue-600">Edit Student</p>
                <h2 className="text-2xl font-black text-slate-900">{editingStudent.fullName}</h2>
              </div>
              <button onClick={() => setEditingStudent(null)} className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"><X size={18} /></button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-wide text-slate-500">Assigned Batch</label>
                <select value={editForm.batchId} onChange={(event) => setEditForm({ ...editForm, batchId: event.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-blue-500">
                  <option value="">Select batch</option>
                  {batches.map((batch) => <option key={batch.id} value={batch.id}>{batch.name} - {batch.course}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wide text-slate-500">Next Due Date</label>
                <input type="date" value={editForm.nextDueDate} onChange={(event) => setEditForm({ ...editForm, nextDueDate: event.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-blue-500" />
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                <h3 className="flex items-center gap-2 font-black text-emerald-950"><IndianRupee size={18} /> Add Pending Fee Payment</h3>
                <p className="mt-1 text-sm font-semibold text-emerald-700">Pending: ₹{Math.max(0, editingStudent.totalFee - editingStudent.paidFee)}</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <EditInput label="Payment Amount" type="number" value={editForm.paymentAmount} onChange={(value) => setEditForm({ ...editForm, paymentAmount: value })} max={Math.max(0, editingStudent.totalFee - editingStudent.paidFee)} />
                  <EditInput label="Payment Date" type="date" value={editForm.paidOn} onChange={(value) => setEditForm({ ...editForm, paidOn: value })} />
                  <label className="block sm:col-span-2">
                    <span className="text-xs font-black uppercase tracking-wide text-emerald-800">Payment Mode</span>
                    <select value={editForm.paymentMode} onChange={(event) => setEditForm({ ...editForm, paymentMode: event.target.value })} className="mt-1.5 w-full rounded-xl border border-emerald-200 bg-white px-3 py-3 text-sm">
                      {["UPI", "Cash", "Bank Transfer", "Card"].map((mode) => <option key={mode}>{mode}</option>)}
                    </select>
                  </label>
                </div>
                <p className="mt-3 text-xs font-semibold text-emerald-700">A fee receipt will be generated automatically when a payment is added.</p>
              </div>

              {editMessage && <p className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{editMessage}</p>}
              <button disabled={saving || !editForm.batchId} onClick={saveStudent} className="w-full rounded-2xl bg-blue-600 py-3 font-black text-white hover:bg-blue-700 disabled:opacity-50">
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </section>
        </div>
      )}

      {deletingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <section className="w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
              <AlertTriangle size={30} />
            </div>
            <h2 className="mt-5 text-2xl font-black text-slate-900">Delete student?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              This will permanently delete <strong className="text-slate-800">{deletingStudent.fullName}</strong>, their login account,
              attendance, fee receipts, offer letters, and leave requests.
            </p>
            {deleteMessage && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{deleteMessage}</p>}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button disabled={deleting} onClick={() => setDeletingStudent(null)} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-600 hover:bg-slate-50 disabled:opacity-50">
                Cancel
              </button>
              <button disabled={deleting} onClick={deleteStudent} className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-black text-white hover:bg-red-700 disabled:opacity-50">
                <Trash2 size={15} /> {deleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function EditInput({ label, value, onChange, type, max }: { label: string; value: string; onChange: (value: string) => void; type: string; max?: number }) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-wide text-emerald-800">{label}</span>
      <input type={type} value={value} max={max} min={type === "number" ? 0 : undefined} onChange={(event) => onChange(event.target.value)} className="mt-1.5 w-full rounded-xl border border-emerald-200 bg-white px-3 py-3 text-sm outline-none focus:border-emerald-500" />
    </label>
  );
}
