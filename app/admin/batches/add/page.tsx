// "use client";

// import React, { use, useState, useEffect, useCallback } from "react";
// import { motion, AnimatePresence } from "motion/react";
// import {
//   Users, Search, Trash2, Pencil, X, Check, ChevronLeft,
//   Mail, Phone, Building2 as CollegeIcon, Calendar,
//   AlertTriangle, Download, Monitor, Building2, Blend,
//   Loader2, RefreshCw, UserX, Menu, BookOpen,
// } from "lucide-react";
// import { clsx, type ClassValue } from "clsx";
// import { twMerge } from "tailwind-merge";

// const LOGO_URL = "https://www.codescaler.com/logo.png";
// function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

// // ── Types matching Prisma schema ──────────────────────────
// interface Batch {
//   id:          string;
//   name:        string;
//   course:      string;
//   batchType:   "ONLINE" | "OFFLINE" | "HYBRID";
//   totalSeats:  number;
//   bookedSeats: number;
//   status:      string;
//   startDate:   string;
//   endDate:     string;
//   timingStart: string;
//   timingEnd:   string;
//   days:        string[];
//   instructor:  string | null;
//   _count:      { bookings: number };
// }

// interface BookedSeat {
//   id:         string;
//   fullName:   string;
//   whatsappNo: string;
//   email:      string;
//   college:    string;
//   batchId:    string;
//   createdAt:  string;
// }

// // ── Helpers ───────────────────────────────────────────────
// const typeIcon = (t: string) =>
//   t === "ONLINE"  ? <Monitor    size={13}/> :
//   t === "OFFLINE" ? <Building2  size={13}/> : <Blend size={13}/>;

// const typePill = (t: string) => {
//   const map: Record<string, string> = {
//     ONLINE:  "bg-blue-50   text-blue-600   border-blue-200",
//     OFFLINE: "bg-purple-50 text-purple-600 border-purple-200",
//     HYBRID:  "bg-amber-50  text-amber-600  border-amber-200",
//   };
//   return cn("flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-xs font-bold", map[t] ?? "");
// };

// const statusPill = (s: string) => {
//   const map: Record<string, string> = {
//     UPCOMING:  "bg-blue-50   text-blue-700   border-blue-200",
//     ONGOING:   "bg-emerald-50 text-emerald-700 border-emerald-200",
//     FULL:      "bg-red-50    text-red-600    border-red-200",
//     COMPLETED: "bg-slate-100 text-slate-500  border-slate-200",
//   };
//   return cn("px-2.5 py-0.5 rounded-full border text-xs font-bold", map[s] ?? "bg-slate-50 text-slate-500 border-slate-200");
// };

// function fmt(date: string) {
//   return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
// }
// function fmtTime(t: string) {
//   const [h, m] = t.split(":").map(Number);
//   return `${((h % 12) || 12)}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
// }

// // ── Edit Modal ────────────────────────────────────────────
// function EditModal({
//   seat, onClose, onSave,
// }: {
//   seat:    BookedSeat;
//   onClose: () => void;
//   onSave:  (updated: BookedSeat) => void;
// }) {
//   const [form, setForm] = useState({
//     fullName:   seat.fullName,
//     email:      seat.email,
//     whatsappNo: seat.whatsappNo,
//     college:    seat.college,
//   });
//   const [saving, setSaving] = useState(false);
//   const [error,  setError]  = useState("");

//   const upd = (k: keyof typeof form, v: string) =>
//     setForm(p => ({ ...p, [k]: v }));

