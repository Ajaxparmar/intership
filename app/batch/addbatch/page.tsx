"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users, Search, Trash2, Pencil, X, Check, ChevronLeft,
  Mail, Phone, Building2 as CollegeIcon, Calendar,
  AlertTriangle, Download, Monitor, Building2, Blend,
  Loader2, RefreshCw, UserX, Menu, BookOpen,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const LOGO_URL = "https://www.codescaler.com/logo.png";
function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

// ── Types matching Prisma schema ──────────────────────────
interface Batch {
  id:          string;
  name:        string;
  course:      string;
  batchType:   "ONLINE" | "OFFLINE" | "HYBRID";
  totalSeats:  number;
  bookedSeats: number;
  status:      string;
  startDate:   string;
  endDate:     string;
  timingStart: string;
  timingEnd:   string;
  days:        string[];
  instructor:  string | null;
  _count:      { bookings: number };
}

interface BookedSeat {
  id:         string;
  fullName:   string;
  whatsappNo: string;
  email:      string;
  college:    string;
  batchId:    string;
  createdAt:  string;
}

// ── Helpers ───────────────────────────────────────────────
const typeIcon = (t: string) =>
  t === "ONLINE"  ? <Monitor    size={13}/> :
  t === "OFFLINE" ? <Building2  size={13}/> : <Blend size={13}/>;

const typePill = (t: string) => {
  const map: Record<string, string> = {
    ONLINE:  "bg-blue-50   text-blue-600   border-blue-200",
    OFFLINE: "bg-purple-50 text-purple-600 border-purple-200",
    HYBRID:  "bg-amber-50  text-amber-600  border-amber-200",
  };
  return cn("flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-xs font-bold", map[t] ?? "");
};

const statusPill = (s: string) => {
  const map: Record<string, string> = {
    UPCOMING:  "bg-blue-50   text-blue-700   border-blue-200",
    ONGOING:   "bg-emerald-50 text-emerald-700 border-emerald-200",
    FULL:      "bg-red-50    text-red-600    border-red-200",
    COMPLETED: "bg-slate-100 text-slate-500  border-slate-200",
  };
  return cn("px-2.5 py-0.5 rounded-full border text-xs font-bold", map[s] ?? "bg-slate-50 text-slate-500 border-slate-200");
};

