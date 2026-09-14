"use client";

import React, { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Award, CalendarDays, CheckCircle2, FileUp, Hash, Pencil, Phone, RefreshCw, SearchCheck, Trash2, User, X } from "lucide-react";

type ManualCertificate = {
  id: string;
  studentName: string;
  phone: string;
  certificateNo: string;
  certificateUrl: string;
  fileName?: string;
  issuedAt?: string;
  notes?: string;
  createdAt: string;
};

const initialForm = {
  studentName: "",
  phone: "",
  certificateNo: "",
  issuedAt: "",
  notes: "",
};

export default function ManualCertificatesPage() {
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState<File | null>(null);
  const [certificates, setCertificates] = useState<ManualCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [editingCertificate, setEditingCertificate] = useState<ManualCertificate | null>(null);
  const [editForm, setEditForm] = useState(initialForm);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editMessage, setEditMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingCertificate, setDeletingCertificate] = useState<ManualCertificate | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  const loadCertificates = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/manual-certificates", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load certificates.");
      setCertificates(data.certificates);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load certificates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCertificates();
  }, []);

  const update = (field: keyof typeof initialForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const uploadCertificate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    setSuccess("");

    try {
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => body.append(key, value));
      if (file) body.append("certificateFile", file);

      const response = await fetch("/api/admin/manual-certificates", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not upload certificate.");

      setForm(initialForm);
      setFile(null);
      setSuccess(`Certificate ${data.certificate.certificateNo} uploaded for ${data.certificate.studentName}.`);
      await loadCertificates();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not upload certificate.");
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (certificate: ManualCertificate) => {
    setEditingCertificate(certificate);
    setEditForm({
      studentName: certificate.studentName || "",
      phone: certificate.phone || "",
      certificateNo: certificate.certificateNo || "",
      issuedAt: certificate.issuedAt || "",
      notes: certificate.notes || "",
    });
    setEditFile(null);
    setEditMessage("");
  };

  const saveCertificate = async () => {
    if (!editingCertificate) return;
    setSaving(true);
    setEditMessage("");

    try {
      const body = new FormData();
      Object.entries(editForm).forEach(([key, value]) => body.append(key, value));
      if (editFile) body.append("certificateFile", editFile);

      const response = await fetch(`/api/admin/manual-certificates/${editingCertificate.id}`, { method: "PATCH", body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not update certificate.");

      setEditingCertificate(null);
      setSuccess(`Certificate ${data.certificate.certificateNo} updated.`);
      await loadCertificates();
    } catch (error) {
      setEditMessage(error instanceof Error ? error.message : "Could not update certificate.");
    } finally {
      setSaving(false);
    }
  };

  const deleteCertificate = async () => {
    if (!deletingCertificate) return;
    setDeleting(true);
    setDeleteMessage("");

    try {
      const response = await fetch(`/api/admin/manual-certificates/${deletingCertificate.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not delete certificate.");

      setDeletingCertificate(null);
      setSuccess(`Certificate ${data.deletedCertificate} deleted.`);
      await loadCertificates();
    } catch (error) {
      setDeleteMessage(error instanceof Error ? error.message : "Could not delete certificate.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-wider text-blue-600">Certificates</p>
          <h1 className="flex items-center gap-3 text-3xl font-black text-slate-900">
            <Award className="text-blue-600" />
            Manual Certificates
          </h1>
          <p className="mt-1 text-slate-500">Upload certificates without creating a student registration.</p>
        </div>
        <Link href="/verify-certificate" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 hover:bg-slate-50">
          <SearchCheck size={18} />
          Public Verify Page
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[440px_1fr]">
        <form onSubmit={uploadCertificate} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-black text-slate-900">Upload Certificate</h2>
          <div className="space-y-4">
            <Input icon={<User size={16} />} label="Student Name" value={form.studentName} onChange={(value) => update("studentName", value)} required />
            <Input icon={<Phone size={16} />} label="Phone Number" type="tel" value={form.phone} onChange={(value) => update("phone", value)} required />
            <Input icon={<Hash size={16} />} label="Certificate Number" value={form.certificateNo} onChange={(value) => update("certificateNo", value)} required />
            <Input icon={<CalendarDays size={16} />} label="Issue Date" type="date" value={form.issuedAt} onChange={(value) => update("issuedAt", value)} />

            <label className="block">
              <span className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">Certificate File</span>
              <div className="flex items-center gap-4 rounded-2xl border border-dashed border-slate-300 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <FileUp size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-slate-800">{file ? file.name : "Upload PDF or image"}</p>
                  <p className="text-xs font-semibold text-slate-500">PDF, PNG, JPG, WEBP. Max 8 MB.</p>
                </div>
                <input required type="file" accept="application/pdf,image/*" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="w-full max-w-[130px] text-xs" />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">Notes</span>
              <textarea value={form.notes} onChange={(event) => update("notes", event.target.value)} rows={3} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white" />
            </label>

            {message && <p className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">{message}</p>}
            {success && (
              <p className="flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-bold text-emerald-700">
                <CheckCircle2 size={18} />
                {success}
              </p>
            )}

            <button disabled={submitting} className="w-full rounded-2xl bg-blue-600 py-4 font-black text-white shadow-lg shadow-blue-100 hover:bg-blue-700 disabled:opacity-60">
              {submitting ? "Uploading..." : "Upload Certificate"}
            </button>
          </div>
        </form>

        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900">Uploaded Certificates</h2>
              <p className="text-sm font-semibold text-slate-500">{certificates.length} latest manual certificates</p>
            </div>
            <button onClick={loadCertificates} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-600 hover:bg-slate-50 disabled:opacity-60">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-5 py-3">Student</th>
                  <th className="px-5 py-3">Certificate No</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Uploaded</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {certificates.map((certificate) => (
                  <tr key={certificate.id} className="text-sm">
                    <td className="px-5 py-4">
                      <p className="font-black text-slate-900">{certificate.studentName}</p>
                      {certificate.issuedAt && <p className="text-xs font-semibold text-slate-500">Issued {certificate.issuedAt}</p>}
                    </td>
                    <td className="px-5 py-4 font-black text-blue-700">{certificate.certificateNo}</td>
                    <td className="px-5 py-4 font-semibold text-slate-600">{certificate.phone}</td>
                    <td className="px-5 py-4 font-semibold text-slate-500">{new Date(certificate.createdAt).toLocaleDateString("en-IN")}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                      <a href={certificate.certificateUrl} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-200">
                        View
                      </a>
                      <button onClick={() => openEdit(certificate)} className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-2 text-xs font-black text-white hover:bg-blue-700">
                        <Pencil size={13} /> Edit
                      </button>
                      <button onClick={() => { setDeletingCertificate(certificate); setDeleteMessage(""); }} className="inline-flex items-center gap-1 rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600 hover:bg-red-100">
                        <Trash2 size={13} /> Delete
                      </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && certificates.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-sm font-bold text-slate-500">No manual certificates uploaded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {editingCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <section className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-blue-600">Edit Certificate</p>
                <h2 className="text-2xl font-black text-slate-900">{editingCertificate.studentName}</h2>
              </div>
              <button onClick={() => setEditingCertificate(null)} className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <Input icon={<User size={16} />} label="Student Name" value={editForm.studentName} onChange={(value) => setEditForm({ ...editForm, studentName: value })} required />
              <Input icon={<Phone size={16} />} label="Phone Number" type="tel" value={editForm.phone} onChange={(value) => setEditForm({ ...editForm, phone: value })} required />
              <Input icon={<Hash size={16} />} label="Certificate Number" value={editForm.certificateNo} onChange={(value) => setEditForm({ ...editForm, certificateNo: value })} required />
              <Input icon={<CalendarDays size={16} />} label="Issue Date" type="date" value={editForm.issuedAt} onChange={(value) => setEditForm({ ...editForm, issuedAt: value })} />

              <label className="block">
                <span className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">Replace Certificate File</span>
                <div className="flex items-center gap-4 rounded-2xl border border-dashed border-slate-300 p-4">
                  <FileUp size={22} className="shrink-0 text-blue-600" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-slate-800">{editFile ? editFile.name : editingCertificate.fileName || "Keep existing file"}</p>
                    <p className="text-xs font-semibold text-slate-500">Leave empty to keep current file.</p>
                  </div>
                  <input type="file" accept="application/pdf,image/*" onChange={(event) => setEditFile(event.target.files?.[0] ?? null)} className="w-full max-w-[130px] text-xs" />
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">Notes</span>
                <textarea value={editForm.notes} onChange={(event) => setEditForm({ ...editForm, notes: event.target.value })} rows={3} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white" />
              </label>

              {editMessage && <p className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{editMessage}</p>}
              <button disabled={saving} onClick={saveCertificate} className="w-full rounded-2xl bg-blue-600 py-3 font-black text-white hover:bg-blue-700 disabled:opacity-60">
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </section>
        </div>
      )}

      {deletingCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <section className="w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
              <AlertTriangle size={30} />
            </div>
            <h2 className="mt-5 text-2xl font-black text-slate-900">Delete certificate?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              This will remove <strong className="text-slate-800">{deletingCertificate.certificateNo}</strong> for {deletingCertificate.studentName}.
            </p>
            {deleteMessage && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{deleteMessage}</p>}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button disabled={deleting} onClick={() => setDeletingCertificate(null)} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-600 hover:bg-slate-50 disabled:opacity-50">
                Cancel
              </button>
              <button disabled={deleting} onClick={deleteCertificate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-black text-white hover:bg-red-700 disabled:opacity-50">
                <Trash2 size={15} /> {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </section>
        </div>
      )}
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
          onChange={(event) => onChange(event.target.value)}
          className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white ${icon ? "pl-9" : ""}`}
        />
      </div>
    </label>
  );
}