//   const save = async () => {
//     setSaving(true); setError("");
//     try {
//       const res  = await fetch("/api/bookings", {
//         method:  "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body:    JSON.stringify({ id: seat.id, ...form }),
//       });
//       const data = await res.json();
//       if (data.success) onSave(data.bookedSeat);
//       else setError(data.error ?? "Failed to save.");
//     } catch {
//       setError("Network error. Please retry.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const fields = [
//     { label: "Full Name",        key: "fullName",   type: "text",  icon: <Users      size={14}/>, placeholder: "Student's full name"    },
//     { label: "Email",            key: "email",      type: "email", icon: <Mail       size={14}/>, placeholder: "email@example.com"       },
//     { label: "WhatsApp Number",  key: "whatsappNo", type: "tel",   icon: <Phone      size={14}/>, placeholder: "+91 9XXXXXXXXX"          },
//     { label: "College",          key: "college",    type: "text",  icon: <CollegeIcon size={14}/>, placeholder: "College name"           },
//   ] as const;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//         className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}/>
//       <motion.div initial={{ opacity: 0, scale: 0.94, y: 20 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
//         className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10">

//         {/* Header */}
//         <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
//               <Pencil size={16}/>
//             </div>
//             <div>
//               <p className="font-bold text-slate-800 text-sm">Edit Student</p>
//               <p className="text-xs text-slate-400 truncate max-w-[220px]">{seat.email}</p>
//             </div>
//           </div>
//           <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition p-1">
//             <X size={18}/>
//           </button>
//         </div>

//         {/* Body */}
//         <div className="px-6 py-5 space-y-4">
//           {fields.map(f => (
//             <div key={f.key}>
//               <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
//                 {f.label}
//               </label>
//               <div className="relative">
//                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{f.icon}</div>
//                 <input
//                   type={f.type}
//                   value={form[f.key]}
//                   onChange={e => upd(f.key, e.target.value)}
//                   placeholder={f.placeholder}
//                   className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50
//                     focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition"
//                 />
//               </div>
//             </div>
//           ))}

//           {error && (
//             <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
//               <AlertTriangle size={13}/> {error}
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
//           <button onClick={onClose}
//             className="px-5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-white transition">
//             Cancel
//           </button>
//           <button onClick={save} disabled={saving}
//             className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition disabled:opacity-60">
//             {saving ? <Loader2 size={14} className="animate-spin"/> : <Check size={14}/>}
//             {saving ? "Saving…" : "Save Changes"}
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// // ── Delete Confirm ────────────────────────────────────────
// function DeleteConfirm({
//   seat, onClose, onDelete,
// }: {
//   seat:     BookedSeat;
//   onClose:  () => void;
//   onDelete: (id: string) => void;
// }) {
//   const [deleting, setDeleting] = useState(false);
//   const [error,    setError]    = useState("");

//   const confirm = async () => {
//     setDeleting(true); setError("");
//     try {
//       const res  = await fetch(`/api/bookings?id=${seat.id}`, { method: "DELETE" });
//       const data = await res.json();
//       if (data.success) onDelete(seat.id);
//       else setError(data.error ?? "Failed to delete.");
//     } catch {
//       setError("Network error.");
//     } finally {
//       setDeleting(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//         className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}/>
//       <motion.div initial={{ opacity: 0, scale: 0.94, y: 20 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }}
//         className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden z-10">
//         <div className="p-6 text-center">
//           <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
//             <Trash2 size={24} className="text-red-500"/>
//           </div>
//           <h3 className="font-extrabold text-slate-800 text-lg mb-1">Remove Student?</h3>
//           <p className="text-sm text-slate-500 mb-1">
//             <span className="font-semibold text-slate-700">{seat.fullName}</span> will be removed from this batch.
//           </p>
//           <p className="text-xs text-slate-400">{seat.email} · {seat.college}</p>

//           {error && (
//             <div className="mt-3 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
//               <AlertTriangle size={13}/> {error}
//             </div>
//           )}
//         </div>
//         <div className="px-5 pb-5 flex gap-3">
//           <button onClick={onClose}
//             className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
//             Cancel
//           </button>
//           <button onClick={confirm} disabled={deleting}
//             className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
//             {deleting ? <Loader2 size={14} className="animate-spin"/> : <Trash2 size={14}/>}
//             {deleting ? "Removing…" : "Yes, Remove"}
//           </button>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// // ── Student Row ───────────────────────────────────────────
// function StudentRow({
//   seat, index, onEdit, onDelete,
// }: {
//   seat:     BookedSeat;
//   index:    number;
//   onEdit:   (s: BookedSeat) => void;
//   onDelete: (s: BookedSeat) => void;
// }) {
//   return (
//     <motion.tr
//       initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: index * 0.03 }}
//       className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors group">

