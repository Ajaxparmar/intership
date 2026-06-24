"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CalendarCheck, CheckSquare, FileText, IndianRupee, Pencil, PlusCircle, Search, Trash2, Upload, User, X } from "lucide-react";

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
  address?: string;
  fatherName?: string;
  collegeUniversity?: string;
  profileImage?: string;
  courseName: string;
  batchId?: string;
  batchName?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  totalFee: number;
  paidFee: number;
  feeStatus: string;
  nextDueDate?: string;
  feeNotes?: string;
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
const initialEditForm = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  fatherName: "",
  collegeUniversity: "",
  batchId: "",
  courseName: "",
  batchName: "",
  duration: "",
  startDate: "",
  endDate: "",
  totalFee: "",
  paidFee: "",
  nextDueDate: "",
  feeNotes: "",
  paymentAmount: "",
  paymentMode: "UPI",
  paidOn: today,
};
const pageSize = 10;

export default function StudentsTablePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pageSize, totalStudents: 0, totalPages: 1 });
  const [attendanceDate, setAttendanceDate] = useState(today);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [bulkAttendanceStatus, setBulkAttendanceStatus] = useState<Attendance["status"]>("PRESENT");
  const [submittingAttendance, setSubmittingAttendance] = useState(false);
  const [attendanceMessage, setAttendanceMessage] = useState("");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editForm, setEditForm] = useState(initialEditForm);
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  const loadStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (query.trim()) params.set("query", query.trim());

      const res = await fetch(`/api/admin/students?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setStudents(data.students);
        setPagination(data.pagination);
        setSelectedStudentIds([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [page, query]);

  useEffect(() => {
    fetch("/api/batch")
      .then((res) => res.json())
      .then((data) => data.success && setBatches(data.batches));
  }, []);

  const markAttendance = async (studentId: string, status: Attendance["status"]) => {
    const res = await fetch(`/api/admin/students/${studentId}/attendance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: attendanceDate, status }),
    });
    if (res.ok) await loadStudents();
  };

  const toggleStudent = (studentId: string) => {
    setSelectedStudentIds((current) =>
      current.includes(studentId) ? current.filter((id) => id !== studentId) : [...current, studentId]
    );
  };

  const allFilteredSelected = students.length > 0 && students.every((student) => selectedStudentIds.includes(student.id));

  const toggleAllFiltered = () => {
    const filteredIds = students.map((student) => student.id);
    setSelectedStudentIds((current) =>
      allFilteredSelected
        ? current.filter((id) => !filteredIds.includes(id))
        : [...new Set([...current, ...filteredIds])]
    );
  };

  const submitBulkAttendance = async () => {
    if (selectedStudentIds.length === 0) return;
    setSubmittingAttendance(true);
    setAttendanceMessage("");
    try {
      const response = await fetch("/api/admin/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentIds: selectedStudentIds, date: attendanceDate, status: bulkAttendanceStatus }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not submit attendance.");
      setAttendanceMessage(`Attendance submitted for ${data.updatedCount} student${data.updatedCount === 1 ? "" : "s"}.`);
      setSelectedStudentIds([]);
      await loadStudents();
    } catch (error) {
      setAttendanceMessage(error instanceof Error ? error.message : "Could not submit attendance.");
    } finally {
      setSubmittingAttendance(false);
    }
  };

  const openEdit = (student: Student) => {
    setEditingStudent(student);
    setEditMessage("");
    setEditImage(null);
    setEditImagePreview("");
    setEditForm({
      fullName: student.fullName || "",
      phone: student.phone || "",
      email: student.email || "",
      address: student.address || "",
      fatherName: student.fatherName || "",
      collegeUniversity: student.collegeUniversity || "",
      batchId: student.batchId || "",
      courseName: student.courseName || "",
      batchName: student.batchName || "",
      duration: student.duration || "",
      startDate: student.startDate || "",
      endDate: student.endDate || "",
      totalFee: student.totalFee.toString(),
      paidFee: student.paidFee.toString(),
      nextDueDate: student.nextDueDate || "",
      feeNotes: student.feeNotes || "",
      paymentAmount: "",
      paymentMode: "UPI",
      paidOn: today,
    });
  };

  const handleEditImage = (file?: File) => {
    setEditImage(file ?? null);
    setEditImagePreview(file ? URL.createObjectURL(file) : "");
  };

  const saveStudent = async () => {
    if (!editingStudent) return;
    setSaving(true);
    setEditMessage("");

    try {
      const body = new FormData();
      Object.entries(editForm).forEach(([key, value]) => body.append(key, value));
      if (editImage) body.append("profileImage", editImage);

      const updateRes = await fetch(`/api/admin/students/${editingStudent.id}`, {
        method: "PATCH",
        body,
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
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
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
        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 lg:flex-row lg:items-center">
          <div className="flex flex-1 items-center gap-2 font-black text-blue-900">
            <CheckSquare size={18} />
            {selectedStudentIds.length} student{selectedStudentIds.length === 1 ? "" : "s"} selected
          </div>
          <select value={bulkAttendanceStatus} onChange={(event) => setBulkAttendanceStatus(event.target.value as Attendance["status"])} className="rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700">
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
            <option value="LEAVE">Leave</option>
          </select>
          <button disabled={submittingAttendance || selectedStudentIds.length === 0} onClick={submitBulkAttendance} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-black text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
            {submittingAttendance ? "Submitting..." : "Submit Attendance"}
          </button>
        </div>
        {attendanceMessage && <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm font-bold text-slate-700">{attendanceMessage}</p>}
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-4 text-left">
                  <input type="checkbox" checked={allFilteredSelected} onChange={toggleAllFiltered} aria-label="Select all visible students" className="h-4 w-4 rounded border-slate-300 text-blue-600" />
                </th>
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
                  <td colSpan={8} className="px-5 py-10 text-center text-sm font-bold text-slate-500">Loading students...</td>
                </tr>
              )}
              {!loading && students.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-sm font-bold text-slate-500">No students found.</td>
                </tr>
              )}
              {students.map((student) => {
                const due = Math.max(0, student.totalFee - student.paidFee);
                const todayAttendance = student.attendance.find((item) => item.date === attendanceDate);

                return (
                  <tr key={student.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <input type="checkbox" checked={selectedStudentIds.includes(student.id)} onChange={() => toggleStudent(student.id)} aria-label={`Select ${student.fullName}`} className="h-4 w-4 rounded border-slate-300 text-blue-600" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <StudentAvatar student={student} />
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
        <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold text-slate-500">
            Showing {pagination.totalStudents === 0 ? 0 : (pagination.page - 1) * pagination.pageSize + 1}
            {" - "}
            {Math.min(pagination.page * pagination.pageSize, pagination.totalStudents)} of {pagination.totalStudents} students
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={loading || pagination.page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-black text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-700">
              Page {pagination.page} / {pagination.totalPages}
            </span>
            <button
              disabled={loading || pagination.page >= pagination.totalPages}
              onClick={() => setPage((current) => Math.min(pagination.totalPages, current + 1))}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-black text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
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
              <section className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <h3 className="mb-4 font-black text-slate-900">Basic Details</h3>
                <label className="mb-4 flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white p-4 hover:border-blue-400">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-slate-400">
                    {editImagePreview || editingStudent.profileImage ? (
                      <img src={editImagePreview || editingStudent.profileImage} alt="Student preview" className="h-full w-full object-cover" />
                    ) : (
                      <Upload size={24} />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Change student image</p>
                    <p className="text-xs text-slate-500">PNG/JPG, max 1.5 MB</p>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={(event) => handleEditImage(event.target.files?.[0])} />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <EditInput label="Full Name" value={editForm.fullName} onChange={(value) => setEditForm({ ...editForm, fullName: value })} required />
                  <EditInput label="Phone Login" value={editForm.phone} onChange={(value) => setEditForm({ ...editForm, phone: value })} required />
                  <EditInput label="Email" type="email" value={editForm.email} onChange={(value) => setEditForm({ ...editForm, email: value })} />
                  <EditInput label="Father Name" value={editForm.fatherName} onChange={(value) => setEditForm({ ...editForm, fatherName: value })} />
                  <EditInput label="College / University" value={editForm.collegeUniversity} onChange={(value) => setEditForm({ ...editForm, collegeUniversity: value })} required />
                  <EditTextArea label="Address" value={editForm.address} onChange={(value) => setEditForm({ ...editForm, address: value })} />
                </div>
              </section>

              <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <h3 className="mb-4 font-black text-blue-950">Course & Batch</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="text-xs font-black uppercase tracking-wide text-blue-800">Assigned Batch</span>
                    <select
                      value={editForm.batchId}
                      onChange={(event) => {
                        const batch = batches.find((item) => item.id === event.target.value);
                        setEditForm({
                          ...editForm,
                          batchId: event.target.value,
                          courseName: batch?.course || editForm.courseName,
                          batchName: batch?.name || editForm.batchName,
                          startDate: batch?.startDate || editForm.startDate,
                          endDate: batch?.endDate || editForm.endDate,
                        });
                      }}
                      className="mt-1.5 w-full rounded-xl border border-blue-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500"
                    >
                      <option value="">No batch / manual course</option>
                      {batches.map((batch) => <option key={batch.id} value={batch.id}>{batch.name} - {batch.course}</option>)}
                    </select>
                  </label>
                  <EditInput label="Course Name" value={editForm.courseName} onChange={(value) => setEditForm({ ...editForm, courseName: value })} required />
                  <EditInput label="Batch Name" value={editForm.batchName} onChange={(value) => setEditForm({ ...editForm, batchName: value })} />
                  <EditInput label="Duration" value={editForm.duration} onChange={(value) => setEditForm({ ...editForm, duration: value })} />
                  <EditInput label="Start Date" type="date" value={editForm.startDate} onChange={(value) => setEditForm({ ...editForm, startDate: value })} />
                  <EditInput label="End Date" type="date" value={editForm.endDate} onChange={(value) => setEditForm({ ...editForm, endDate: value })} />
                </div>
              </section>

              <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                <h3 className="mb-4 flex items-center gap-2 font-black text-emerald-950"><IndianRupee size={18} /> Fee Details</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <EditInput label="Total Fee" type="number" value={editForm.totalFee} onChange={(value) => setEditForm({ ...editForm, totalFee: value })} required />
                  <EditInput label="Paid Fee" type="number" value={editForm.paidFee} onChange={(value) => setEditForm({ ...editForm, paidFee: value })} required />
                  <EditInput label="Next Due Date" type="date" value={editForm.nextDueDate} onChange={(value) => setEditForm({ ...editForm, nextDueDate: value })} />
                  <EditTextArea label="Fee Notes" value={editForm.feeNotes} onChange={(value) => setEditForm({ ...editForm, feeNotes: value })} />
                </div>
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-white p-4">
                  <h4 className="font-black text-emerald-950">Optional: record new payment receipt</h4>
                  <p className="mt-1 text-xs font-semibold text-emerald-700">Use this only when receiving a new payment. It will increase paid fee after saving.</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <EditInput label="Payment Amount" type="number" value={editForm.paymentAmount} onChange={(value) => setEditForm({ ...editForm, paymentAmount: value })} max={Math.max(0, Number(editForm.totalFee || 0) - Number(editForm.paidFee || 0))} />
                    <EditInput label="Payment Date" type="date" value={editForm.paidOn} onChange={(value) => setEditForm({ ...editForm, paidOn: value })} />
                    <label className="block sm:col-span-2">
                      <span className="text-xs font-black uppercase tracking-wide text-emerald-800">Payment Mode</span>
                      <select value={editForm.paymentMode} onChange={(event) => setEditForm({ ...editForm, paymentMode: event.target.value })} className="mt-1.5 w-full rounded-xl border border-emerald-200 bg-white px-3 py-3 text-sm">
                        {["UPI", "Online", "Cash", "Bank Transfer", "Card"].map((mode) => <option key={mode}>{mode}</option>)}
                      </select>
                    </label>
                  </div>
                </div>
              </section>

              {editMessage && <p className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{editMessage}</p>}
              <button disabled={saving || !editForm.fullName || !editForm.phone || !editForm.collegeUniversity || !editForm.courseName || !editForm.totalFee} onClick={saveStudent} className="w-full rounded-2xl bg-blue-600 py-3 font-black text-white hover:bg-blue-700 disabled:opacity-50">
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

function StudentAvatar({ student }: { student: Student }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-slate-400">
      {student.profileImage && !imageFailed ? (
        <img
          src={student.profileImage}
          alt={student.fullName}
          className="h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <User size={20} />
      )}
    </div>
  );
}

function EditInput({
  label,
  value,
  onChange,
  type = "text",
  max,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  max?: number;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-wide text-slate-600">{label}</span>
      <input
        type={type}
        value={value}
        max={max}
        min={type === "number" ? 0 : undefined}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500"
      />
    </label>
  );
}

function EditTextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block sm:col-span-2">
      <span className="text-xs font-black uppercase tracking-wide text-slate-600">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-500"
      />
    </label>
  );
}
