"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen, Clock, Calendar, Users, Monitor, Building2,
  Blend, ChevronRight, CheckCircle2, X, Menu, Plus,
  Layers, User, AlignLeft, Hash,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const LOGO_URL = "https://www.codescaler.com/logo.png";
function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

const COURSES  = ["Frontend Web Design", "Full Stack Development", "Data Analyst"];
const DAYS_ALL = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TYPES    = ["ONLINE", "OFFLINE", "HYBRID"] as const;
type BatchType = typeof TYPES[number];

interface BatchForm {
  name:        string;
  course:      string;
  batchType:   BatchType | "";
  instructor:  string;
  startDate:   string;
  endDate:     string;
  timingStart: string;
  timingEnd:   string;
  days:        string[];
  totalSeats:  string;
  description: string;
}

type Errors = Partial<Record<keyof BatchForm, string>>;

const INIT: BatchForm = {
  name:"", course:"", batchType:"", instructor:"",
  startDate:"", endDate:"", timingStart:"", timingEnd:"",
  days:[], totalSeats:"", description:"",
};

const typeIcon = (t: BatchType) =>
  t === "ONLINE"  ? <Monitor   size={16}/> :
  t === "OFFLINE" ? <Building2 size={16}/> : <Blend size={16}/>;

const typeColor = (t: BatchType, selected: boolean) => {
  const map = {
    ONLINE:  selected ? "bg-blue-600   border-blue-600   text-white" : "border-blue-200   text-blue-600   hover:bg-blue-50",
    OFFLINE: selected ? "bg-purple-600 border-purple-600 text-white" : "border-purple-200 text-purple-600 hover:bg-purple-50",
    HYBRID:  selected ? "bg-amber-500  border-amber-500  text-white" : "border-amber-200  text-amber-600  hover:bg-amber-50",
  };
  return map[t];
};

