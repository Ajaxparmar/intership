"use client";

import React, { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Building2, CheckCircle2, FileText, IndianRupee, Mail, Phone, User, Upload, X } from "lucide-react";

type Batch = {
  id: string;
  name: string;
  course: string;
  batchType: "ONLINE" | "OFFLINE" | "HYBRID";
  startDate: string;
  endDate: string;
  timingStart: string;
  timingEnd: string;
  totalSeats: number;
  bookedSeats: number;
  status: string;
};

const initialForm = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  fatherName: "",
  collegeUniversity: "",
  batchId: "",
  duration: "",
  totalFee: "",
  paidFee: "",
  paymentMode: "UPI",
  nextDueDate: "",
  feeNotes: "",
  offerTitle: "",
  offerIssueDate: "",
  offerNotes: "",
};

export default function RegisterStudentPage() {
  const [form, setForm] = useState(initialForm);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [message, setMessage] = useState("");
  const [registeredCredentials, setRegisteredCredentials] = useState({ phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [loadingBatches, setLoadingBatches] = useState(true);

  useEffect(() => {
    const loadBatches = async () => {
      setLoadingBatches(true);
      try {
        const res = await fetch("/api/batch");
        const data = await res.json();
        if (data.success) setBatches(data.batches);
      } finally {
        setLoadingBatches(false);
      }
    };
    loadBatches();
  }, []);

  const selectedBatch = useMemo(() => batches.find((batch) => batch.id === form.batchId), [batches, form.batchId]);

  const update = (field: keyof typeof initialForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImage = (file?: File) => {
    setImage(file ?? null);
    setImagePreview(file ? URL.createObjectURL(file) : "");
  };

  const registerStudent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const body = new FormData();
    Object.entries(form).forEach(([key, value]) => body.append(key, value));
    if (image) body.append("profileImage", image);

    try {
      const res = await fetch("/api/admin/students", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not register student.");

      setRegisteredCredentials({ phone: data.student.phone, password: data.generatedPassword });
      setForm(initialForm);
      handleImage();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not register student.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-wider text-blue-600">Registration</p>
          <h1 className="text-3xl font-black text-slate-900">Register Student</h1>
          <p className="mt-1 text-slate-500">Create a student login and attach the student to an existing batch.</p>
        </div>
        <Link href="/admin/students" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 hover:bg-slate-50">
          <ArrowLeft size={18} />
          Back to Students
        </Link>
      </div>

      <form onSubmit={registerStudent} className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-black text-slate-900">Student Details</h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <label className="flex items-center gap-4 rounded-2xl border border-dashed border-slate-300 p-4 cursor-pointer hover:border-blue-400 md:col-span-2">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-slate-400">
                {imagePreview ? <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" /> : <Upload size={24} />}
              </div>
              <div>
                <p className="font-bold text-slate-800">Upload student image</p>
                <p className="text-xs text-slate-500">PNG/JPG, max 1.5 MB</p>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={(event) => handleImage(event.target.files?.[0])} />
            </label>

            <Input icon={<User size={16} />} label="Full Name" value={form.fullName} onChange={(value) => update("fullName", value)} required />
            <Input icon={<Phone size={16} />} label="Phone Login" value={form.phone} onChange={(value) => update("phone", value)} required />
            <p className="rounded-xl bg-blue-50 p-3 text-xs font-bold text-blue-700 md:col-span-2">
              Password is generated automatically: first 4 letters of the name + @ + last 4 digits of the phone number.
            </p>
            <Input icon={<Mail size={16} />} label="Email" type="email" value={form.email} onChange={(value) => update("email", value)} />
            <Input icon={<User size={16} />} label="Father Name" value={form.fatherName} onChange={(value) => update("fatherName", value)} />
            <Input icon={<Building2 size={16} />} label="College / University" value={form.collegeUniversity} onChange={(value) => update("collegeUniversity", value)} required />
            <TextArea label="Address" value={form.address} onChange={(value) => update("address", value)} />
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-black text-slate-900">
              <BookOpen size={20} className="text-blue-600" />
              Batch
            </h2>

            <label className="block">
              <span className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">Select Batch</span>
              <select
                required
                value={form.batchId}
                onChange={(event) => update("batchId", event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
              >
                <option value="">{loadingBatches ? "Loading batches..." : "Choose from Batch table"}</option>
                {batches.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch.name} - {batch.course}
                  </option>
                ))}
              </select>
            </label>

            {selectedBatch && (
              <div className="mt-4 space-y-2 rounded-2xl bg-blue-50 p-4 text-sm">
                <Info label="Course" value={selectedBatch.course} />
                <Info label="Type" value={selectedBatch.batchType} />
                <Info label="Dates" value={`${selectedBatch.startDate} to ${selectedBatch.endDate}`} />
                <Info label="Timing" value={`${selectedBatch.timingStart} - ${selectedBatch.timingEnd}`} />
              </div>
            )}

            <div className="mt-4">
              <Input label="Duration" value={form.duration} onChange={(value) => update("duration", value)} placeholder="45 days" />
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-black text-slate-900">
              <IndianRupee size={20} className="text-emerald-600" />
              Fees
            </h2>
            <div className="space-y-4">
              <Input label="Total Fee" type="number" value={form.totalFee} onChange={(value) => update("totalFee", value)} required />
              <Input label="Paid Fee" type="number" value={form.paidFee} onChange={(value) => update("paidFee", value)} />
              <label className="block">
                <span className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">Payment Mode</span>
                <select
                  value={form.paymentMode}
                  onChange={(event) => update("paymentMode", event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
                >
                  {["UPI", "Online", "Card", "Cash", "Bank Transfer"].map((mode) => <option key={mode}>{mode}</option>)}
                </select>
              </label>
              <Input label="Next Due Date" type="date" value={form.nextDueDate} onChange={(value) => update("nextDueDate", value)} />
              <TextArea label="Fee Notes" value={form.feeNotes} onChange={(value) => update("feeNotes", value)} />
            </div>
          </section>

          <section className="rounded-3xl border border-blue-100 bg-blue-50 p-6">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-black text-blue-950">
              <FileText size={20} />
              Offer Letter
            </h2>
            <div className="space-y-4">
              <Input label="Title" value={form.offerTitle} onChange={(value) => update("offerTitle", value)} placeholder="Industrial Training Offer Letter (default)" />
              <Input label="Issue Date" type="date" value={form.offerIssueDate} onChange={(value) => update("offerIssueDate", value)} />
              <TextArea label="Notes" value={form.offerNotes} onChange={(value) => update("offerNotes", value)} />
            </div>
          </section>

          {message && <p className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700 shadow-sm">{message}</p>}
          <button disabled={loading} className="w-full rounded-2xl bg-blue-600 py-4 font-black text-white shadow-lg shadow-blue-100 hover:bg-blue-700 disabled:opacity-60">
            {loading ? "Registering..." : "Register Student"}
          </button>
        </aside>
      </form>

      {registeredCredentials.phone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <section className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/60 bg-white p-8 text-center shadow-2xl shadow-blue-950/30">
            <button
              onClick={() => setRegisteredCredentials({ phone: "", password: "" })}
              className="absolute right-4 top-4 rounded-xl bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
              aria-label="Close success popup"
            >
              <X size={18} />
            </button>

            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500" />
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60">
              <CheckCircle2 size={42} strokeWidth={2.5} />
            </div>
            <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-emerald-600">Registration Complete</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">Student registered!</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              The student account, offer letter, and fee receipt (when payment was added) are ready.
            </p>

            <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-blue-600">Student Login Phone</p>
              <p className="mt-1 text-2xl font-black tracking-wider text-blue-950">{registeredCredentials.phone}</p>
              <div className="my-3 border-t border-blue-100" />
              <p className="text-xs font-black uppercase tracking-wide text-blue-600">Generated Password</p>
              <p className="mt-1 text-2xl font-black tracking-wider text-blue-950">{registeredCredentials.password}</p>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <button onClick={() => setRegisteredCredentials({ phone: "", password: "" })} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-600 hover:bg-slate-50">
                Register Another
              </button>
              <Link href="/admin/students" className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-blue-200 hover:bg-blue-700">
                View Students
              </Link>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function Input({ label, value, onChange, icon, type = "text", required, placeholder }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  type?: string;
  required?: boolean;
  placeholder?: string;
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
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white ${icon ? "pl-9" : ""}`}
        />
      </div>
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block md:col-span-2">
      <span className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white" rows={3} />
    </label>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="font-black text-blue-900">{label}</span>
      <span className="text-right font-semibold text-blue-800">{value}</span>
    </div>
  );
}