//       {/* # */}
//       <td className="px-4 py-3.5 text-xs font-bold text-slate-400 w-10">
//         {index + 1}
//       </td>

//       {/* Student */}
//       <td className="px-4 py-3.5">
//         <div className="flex items-center gap-3">
//           <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0 select-none">
//             {seat.fullName.charAt(0).toUpperCase()}
//           </div>
//           <div>
//             <p className="text-sm font-bold text-slate-800 leading-tight">{seat.fullName}</p>
//             <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
//               <Mail size={10}/> {seat.email}
//             </p>
//           </div>
//         </div>
//       </td>

//       {/* WhatsApp */}
//       <td className="px-4 py-3.5">
//         <span className="text-sm text-slate-600 flex items-center gap-1.5">
//           <Phone size={12} className="text-slate-400"/> {seat.whatsappNo}
//         </span>
//       </td>

//       {/* College */}
//       <td className="px-4 py-3.5">
//         <span className="text-sm text-slate-600 flex items-center gap-1.5 max-w-[200px] truncate">
//           <CollegeIcon size={12} className="text-slate-400 shrink-0"/> {seat.college}
//         </span>
//       </td>

//       {/* Booked On */}
//       <td className="px-4 py-3.5">
//         <span className="text-xs text-slate-400 flex items-center gap-1">
//           <Calendar size={11}/> {fmt(seat.createdAt)}
//         </span>
//       </td>

//       {/* Actions */}
//       <td className="px-4 py-3.5">
//         <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//           <button onClick={() => onEdit(seat)}
//             className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition"
//             title="Edit">
//             <Pencil size={13}/>
//           </button>
//           <button onClick={() => onDelete(seat)}
//             className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition"
//             title="Remove">
//             <Trash2 size={13}/>
//           </button>
//         </div>
//       </td>
//     </motion.tr>
//   );
// }

// // ── Main Page ─────────────────────────────────────────────
// export default function BatchStudentsPage({
//   params,
// }: {
//   params: Promise<{ batchId: string }>;
// }) {
//   // ✅ Next.js 15 fix: unwrap the params Promise with React's `use()`
//   const { batchId } = use(params);

//   const [batch,      setBatch]      = useState<Batch | null>(null);
//   const [seats,      setSeats]      = useState<BookedSeat[]>([]);
//   const [loading,    setLoading]    = useState(true);
//   const [search,     setSearch]     = useState("");
//   const [editTarget, setEditTarget] = useState<BookedSeat | null>(null);
//   const [delTarget,  setDelTarget]  = useState<BookedSeat | null>(null);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [fetchError, setFetchError] = useState("");

//   const load = useCallback(async () => {
//     setLoading(true); setFetchError("");
//     try {
//       const [bRes, sRes] = await Promise.all([
//         fetch(`/api/batches/${batchId}`),
//         fetch(`/api/bookings?batchId=${batchId}`),
//       ]);
//       const bData = await bRes.json();
//       const sData = await sRes.json();
//       if (bData.success) setBatch(bData.batch);
//       else setFetchError("Batch not found.");
//       if (sData.success) setSeats(sData.bookedSeats);
//     } catch {
//       setFetchError("Failed to load data. Check your connection.");
//     } finally {
//       setLoading(false);
//     }
//   }, [batchId]);

//   useEffect(() => { load(); }, [load]);

