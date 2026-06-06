"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  Save,
  Search,
  Users,
} from "lucide-react";
import Header from "@/app/components/Header";

type BatchType = "ONLINE" | "OFFLINE" | "HYBRID";
type BatchStatus = "UPCOMING" | "ONGOING" | "FULL" | "COMPLETED";

interface Batch {
  id: string;
  name: string;
  course: string;
  batchType: BatchType;
  instructor: string | null;
  startDate: string;
  endDate: string;
  timingStart: string;
  timingEnd: string;
  days: string[];
  totalSeats: number;
  bookedSeats: number;
  status: BatchStatus;
  description: string | null;
}

interface BatchForm {
  id: string;
  name: string;
  course: string;
  batchType: BatchType;
  instructor: string;
  startDate: string;
  endDate: string;
  timingStart: string;
  timingEnd: string;
  days: string[];
  totalSeats: string;
  status: BatchStatus;
  description: string;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TYPES: BatchType[] = ["ONLINE", "OFFLINE", "HYBRID"];
const STATUSES: BatchStatus[] = ["UPCOMING", "ONGOING", "FULL", "COMPLETED"];

function toForm(batch: Batch): BatchForm {
  return {
    ...batch,
    instructor: batch.instructor ?? "",
    description: batch.description ?? "",
    totalSeats: String(batch.totalSeats),
  };
}

export default function ManageBatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState<BatchForm | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    void loadBatches();
  }, []);

  async function loadBatches() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/batch/editbatch");
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Failed to load batches.");
      setBatches(data.batches);
      if (data.batches.length > 0) {
        setSelectedId(data.batches[0].id);
        setForm(toForm(data.batches[0]));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load batches.");
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return batches;
    return batches.filter((batch) =>
      [batch.name, batch.course, batch.instructor ?? "", batch.status]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [batches, search]);

  const selectedBatch = batches.find((batch) => batch.id === selectedId);

  function selectBatch(batch: Batch) {
    setSelectedId(batch.id);
    setForm(toForm(batch));
    setError("");
    setSuccess("");
  }

  function update<K extends keyof BatchForm>(key: K, value: BatchForm[K]) {
    setForm((current) => current ? { ...current, [key]: value } : current);
    setError("");
    setSuccess("");
  }

  function toggleDay(day: string) {
    if (!form) return;
    update("days", form.days.includes(day) ? form.days.filter((item) => item !== day) : [...form.days, day]);
  }

  async function saveBatch() {
    if (!form) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch("/api/batch/editbatch", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, totalSeats: Number(form.totalSeats) }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Failed to update batch.");

      setBatches((current) => current.map((batch) => batch.id === data.batch.id ? data.batch : batch));
      setForm(toForm(data.batch));
      setSuccess("Batch details updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update batch.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header
        active="manageBatches"
        extraLinks={[{ key: "manageBatches", label: "Manage Batches", href: "/batch/manage" }]}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold">Manage Batches</h1>
          <p className="mt-1 text-slate-500">Select a batch and update its details.</p>
        </div>

        <div className="grid lg:grid-cols-[320px_minmax(0,1fr)] gap-6 items-start">
          <aside className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search batches"
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="max-h-[68vh] overflow-y-auto">
              {loading ? (
                <div className="p-8 flex justify-center text-blue-600"><Loader2 className="animate-spin" /></div>
              ) : filtered.length === 0 ? (
                <p className="p-6 text-sm text-slate-500">No batches found.</p>
              ) : filtered.map((batch) => (
                <button
                  key={batch.id}
                  type="button"
                  onClick={() => selectBatch(batch)}
                  className={`w-full text-left p-4 border-b border-slate-100 transition-colors ${
                    selectedId === batch.id ? "bg-blue-50 text-blue-800" : "hover:bg-slate-50"
                  }`}
                >
                  <p className="font-bold truncate">{batch.name}</p>
                  <p className="text-xs text-slate-500 mt-1 truncate">{batch.course}</p>
                  <div className="flex justify-between mt-2 text-xs font-semibold">
                    <span>{batch.status}</span>
                    <span>{batch.bookedSeats}/{batch.totalSeats} booked</span>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <section className="bg-white border border-slate-200 rounded-lg">
            {!form || !selectedBatch ? (
              <div className="p-12 text-center text-slate-500">Select a batch to edit.</div>
            ) : (
              <>
                <div className="px-6 py-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold">{form.name}</h2>
                    <p className="text-sm text-slate-500">{selectedBatch.bookedSeats} seats currently booked</p>
                  </div>
                  <button
                    type="button"
                    onClick={saveBatch}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
                    Save Changes
                  </button>
                </div>

                <div className="p-6 space-y-8">
                  {(error || success) && (
                    <div className={`flex items-center gap-2 p-3 rounded-md text-sm font-semibold ${
                      error ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}>
                      {error ? <AlertCircle size={17} /> : <CheckCircle2 size={17} />}
                      {error || success}
                    </div>
                  )}

                  <FormSection icon={<BookOpen size={18} />} title="Batch Details">
                    <Input label="Batch Name" value={form.name} onChange={(value) => update("name", value)} />
                    <Input label="Course / Domain" value={form.course} onChange={(value) => update("course", value)} />
                    <Select label="Batch Type" value={form.batchType} options={TYPES} onChange={(value) => update("batchType", value as BatchType)} />
                    <Select label="Status" value={form.status} options={STATUSES} onChange={(value) => update("status", value as BatchStatus)} />
                    <Input label="Instructor" value={form.instructor} onChange={(value) => update("instructor", value)} />
                    <Input label="Total Seats" type="number" min={selectedBatch.bookedSeats} value={form.totalSeats} onChange={(value) => update("totalSeats", value)} />
                    <label className="md:col-span-2 text-sm font-semibold text-slate-600">
                      Description
                      <textarea
                        rows={3}
                        value={form.description}
                        onChange={(event) => update("description", event.target.value)}
                        className="mt-1.5 w-full px-3 py-2.5 border border-slate-200 rounded-md text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-y"
                      />
                    </label>
                  </FormSection>

                  <FormSection icon={<Calendar size={18} />} title="Schedule">
                    <Input label="Start Date" type="date" value={form.startDate} onChange={(value) => update("startDate", value)} />
                    <Input label="End Date" type="date" value={form.endDate} onChange={(value) => update("endDate", value)} />
                    <Input label="Start Time" type="time" value={form.timingStart} onChange={(value) => update("timingStart", value)} />
                    <Input label="End Time" type="time" value={form.timingEnd} onChange={(value) => update("timingEnd", value)} />
                    <div className="md:col-span-2">
                      <p className="text-sm font-semibold text-slate-600 mb-2">Class Days</p>
                      <div className="flex flex-wrap gap-2">
                        {DAYS.map((day) => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleDay(day)}
                            className={`w-12 py-2 rounded-md border text-xs font-bold ${
                              form.days.includes(day)
                                ? "bg-blue-600 border-blue-600 text-white"
                                : "border-slate-200 text-slate-600 hover:border-blue-300"
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  </FormSection>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function FormSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4 text-slate-800">
        {icon}
        <h3 className="font-bold">{title}</h3>
      </div>
      <div className="grid md:grid-cols-2 gap-5">{children}</div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  min,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  min?: number;
}) {
  const Icon = type === "date" ? Calendar : type === "time" ? Clock : type === "number" ? Users : BookOpen;
  return (
    <label className="text-sm font-semibold text-slate-600">
      {label}
      <div className="relative mt-1.5">
        <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type={type}
          min={min}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-md text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>
    </label>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="text-sm font-semibold text-slate-600">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 w-full px-3 py-2.5 border border-slate-200 rounded-md bg-white text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}