function fmt(date: string) {
  return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
function fmtTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${((h % 12) || 12)}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

// ── Edit Modal ────────────────────────────────────────────
function EditModal({
  seat, onClose, onSave,
}: {
  seat:    BookedSeat;
  onClose: () => void;
  onSave:  (updated: BookedSeat) => void;
}) {
  const [form, setForm] = useState({
    fullName:   seat.fullName,
    email:      seat.email,
    whatsappNo: seat.whatsappNo,
    college:    seat.college,
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  const upd = (k: keyof typeof form, v: string) =>
    setForm(p => ({ ...p, [k]: v }));

  const save = async () => {
    setSaving(true); setError("");
    try {
      const res  = await fetch("/api/bookings", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ id: seat.id, ...form }),
      });
      const data = await res.json();
      if (data.success) onSave(data.bookedSeat);
      else setError(data.error ?? "Failed to save.");
    } catch {
      setError("Network error. Please retry.");
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { label: "Full Name",        key: "fullName",   type: "text",  icon: <Users      size={14}/>, placeholder: "Student's full name"    },
    { label: "Email",            key: "email",      type: "email", icon: <Mail       size={14}/>, placeholder: "email@example.com"       },
    { label: "WhatsApp Number",  key: "whatsappNo", type: "tel",   icon: <Phone      size={14}/>, placeholder: "+91 9XXXXXXXXX"          },
    { label: "College",          key: "college",    type: "text",  icon: <CollegeIcon size={14}/>, placeholder: "College name"           },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}/>
      <motion.div initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10">

        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Pencil size={16}/>
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">Edit Student</p>
              <p className="text-xs text-slate-400 truncate max-w-[220px]">{seat.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition p-1">
            <X size={18}/>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {fields.map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                {f.label}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{f.icon}</div>
                <input
                  type={f.type}
                  value={form[f.key]}
                  onChange={e => upd(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50
                    focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition"
                />
              </div>
            </div>
          ))}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
              <AlertTriangle size={13}/> {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button onClick={onClose}
            className="px-5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-white transition">
            Cancel
          </button>
          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition disabled:opacity-60">
            {saving ? <Loader2 size={14} className="animate-spin"/> : <Check size={14}/>}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Delete Confirm ────────────────────────────────────────
function DeleteConfirm({
  seat, onClose, onDelete,
}: {
  seat:     BookedSeat;
  onClose:  () => void;
  onDelete: (id: string) => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const [error,    setError]    = useState("");

  const confirm = async () => {
    setDeleting(true); setError("");
    try {
      const res  = await fetch(`/api/bookings?id=${seat.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) onDelete(seat.id);
      else setError(data.error ?? "Failed to delete.");
    } catch {
      setError("Network error.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}/>
      <motion.div initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden z-10">
        <div className="p-6 text-center">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trash2 size={24} className="text-red-500"/>
          </div>
          <h3 className="font-extrabold text-slate-800 text-lg mb-1">Remove Student?</h3>
          <p className="text-sm text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">{seat.fullName}</span> will be removed from this batch.
          </p>
          <p className="text-xs text-slate-400">{seat.email} · {seat.college}</p>

          {error && (
            <div className="mt-3 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
              <AlertTriangle size={13}/> {error}
            </div>
          )}
        </div>
        <div className="px-5 pb-5 flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
            Cancel
          </button>
          <button onClick={confirm} disabled={deleting}
            className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
            {deleting ? <Loader2 size={14} className="animate-spin"/> : <Trash2 size={14}/>}
            {deleting ? "Removing…" : "Yes, Remove"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Student Row ───────────────────────────────────────────
function StudentRow({
  seat, index, onEdit, onDelete,
}: {
  seat:     BookedSeat;
  index:    number;
  onEdit:   (s: BookedSeat) => void;
  onDelete: (s: BookedSeat) => void;
}) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors group">

      {/* # */}
      <td className="px-4 py-3.5 text-xs font-bold text-slate-400 w-10">
        {index + 1}
      </td>

      {/* Student */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0 select-none">
            {seat.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 leading-tight">{seat.fullName}</p>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <Mail size={10}/> {seat.email}
            </p>
          </div>
        </div>
      </td>

      {/* WhatsApp */}
      <td className="px-4 py-3.5">
        <span className="text-sm text-slate-600 flex items-center gap-1.5">
          <Phone size={12} className="text-slate-400"/> {seat.whatsappNo}
        </span>
      </td>

      {/* College */}
      <td className="px-4 py-3.5">
        <span className="text-sm text-slate-600 flex items-center gap-1.5 max-w-[200px] truncate">
          <CollegeIcon size={12} className="text-slate-400 shrink-0"/> {seat.college}
        </span>
      </td>

      {/* Booked On */}
      <td className="px-4 py-3.5">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Calendar size={11}/> {fmt(seat.createdAt)}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(seat)}
            className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition"
            title="Edit">
            <Pencil size={13}/>
          </button>
          <button onClick={() => onDelete(seat)}
            className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition"
            title="Remove">
            <Trash2 size={13}/>
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

// ── Main Page ─────────────────────────────────────────────
export default function BatchStudentsPage({ params }: { params: { batchId: string } }) {
  const { batchId } = params;

  const [batch,      setBatch]      = useState<Batch | null>(null);
  const [seats,      setSeats]      = useState<BookedSeat[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [editTarget, setEditTarget] = useState<BookedSeat | null>(null);
  const [delTarget,  setDelTarget]  = useState<BookedSeat | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setFetchError("");
    try {
      const [bRes, sRes] = await Promise.all([
        fetch(`/api/batches/${batchId}`),
        fetch(`/api/bookings?batchId=${batchId}`),
      ]);
      const bData = await bRes.json();
      const sData = await sRes.json();
      if (bData.success) setBatch(bData.batch);
      else setFetchError("Batch not found.");
      if (sData.success) setSeats(sData.bookedSeats);
    } catch {
      setFetchError("Failed to load data. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, [batchId]);

  useEffect(() => { load(); }, [load]);

  // Client-side search filter
  const filtered = seats.filter(s => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.fullName.toLowerCase().includes(q)   ||
      s.email.toLowerCase().includes(q)      ||
      s.whatsappNo.includes(q)               ||
      s.college.toLowerCase().includes(q)
    );
  });

  // CSV export
  const exportCSV = () => {
    const header = ["#", "Full Name", "Email", "WhatsApp", "College", "Booked On"];
    const rows   = filtered.map((s, i) => [
      i + 1, s.fullName, s.email, s.whatsappNo, s.college,
      new Date(s.createdAt).toLocaleDateString("en-IN"),
    ]);
    const csv  = [header, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement("a"), {
      href: url, download: `${batch?.name ?? "batch"}-students.csv`,
    });
    a.click();
    URL.revokeObjectURL(url);
  };

  const available = (batch?.totalSeats ?? 0) - (batch?.bookedSeats ?? 0);
  const fillPct   = batch ? Math.round((batch.bookedSeats / batch.totalSeats) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={LOGO_URL} alt="CodeScaler" className="w-20 h-20 object-contain"
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}/>
            <a href="https://www.codescaler.com/">
              <span className="font-bold text-2xl tracking-tight text-neutral-800">CodeScaler</span>
            </a>
          </div>
          <div className="hidden md:flex items-center gap-8 text-neutral-500 font-medium">
            <a href="/"                  className="hover:text-blue-600 transition-colors">Roadmap</a>
            <a href="/admission"         className="hover:text-blue-600 transition-colors">Admission</a>
            <a href="/batch"             className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-0.5">Batches</a>
            <a href="/admin/batches/add" className="hover:text-blue-600 transition-colors">Add Batch</a>
            <a href="/contact" className="px-5 py-2 rounded-full bg-neutral-900 text-white font-bold hover:bg-neutral-800 transition-all">
              Contact Us
            </a>
          </div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors">
            {isMenuOpen ? <X size={24}/> : <Menu size={24}/>}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-neutral-100 bg-white overflow-hidden">
              <div className="px-4 py-6 flex flex-col gap-3">
                {[
                  { href: "/",                  label: "Roadmap"   },
                  { href: "/admission",         label: "Admission" },
                  { href: "/batch",             label: "Batches", active: true },
                  { href: "/admin/batches/add", label: "Add Batch" },
                ].map(l => (
                  <a key={l.href} href={l.href}
                    className={cn("py-4 px-6 rounded-2xl font-bold transition-all",
                      l.active ? "bg-blue-50 text-blue-600" : "text-neutral-500 hover:bg-neutral-50")}>
                    {l.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">

        {/* Back */}
        <a href="/batch"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">
          <ChevronLeft size={16}/> Back to Batches
        </a>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-32">
            <Loader2 size={32} className="animate-spin text-blue-500"/>
          </div>
        )}

        {/* Error */}
        {fetchError && !loading && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-medium">
            <AlertTriangle size={16}/> {fetchError}
            <button onClick={load} className="ml-auto flex items-center gap-1 text-xs hover:underline">
              <RefreshCw size={12}/> Retry
            </button>
          </div>
        )}

        {!loading && batch && (
          <>
            {/* ── Batch Header Card ── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/60 p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-5 justify-between">

                {/* Left: info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                    <BookOpen size={22} className="text-white"/>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h1 className="text-xl font-extrabold text-slate-800">{batch.name}</h1>
                      <span className={typePill(batch.batchType)}>
                        {typeIcon(batch.batchType)} {batch.batchType}
                      </span>
                      <span className={statusPill(batch.status)}>{batch.status}</span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">{batch.course}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {fmt(batch.startDate)} → {fmt(batch.endDate)}
                      &nbsp;·&nbsp;{fmtTime(batch.timingStart)} – {fmtTime(batch.timingEnd)}
                      &nbsp;·&nbsp;{batch.days.join(", ")}
                    </p>
                    {batch.instructor && (
                      <p className="text-xs text-slate-400 mt-0.5">Instructor: {batch.instructor}</p>
                    )}
                  </div>
                </div>

                {/* Right: seat stats */}
                <div className="flex gap-5 shrink-0">
                  {[
                    { label: "Total",    value: batch.totalSeats,  color: "text-slate-700"   },
                    { label: "Booked",   value: batch.bookedSeats, color: "text-blue-600"    },
                    { label: "Available",value: available,         color: "text-emerald-600" },
                  ].map(s => (
                    <div key={s.label} className="text-center">
                      <p className={cn("text-2xl font-extrabold tabular-nums", s.color)}>{s.value}</p>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fill bar */}
              <div className="mt-5">
                <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
                  <span>{batch.bookedSeats} of {batch.totalSeats} seats filled</span>
                  <span>{fillPct}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${fillPct}%` }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className={cn(
                      "h-full rounded-full",
                      fillPct >= 90 ? "bg-gradient-to-r from-red-400 to-red-500"
                        : fillPct >= 60 ? "bg-gradient-to-r from-amber-400 to-orange-500"
                        : "bg-gradient-to-r from-blue-500 to-indigo-500"
                    )}
                  />
                </div>
              </div>
            </div>

            {/* ── Toolbar ── */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              {/* Search */}
              <div className="relative w-full sm:w-80">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search name, email, phone or college…"
                  className="w-full pl-10 pr-9 py-2.5 border border-slate-200 rounded-xl text-sm bg-white
                    focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition"
                />
                {search && (
                  <button onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                    <X size={14}/>
                  </button>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={load}
                  className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 bg-white rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
                  <RefreshCw size={14}/> Refresh
                </button>
                <button onClick={exportCSV} disabled={filtered.length === 0}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition disabled:opacity-50">
                  <Download size={14}/> Export CSV
                </button>
              </div>
            </div>

            {/* ── Table / Empty ── */}
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <UserX size={24} className="text-slate-400"/>
                </div>
                <p className="font-bold text-slate-600 mb-1">
                  {search ? "No matching students" : "No bookings yet"}
                </p>
                <p className="text-sm text-slate-400">
                  {search
                    ? "Try a different search term."
                    : "Students will appear here once they book a seat in this batch."}
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/60 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/70">
                        {["#", "Student", "WhatsApp", "College", "Booked On", "Actions"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((s, i) => (
                        <StudentRow
                          key={s.id} seat={s} index={i}
                          onEdit={setEditTarget} onDelete={setDelTarget}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 border-t border-slate-50 text-xs text-slate-400 font-medium flex items-center justify-between">
                  <span>
                    Showing {filtered.length} of {seats.length} student{seats.length !== 1 ? "s" : ""}
                  </span>
                  {search && filtered.length !== seats.length && (
                    <button onClick={() => setSearch("")}
                      className="text-blue-500 hover:underline font-semibold">
                      Clear filter
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {editTarget && (
          <EditModal
            seat={editTarget}
            onClose={() => setEditTarget(null)}
            onSave={updated => {
              setSeats(prev => prev.map(s => s.id === updated.id ? updated : s));
              setEditTarget(null);
            }}
          />
        )}
        {delTarget && (
          <DeleteConfirm
            seat={delTarget}
            onClose={() => setDelTarget(null)}
            onDelete={id => {
              setSeats(prev => prev.filter(s => s.id !== id));
              // also decrement local batch counter
              setBatch(prev => prev ? { ...prev, bookedSeats: prev.bookedSeats - 1 } : prev);
              setDelTarget(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}