//   // Client-side search filter
//   const filtered = seats.filter(s => {
//     if (!search.trim()) return true;
//     const q = search.toLowerCase();
//     return (
//       s.fullName.toLowerCase().includes(q)   ||
//       s.email.toLowerCase().includes(q)      ||
//       s.whatsappNo.includes(q)               ||
//       s.college.toLowerCase().includes(q)
//     );
//   });

//   // CSV export
//   const exportCSV = () => {
//     const header = ["#", "Full Name", "Email", "WhatsApp", "College", "Booked On"];
//     const rows   = filtered.map((s, i) => [
//       i + 1, s.fullName, s.email, s.whatsappNo, s.college,
//       new Date(s.createdAt).toLocaleDateString("en-IN"),
//     ]);
//     const csv  = [header, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     const url  = URL.createObjectURL(blob);
//     const a    = Object.assign(document.createElement("a"), {
//       href: url, download: `${batch?.name ?? "batch"}-students.csv`,
//     });
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const available = (batch?.totalSeats ?? 0) - (batch?.bookedSeats ?? 0);
//   const fillPct   = batch ? Math.round((batch.bookedSeats / batch.totalSeats) * 100) : 0;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">

//       {/* ── Nav ── */}
//       <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200">
//         <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <img src={LOGO_URL} alt="CodeScaler" className="w-20 h-20 object-contain"
//               onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}/>
//             <a href="https://www.codescaler.com/">
//               <span className="font-bold text-2xl tracking-tight text-neutral-800">CodeScaler</span>
//             </a>
//           </div>
//           <div className="hidden md:flex items-center gap-8 text-neutral-500 font-medium">
//             <a href="/"                  className="hover:text-blue-600 transition-colors">Roadmap</a>
//             <a href="/admission"         className="hover:text-blue-600 transition-colors">Admission</a>
//             <a href="/batch"             className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-0.5">Batches</a>
//             <a href="/admin/batches/add" className="hover:text-blue-600 transition-colors">Add Batch</a>
//             <a href="/contact" className="px-5 py-2 rounded-full bg-neutral-900 text-white font-bold hover:bg-neutral-800 transition-all">
//               Contact Us
//             </a>
//           </div>
//           <button onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="md:hidden p-2 text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors">
//             {isMenuOpen ? <X size={24}/> : <Menu size={24}/>}
//           </button>
//         </div>

//         <AnimatePresence>
//           {isMenuOpen && (
//             <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
//               exit={{ opacity: 0, height: 0 }}
//               className="md:hidden border-t border-neutral-100 bg-white overflow-hidden">
//               <div className="px-4 py-6 flex flex-col gap-3">
//                 {[
//                   { href: "/",                  label: "Roadmap"   },
//                   { href: "/admission",         label: "Admission" },
//                   { href: "/batch",             label: "Batches", active: true },
//                   { href: "/admin/batches/add", label: "Add Batch" },
//                 ].map(l => (
//                   <a key={l.href} href={l.href}
//                     className={cn("py-4 px-6 rounded-2xl font-bold transition-all",
//                       l.active ? "bg-blue-50 text-blue-600" : "text-neutral-500 hover:bg-neutral-50")}>
//                     {l.label}
//                   </a>
//                 ))}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </nav>

//       <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">

//         {/* Back */}
//         <a href="/batch"
//           className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">
//           <ChevronLeft size={16}/> Back to Batches
//         </a>

//         {/* Loading */}
//         {loading && (
//           <div className="flex items-center justify-center py-32">
//             <Loader2 size={32} className="animate-spin text-blue-500"/>
//           </div>
//         )}

//         {/* Error */}
//         {fetchError && !loading && (
//           <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-medium">
//             <AlertTriangle size={16}/> {fetchError}
//             <button onClick={load} className="ml-auto flex items-center gap-1 text-xs hover:underline">
//               <RefreshCw size={12}/> Retry
//             </button>
//           </div>
//         )}

//         {!loading && batch && (
//           <>
//             {/* ── Batch Header Card ── */}
//             <div className="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/60 p-6">
//               <div className="flex flex-col sm:flex-row sm:items-start gap-5 justify-between">