export default function AddBatchPage() {
  const [form,       setForm]       = useState<BatchForm>(INIT);
  const [errors,     setErrors]     = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [submitErr,  setSubmitErr]  = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const update = (field: keyof BatchForm, value: string | string[]) => {
    setForm(p => ({ ...p, [field]: value }));
    setErrors(p => { const n = { ...p }; delete n[field]; return n; });
  };

  const toggleDay = (d: string) => {
    const next = form.days.includes(d)
      ? form.days.filter(x => x !== d)
      : [...form.days, d];
    update("days", next);
  };

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.name.trim())                       e.name        = "Required";
    if (!form.course)                            e.course      = "Required";
    if (!form.batchType)                         e.batchType   = "Required";
    if (!form.startDate)                         e.startDate   = "Required";
    if (!form.endDate)                           e.endDate     = "Required";
    else if (form.endDate <= form.startDate)     e.endDate     = "Must be after start date";
    if (!form.timingStart)                       e.timingStart = "Required";
    if (!form.timingEnd)                         e.timingEnd   = "Required";
    else if (form.timingEnd <= form.timingStart) e.timingEnd   = "Must be after start time";
    if (form.days.length === 0)                  e.days        = "Select at least one day";
    if (!form.totalSeats.trim())                 e.totalSeats  = "Required";
    else if (isNaN(+form.totalSeats) || +form.totalSeats < 1) e.totalSeats = "Must be ≥ 1";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitErr("");
    try {
      const res = await fetch("/api/batch", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ ...form, totalSeats: Number(form.totalSeats) }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setSubmitErr(data.error || "Failed to create batch.");
      }
    } catch {
      setSubmitErr("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">

      {/* Nav */}
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
            <a href="/"           className="hover:text-blue-600 transition-colors">Roadmap</a>
            <a href="/admission"  className="hover:text-blue-600 transition-colors">Admission</a>
            <a href="/batch"    className="hover:text-blue-600 transition-colors">Batches</a>
            <a href="/admin/batches/add" className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-0.5">Add Batch</a>
            <a href="/contact"    className="px-5 py-2 rounded-full bg-neutral-900 text-white font-bold hover:bg-neutral-800 transition-all">
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
            <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }}
              exit={{ opacity:0, height:0 }}
              className="md:hidden border-t border-neutral-100 bg-white overflow-hidden">
              <div className="px-4 py-6 flex flex-col gap-3">
                {[
                  { href:"/",                  label:"Roadmap"    },
                  { href:"/admission",         label:"Admission"  },
                  { href:"/batch",           label:"Batch"    },
                  { href:"/admin/batches/add", label:"Add Batch", active:true },
                ].map(l => (
                  <a key={l.href} href={l.href}
                    className={cn("w-full py-4 px-6 rounded-2xl font-bold transition-all",
                      l.active ? "bg-blue-50 text-blue-600" : "text-neutral-500 hover:bg-neutral-50")}>
                    {l.label}
                  </a>
                ))}
                <a href="/contact" className="w-full py-4 px-6 bg-neutral-900 text-white rounded-2xl font-bold text-center">
                  Contact Our Team
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Add New Batch
          </h1>
          <p className="text-slate-500">Fill in all batch details. Students will be able to book seats immediately after creation.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div className="p-6 md:p-10 space-y-8">

            {/* ── Section: Basic Info ── */}
            <Section icon={<BookOpen size={18}/>} title="Batch Information" color="blue">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <Field label="Batch Name" error={errors.name} className="md:col-span-2">
                  <TInput icon={<Hash size={15}/>} placeholder="e.g. Batch A – Morning"
                    value={form.name} onChange={v => update("name", v)} error={errors.name}/>
                </Field>

                <Field label="Course / Domain" error={errors.course} className="md:col-span-2">
                  <div className="flex gap-3 flex-wrap">
                    {COURSES.map(c => (
                      <button key={c} type="button" onClick={() => update("course", c)}
                        className={cn("flex-1 min-w-[160px] py-3 px-4 rounded-xl border text-sm font-semibold transition-all",
                          form.course === c
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-slate-200 text-slate-500 hover:border-slate-300")}>
                        {c}
                      </button>
                    ))}
                  </div>
                  {errors.course && <ErrMsg msg={errors.course}/>}
                </Field>

                <Field label="Batch Type" error={errors.batchType} className="md:col-span-2">
                  <div className="flex gap-3">
                    {TYPES.map(t => (
                      <button key={t} type="button" onClick={() => update("batchType", t)}
                        className={cn("flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border font-bold text-sm transition-all",
                          typeColor(t, form.batchType === t))}>
                        {typeIcon(t)} {t}
                      </button>
                    ))}
                  </div>
                  {errors.batchType && <ErrMsg msg={errors.batchType}/>}
                </Field>

                <Field label="Instructor Name (optional)">
                  <TInput icon={<User size={15}/>} placeholder="e.g. Priya Sharma"
                    value={form.instructor} onChange={v => update("instructor", v)}/>
                </Field>

                <Field label="Total Seats" error={errors.totalSeats}>
                  <TInput icon={<Users size={15}/>} placeholder="e.g. 30" type="number"
                    value={form.totalSeats} onChange={v => update("totalSeats", v)} error={errors.totalSeats}/>
                </Field>

                <Field label="Description (optional)" className="md:col-span-2">
                  <div className="relative">
                    <AlignLeft size={15} className="absolute left-3.5 top-3.5 text-slate-400"/>
                    <textarea rows={3} placeholder="Brief description for students…"
                      value={form.description} onChange={e => update("description", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50
                        outline-none focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition resize-none"/>
                  </div>
                </Field>
              </div>
            </Section>

            <div className="border-t border-slate-100"/>

            {/* ── Section: Schedule ── */}
            <Section icon={<Calendar size={18}/>} title="Schedule" color="purple">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <Field label="Start Date" error={errors.startDate}>
                  <TInput icon={<Calendar size={15}/>} type="date"
                    value={form.startDate} onChange={v => update("startDate", v)} error={errors.startDate}/>
                </Field>

                <Field label="End Date" error={errors.endDate}>
                  <TInput icon={<Calendar size={15}/>} type="date"
                    value={form.endDate} onChange={v => update("endDate", v)} error={errors.endDate}/>
                </Field>

                <Field label="Start Time" error={errors.timingStart}>
                  <TInput icon={<Clock size={15}/>} type="time"
                    value={form.timingStart} onChange={v => update("timingStart", v)} error={errors.timingStart}/>
                </Field>

                <Field label="End Time" error={errors.timingEnd}>
                  <TInput icon={<Clock size={15}/>} type="time"
                    value={form.timingEnd} onChange={v => update("timingEnd", v)} error={errors.timingEnd}/>
                </Field>

                <Field label="Class Days" error={errors.days} className="md:col-span-2">
                  <div className="flex gap-2 flex-wrap">
                    {DAYS_ALL.map(d => (
                      <button key={d} type="button" onClick={() => toggleDay(d)}
                        className={cn("w-14 py-2.5 rounded-xl border font-bold text-xs transition-all",
                          form.days.includes(d)
                            ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200"
                            : "border-slate-200 text-slate-500 hover:border-slate-300 bg-white")}>
                        {d}
                      </button>
                    ))}
                  </div>
                  {errors.days && <ErrMsg msg={errors.days}/>}
                </Field>
              </div>
            </Section>

            {/* ── Preview (live seat grid) ── */}
            {form.totalSeats && !isNaN(+form.totalSeats) && +form.totalSeats >= 1 && (
              <>
                <div className="border-t border-slate-100"/>
                <Section icon={<Layers size={18}/>} title="Seat Preview" color="green">
                  <SeatGrid total={+form.totalSeats} booked={0} preview/>
                  <p className="text-xs text-slate-400 mt-2">
                    This is how the seat grid will look to students. Green = booked, outlined = available.
                  </p>
                </Section>
              </>
            )}

            {/* Error banner */}
            <AnimatePresence>
              {submitErr && (
                <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                  className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <div className="w-8 h-8 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shrink-0 font-black">!</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-red-700 mb-0.5">Failed to create batch</p>
                    <p className="text-xs text-red-600">{submitErr}</p>
                  </div>
                  <button onClick={() => setSubmitErr("")} className="text-red-300 hover:text-red-500"><X size={15}/></button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button disabled={submitting} onClick={handleSubmit}
                className="flex items-center gap-2 px-10 py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800
                  transition shadow-lg active:scale-95 disabled:opacity-60 text-sm">
                {submitting ? "Creating…" : <><Plus size={16}/> Create Batch</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {success && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm"/>
            <motion.div initial={{ opacity:0, scale:0.92, y:24 }} animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.96 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={34} className="text-white"/>
                </div>
                <h2 className="text-2xl font-extrabold mb-1">Batch Created!</h2>
                <p className="text-blue-100 text-sm">"{form.name}" is now live for students to book.</p>
              </div>
              <div className="p-6 flex flex-col gap-3">
                <a href="/batch"
                  className="block w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-center hover:bg-blue-700 transition text-sm">
                  View All Batches
                </a>
                <button onClick={() => { setSuccess(false); setForm(INIT); }}
                  className="w-full py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 text-sm transition">
                  Add Another Batch
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Seat Grid ──────────────────────────────────────────────

export function SeatGrid({ total, booked, preview = false }: { total: number; booked: number; preview?: boolean }) {
  // clamp to reasonable display max (show first 60, indicate rest)
  const displayMax = 60;
  const show   = Math.min(total, displayMax);
  const hidden = total - show;

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: show }).map((_, i) => {
          const isBooked = i < booked;
          return (
            <div key={i}
              title={isBooked ? `Seat ${i+1} – Booked` : `Seat ${i+1} – Available`}
              className={cn(
                "w-7 h-7 rounded-lg border-2 transition-all",
                isBooked
                  ? "bg-emerald-500 border-emerald-500"
                  : preview
                    ? "bg-white border-slate-200"
                    : "bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50 cursor-default"
              )}
            />
          );
        })}
        {hidden > 0 && (
          <div className="w-7 h-7 rounded-lg border-2 border-slate-200 bg-slate-50 flex items-center justify-center
            text-[9px] font-black text-slate-400">
            +{hidden}
          </div>
        )}
      </div>
      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-emerald-500"/>
          <span className="text-xs text-slate-500 font-medium">Booked ({booked})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded border-2 border-slate-200 bg-white"/>
          <span className="text-xs text-slate-500 font-medium">Available ({total - booked})</span>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────

function Section({ icon, title, color, children }: {
  icon: React.ReactNode; title: string; color: string; children: React.ReactNode;
}) {
  const colors: Record<string, string> = {
    blue:   "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    green:  "bg-emerald-50 text-emerald-600",
  };
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", colors[color])}>{icon}</div>
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({ label, error, children, className }: {
  label: string; error?: string; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex justify-between items-center">
        <label className={cn("text-sm font-semibold", error ? "text-red-500" : "text-slate-600")}>{label}</label>
        {error && <span className="text-[10px] font-bold text-red-500 uppercase">{error}</span>}
      </div>
      {children}
    </div>
  );
}

function TInput({ icon, placeholder, value, onChange, type = "text", error }: {
  icon?: React.ReactNode; placeholder?: string; value: string;
  onChange: (v: string) => void; type?: string; error?: string;
}) {
  return (
    <div className="relative">
      {icon && <div className={cn("absolute left-3.5 top-1/2 -translate-y-1/2", error ? "text-red-400" : "text-slate-400")}>{icon}</div>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full bg-slate-50 border rounded-xl py-3 px-4 text-sm outline-none transition-all focus:bg-white focus:ring-4",
          error ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-blue-100",
          icon && "pl-10"
        )}/>
    </div>
  );
}

function ErrMsg({ msg }: { msg: string }) {
  return <p className="text-xs font-bold text-red-500 mt-1">{msg}</p>;
}