//                 {/* Left: info */}
//                 <div className="flex items-start gap-4">
//                   <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
//                     <BookOpen size={22} className="text-white"/>
//                   </div>
//                   <div>
//                     <div className="flex items-center gap-2 flex-wrap mb-1">
//                       <h1 className="text-xl font-extrabold text-slate-800">{batch.name}</h1>
//                       <span className={typePill(batch.batchType)}>
//                         {typeIcon(batch.batchType)} {batch.batchType}
//                       </span>
//                       <span className={statusPill(batch.status)}>{batch.status}</span>
//                     </div>
//                     <p className="text-sm text-slate-500 font-medium">{batch.course}</p>
//                     <p className="text-xs text-slate-400 mt-1">
//                       {fmt(batch.startDate)} → {fmt(batch.endDate)}
//                       &nbsp;·&nbsp;{fmtTime(batch.timingStart)} – {fmtTime(batch.timingEnd)}
//                       &nbsp;·&nbsp;{batch.days.join(", ")}
//                     </p>
//                     {batch.instructor && (
//                       <p className="text-xs text-slate-400 mt-0.5">Instructor: {batch.instructor}</p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Right: seat stats */}
//                 <div className="flex gap-5 shrink-0">
//                   {[
//                     { label: "Total",     value: batch.totalSeats,  color: "text-slate-700"   },
//                     { label: "Booked",    value: batch.bookedSeats, color: "text-blue-600"    },
//                     { label: "Available", value: available,         color: "text-emerald-600" },
//                   ].map(s => (
//                     <div key={s.label} className="text-center">
//                       <p className={cn("text-2xl font-extrabold tabular-nums", s.color)}>{s.value}</p>
//                       <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">{s.label}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Fill bar */}
//               <div className="mt-5">
//                 <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
//                   <span>{batch.bookedSeats} of {batch.totalSeats} seats filled</span>
//                   <span>{fillPct}%</span>
//                 </div>
//                 <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
//                   <motion.div
//                     initial={{ width: 0 }}
//                     animate={{ width: `${fillPct}%` }}
//                     transition={{ duration: 0.9, ease: "easeOut" }}
//                     className={cn(
//                       "h-full rounded-full",
//                       fillPct >= 90 ? "bg-gradient-to-r from-red-400 to-red-500"
//                         : fillPct >= 60 ? "bg-gradient-to-r from-amber-400 to-orange-500"
//                         : "bg-gradient-to-r from-blue-500 to-indigo-500"
//                     )}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* ── Toolbar ── */}
//             <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
//               {/* Search */}
//               <div className="relative w-full sm:w-80">
//                 <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
//                 <input
//                   value={search} onChange={e => setSearch(e.target.value)}
//                   placeholder="Search name, email, phone or college…"
//                   className="w-full pl-10 pr-9 py-2.5 border border-slate-200 rounded-xl text-sm bg-white
//                     focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition"
//                 />
//                 {search && (
//                   <button onClick={() => setSearch("")}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
//                     <X size={14}/>
//                   </button>
//                 )}
//               </div>

//               {/* Actions */}
//               <div className="flex items-center gap-3 shrink-0">
//                 <button onClick={load}
//                   className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 bg-white rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
//                   <RefreshCw size={14}/> Refresh
//                 </button>
//                 <button onClick={exportCSV} disabled={filtered.length === 0}
//                   className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition disabled:opacity-50">
//                   <Download size={14}/> Export CSV
//                 </button>
//               </div>
//             </div>

//             {/* ── Table / Empty ── */}
//             {filtered.length === 0 ? (
//               <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
//                 <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                   <UserX size={24} className="text-slate-400"/>
//                 </div>
//                 <p className="font-bold text-slate-600 mb-1">
//                   {search ? "No matching students" : "No bookings yet"}
//                 </p>
//                 <p className="text-sm text-slate-400">
//                   {search
//                     ? "Try a different search term."
//                     : "Students will appear here once they book a seat in this batch."}
//                 </p>
//               </div>
//             ) : (
//               <div className="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/60 overflow-hidden">
//                 <div className="overflow-x-auto">
//                   <table className="w-full min-w-[700px]">
//                     <thead>
//                       <tr className="border-b border-slate-100 bg-slate-50/70">
//                         {["#", "Student", "WhatsApp", "College", "Booked On", "Actions"].map(h => (
//                           <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
//                             {h}
//                           </th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filtered.map((s, i) => (
//                         <StudentRow
//                           key={s.id} seat={s} index={i}
//                           onEdit={setEditTarget} onDelete={setDelTarget}
//                         />
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//                 <div className="px-4 py-3 border-t border-slate-50 text-xs text-slate-400 font-medium flex items-center justify-between">
//                   <span>
//                     Showing {filtered.length} of {seats.length} student{seats.length !== 1 ? "s" : ""}
//                   </span>
//                   {search && filtered.length !== seats.length && (
//                     <button onClick={() => setSearch("")}
//                       className="text-blue-500 hover:underline font-semibold">
//                       Clear filter
//                     </button>
//                   )}
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* ── Modals ── */}
//       <AnimatePresence>
//         {editTarget && (
//           <EditModal
//             seat={editTarget}
//             onClose={() => setEditTarget(null)}
//             onSave={updated => {
//               setSeats(prev => prev.map(s => s.id === updated.id ? updated : s));
//               setEditTarget(null);
//             }}
//           />
//         )}
//         {delTarget && (
//           <DeleteConfirm
//             seat={delTarget}
//             onClose={() => setDelTarget(null)}
//             onDelete={id => {
//               setSeats(prev => prev.filter(s => s.id !== id));
//               setBatch(prev => prev ? { ...prev, bookedSeats: prev.bookedSeats - 1 } : prev);
//               setDelTarget(null);
//             }}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }



"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen, Clock, Calendar, Users, Monitor, Building2,
  Blend, ChevronRight, CheckCircle2, X, Plus,
  Layers, User, AlignLeft, Hash, Phone,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

const COURSES  = ["Frontend Web Design", "Full Stack Development", "Data Analyst"];
const DAYS_ALL = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TYPES    = ["ONLINE", "OFFLINE", "HYBRID"] as const;
type BatchType = typeof TYPES[number];

interface BatchForm {
  name:            string;
  course:          string;
  batchType:       BatchType | "";
  instructor:      string;
  instructorPhone: string;
  startDate:       string;
  endDate:         string;
  timingStart:     string;
  timingEnd:       string;
  days:            string[];
  totalSeats:      string;
  description:     string;
}

type Errors = Partial<Record<keyof BatchForm, string>>;

const INIT: BatchForm = {
  name: "", course: "", batchType: "", instructor: "",
  instructorPhone: "", startDate: "", endDate: "",
  timingStart: "", timingEnd: "", days: [], totalSeats: "", description: "",
};

const typeIcon = (t: BatchType) =>
  t === "ONLINE"  ? <Monitor   size={16}/> :
  t === "OFFLINE" ? <Building2 size={16}/> : <Blend size={16}/>;

const typeColor = (t: BatchType, selected: boolean) => ({
  ONLINE:  selected ? "bg-blue-600   border-blue-600   text-white" : "border-blue-200   text-blue-600   hover:bg-blue-50",
  OFFLINE: selected ? "bg-purple-600 border-purple-600 text-white" : "border-purple-200 text-purple-600 hover:bg-purple-50",
  HYBRID:  selected ? "bg-amber-500  border-amber-500  text-white" : "border-amber-200  text-amber-600  hover:bg-amber-50",
}[t]);

// ── Seat Grid Preview ─────────────────────────────────────
function SeatGrid({ total }: { total: number }) {
  const displayMax = 60;
  const show   = Math.min(total, displayMax);
  const hidden = total - show;
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: show }).map((_, i) => (
          <div key={i}
            className="w-7 h-7 rounded-lg border-2 bg-white border-slate-200"/>
        ))}
        {hidden > 0 && (
          <div className="w-7 h-7 rounded-lg border-2 border-slate-200 bg-slate-50 flex items-center justify-center text-[9px] font-black text-slate-400">
            +{hidden}
          </div>
        )}
      </div>
      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded border-2 border-slate-200 bg-white"/>
          <span className="text-xs text-slate-500 font-medium">Available ({total})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-emerald-500"/>
          <span className="text-xs text-slate-500 font-medium">Booked (0)</span>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────
function Section({ icon, title, color, children }: {
  icon: React.ReactNode; title: string; color: string; children: React.ReactNode;
}) {
  const colors: Record<string, string> = {
    blue:   "bg-blue-50   text-blue-600",
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

function Field({ label, error, children, className, hint }: {
  label: string; error?: string; children: React.ReactNode;
  className?: string; hint?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex justify-between items-center">
        <label className={cn("text-sm font-semibold", error ? "text-red-500" : "text-slate-600")}>{label}</label>
        {error
          ? <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide">{error}</span>
          : hint && <span className="text-[10px] text-slate-400">{hint}</span>
        }
      </div>
      {children}
    </div>
  );
}

function TInput({ icon, placeholder, value, onChange, type = "text", error, disabled }: {
  icon?: React.ReactNode; placeholder?: string; value: string;
  onChange: (v: string) => void; type?: string; error?: string; disabled?: boolean;
}) {
  return (
    <div className="relative">
      {icon && (
        <div className={cn("absolute left-3.5 top-1/2 -translate-y-1/2", error ? "text-red-400" : "text-slate-400")}>
          {icon}
        </div>
      )}
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} disabled={disabled}
        className={cn(
          "w-full bg-slate-50 border rounded-xl py-3 px-4 text-sm outline-none transition-all focus:bg-white focus:ring-4",
          error ? "border-red-400 focus:ring-red-100 focus:border-red-400"
                : "border-slate-200 focus:border-blue-500 focus:ring-blue-100",
          icon      && "pl-10",
          disabled  && "opacity-50 cursor-not-allowed"
        )}/>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────
export default function AddBatchPage() {
  const [form,       setForm]       = useState<BatchForm>(INIT);
  const [errors,     setErrors]     = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [submitErr,  setSubmitErr]  = useState("");

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
    if (!form.name.trim())                         e.name            = "Required";
    if (!form.course)                              e.course          = "Required";
    if (!form.batchType)                           e.batchType       = "Required";
    if (!form.startDate)                           e.startDate       = "Required";
    if (!form.endDate)                             e.endDate         = "Required";
    else if (form.endDate <= form.startDate)       e.endDate         = "Must be after start date";
    if (!form.timingStart)                         e.timingStart     = "Required";
    if (!form.timingEnd)                           e.timingEnd       = "Required";
    else if (form.timingEnd <= form.timingStart)   e.timingEnd       = "Must be after start time";
    if (form.days.length === 0)                    e.days            = "Select at least one day";
    if (!form.totalSeats.trim())                   e.totalSeats      = "Required";
    else if (isNaN(+form.totalSeats) || +form.totalSeats < 1) e.totalSeats = "Must be ≥ 1";

    // Phone: optional but validate format if provided
    if (form.instructorPhone.trim()) {
      const cleaned = form.instructorPhone.replace(/[\s\-()]/g, "");
      if (!/^(\+91|0)?[6-9]\d{9}$/.test(cleaned))
        e.instructorPhone = "Must be a valid 10-digit Indian number";
    }

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
        body: JSON.stringify({
          ...form,
          totalSeats: Number(form.totalSeats),
        }),
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
    <div>
      <div className="max-w-3xl mx-auto">

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
                        className={cn(
                          "flex-1 min-w-[160px] py-3 px-4 rounded-xl border text-sm font-semibold transition-all",
                          form.course === c
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-slate-200 text-slate-500 hover:border-slate-300"
                        )}>
                        {c}
                      </button>
                    ))}
                  </div>
                  {errors.course && <p className="text-xs font-bold text-red-500 mt-1">{errors.course}</p>}
                </Field>

                <Field label="Batch Type" error={errors.batchType} className="md:col-span-2">
                  <div className="flex gap-3">
                    {TYPES.map(t => (
                      <button key={t} type="button" onClick={() => update("batchType", t)}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border font-bold text-sm transition-all",
                          typeColor(t, form.batchType === t)
                        )}>
                        {typeIcon(t)} {t}
                      </button>
                    ))}
                  </div>
                  {errors.batchType && <p className="text-xs font-bold text-red-500 mt-1">{errors.batchType}</p>}
                </Field>

                <Field label="Instructor Name" hint="optional">
                  <TInput icon={<User size={15}/>} placeholder="e.g. Priya Sharma"
                    value={form.instructor} onChange={v => update("instructor", v)}/>
                </Field>

                <Field label="Instructor Phone" hint="optional" error={errors.instructorPhone}>
                  <TInput icon={<Phone size={15}/>} placeholder="e.g. 9876543210" type="tel"
                    value={form.instructorPhone} onChange={v => update("instructorPhone", v)}
                    error={errors.instructorPhone}/>
                </Field>

                <Field label="Total Seats" error={errors.totalSeats}>
                  <TInput icon={<Users size={15}/>} placeholder="e.g. 30" type="number"
                    value={form.totalSeats} onChange={v => update("totalSeats", v)} error={errors.totalSeats}/>
                </Field>

                <Field label="Description" hint="optional" className="md:col-span-2">
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
                        className={cn(
                          "w-14 py-2.5 rounded-xl border font-bold text-xs transition-all",
                          form.days.includes(d)
                            ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200"
                            : "border-slate-200 text-slate-500 hover:border-slate-300 bg-white"
                        )}>
                        {d}
                      </button>
                    ))}
                  </div>
                  {errors.days && <p className="text-xs font-bold text-red-500 mt-1">{errors.days}</p>}
                </Field>

              </div>
            </Section>

            {/* ── Seat Preview ── */}
            <AnimatePresence>
              {form.totalSeats && !isNaN(+form.totalSeats) && +form.totalSeats >= 1 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="border-t border-slate-100 pt-8">
                    <Section icon={<Layers size={18}/>} title="Seat Preview" color="green">
                      <SeatGrid total={+form.totalSeats}/>
                      <p className="text-xs text-slate-400 mt-2">
                        Live preview — this is how the seat grid will appear to students.
                      </p>
                    </Section>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error banner */}
            <AnimatePresence>
              {submitErr && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <div className="w-8 h-8 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shrink-0 font-black text-sm">!</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-red-700 mb-0.5">Failed to create batch</p>
                    <p className="text-xs text-red-600">{submitErr}</p>
                  </div>
                  <button onClick={() => setSubmitErr("")} className="text-red-300 hover:text-red-500 transition">
                    <X size={15}/>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button disabled={submitting} onClick={handleSubmit}
                className="flex items-center gap-2 px-10 py-3.5 bg-slate-900 text-white rounded-xl font-bold
                  hover:bg-slate-800 transition shadow-lg active:scale-95 disabled:opacity-60 text-sm">
                {submitting
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block"/> Creating…</>
                  : <><Plus size={16}/> Create Batch</>}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {success && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm"/>
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={34} className="text-white"/>
                </div>
                <h2 className="text-2xl font-extrabold mb-1">Batch Created!</h2>
                <p className="text-blue-100 text-sm">"{form.name}" is now live for students to book.</p>
              </div>
              <div className="p-6 flex flex-col gap-3">
                <a href="/admin/batches/manage"
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
