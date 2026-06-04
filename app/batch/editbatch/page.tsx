// "use client";

// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { motion, AnimatePresence } from "motion/react";
// import {
//   Search, Trash2, Pencil, X, CheckCircle2, AlertCircle,
//   ChevronLeft, ChevronRight, Users, Monitor, Building2, Blend,
//   ArrowRight, User, Phone, Mail, GraduationCap, ChevronDown,
//   Menu, RefreshCw,
// } from "lucide-react";
// import { clsx, type ClassValue } from "clsx";
// import { twMerge } from "tailwind-merge";

// const LOGO_URL = "https://www.codescaler.com/logo.png";
// function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

// // ── Types ──────────────────────────────────────────────────
// type BatchType = "ONLINE" | "OFFLINE" | "HYBRID";

// interface BatchMini {
//   id:          string;
//   name:        string;
//   course:      string;
//   batchType:   BatchType;
//   timingStart: string;
//   timingEnd:   string;
//   startDate:   string;
// }

// interface Booking {
//   id:         string;
//   fullName:   string;
//   whatsappNo: string;
//   email:      string;
//   college:    string;
//   batchId:    string;
//   batch:      BatchMini;
//   createdAt:  string;
// }

// interface EditForm {
//   fullName:   string;
//   whatsappNo: string;
//   email:      string;
//   college:    string;
// }

// type EditErrors = Partial<Record<keyof EditForm, string>>;

// interface Pagination {
//   total: number;
//   page:  number;
//   limit: number;
//   pages: number;
// }

// // ── Constants ──────────────────────────────────────────────
// const COLLEGES = [
//   "Hindu Kanya Mahavidyalaya, Jind",
//   "Govt. PG College, Jind",
//   "Govt. PIG College, Jind",
//   "CRSU, Jind",
//   "JIET",
//   "GJU Hisar",
//   "Govt. College Uchana",
//   "Other",
// ];

// const PAGE_SIZES = [10, 20, 50];

// // ── Helpers ────────────────────────────────────────────────
// const typeIcon = (t: BatchType) =>
//   t === "ONLINE"  ? <Monitor  size={12} /> :
//   t === "OFFLINE" ? <Building2 size={12} /> :
//                     <Blend    size={12} />;

// const typeColor = (t: BatchType) =>
//   t === "ONLINE"  ? "bg-blue-50 text-blue-700 border-blue-200" :
//   t === "OFFLINE" ? "bg-purple-50 text-purple-700 border-purple-200" :
//                     "bg-amber-50 text-amber-700 border-amber-200";

// const fmtTime = (t: string) => {
//   const [h, m] = t.split(":").map(Number);
//   return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
// };

// const fmtDate = (d: string) =>
//   new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

// function isValidPhone(phone: string): boolean {
//   const cleaned    = phone.replace(/[\s\-()+]/g, "");
//   const normalized =
//     cleaned.length === 12 && cleaned.startsWith("91") ? cleaned.slice(2) :
//     cleaned.startsWith("0") && cleaned.length === 11  ? cleaned.slice(1) :
//     cleaned;
//   return /^[6-9]\d{9}$/.test(normalized);
// }

// // ── Skeleton row ───────────────────────────────────────────
// function SkeletonRow() {
//   return (
//     <tr className="animate-pulse">
//       {[...Array(7)].map((_, i) => (
//         <td key={i} className="px-4 py-3">
//           <div className="h-4 bg-slate-100 rounded-lg" style={{ width: `${60 + (i * 17) % 40}%` }} />
//         </td>
//       ))}
//     </tr>
//   );
// }

// // ── Page ───────────────────────────────────────────────────
// export default function AdminBookingsPage() {
//   const [bookings,    setBookings]    = useState<Booking[]>([]);
//   const [pagination,  setPagination]  = useState<Pagination>({ total:0, page:1, limit:20, pages:0 });
//   const [loading,     setLoading]     = useState(true);
//   const [search,      setSearch]      = useState("");
//   const [batchFilter, setBatchFilter] = useState("");
//   const [limit,       setLimit]       = useState(20);
//   const [isMenuOpen,  setIsMenuOpen]  = useState(false);

//   // batches dropdown (fetched once)
//   const [batches, setBatches] = useState<BatchMini[]>([]);

//   // edit modal
//   const [editTarget,  setEditTarget]  = useState<Booking | null>(null);
//   const [editForm,    setEditForm]    = useState<EditForm>({ fullName:"", whatsappNo:"", email:"", college:"" });
//   const [editErrors,  setEditErrors]  = useState<EditErrors>({});
//   const [editSaving,  setEditSaving]  = useState(false);
//   const [editError,   setEditError]   = useState("");

//   // delete confirm
//   const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null);
//   const [deleting,     setDeleting]     = useState(false);

//   // toast
//   const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
//   const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const showToast = (msg: string, type: "success" | "error") => {
//     if (toastTimer.current) {
//       clearTimeout(toastTimer.current);
//     }
//     setToast({ msg, type });
//     toastTimer.current = setTimeout(() => setToast(null), 3200);
//   };

//   // ── Fetch bookings ────────────────────────────────────
//   const fetchBookings = useCallback(async (page = 1) => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams({
//         page:    String(page),
//         limit:   String(limit),
//         ...(search      ? { search }      : {}),
//         ...(batchFilter ? { batchId: batchFilter } : {}),
//       });
//       const res  = await fetch(`/api/batch/bookings?${params}`);
      
//       const data = await res.json();
//       console.log("Fetch bookings with params:", data);
//       if (data.success) {
//         setBookings(data.bookings);
//         setPagination(data.pagination);
//       }
//     } catch {
//       showToast("Failed to fetch bookings.", "error");
//     } finally {
//       setLoading(false);
//     }
//   }, [search, batchFilter, limit]);

//   // Fetch batches for filter dropdown
//   useEffect(() => {
//     (async () => {
//       try {
//         const res  = await fetch("/api/batch");
//         const data = await res.json();
//         if (data.success) setBatches(data.batches);
//       } catch {}
//     })();
//   }, []);

//   // Re-fetch when filters change (debounce search)
//   const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
//   useEffect(() => {
//     if (searchTimer.current) {
//       clearTimeout(searchTimer.current);
//     }
//     searchTimer.current = setTimeout(() => fetchBookings(1), search ? 350 : 0);
//     return () => {
//       if (searchTimer.current) {
//         clearTimeout(searchTimer.current);
//       }
//     };
//   }, [search, batchFilter, limit, fetchBookings]);

//   // ── Edit ─────────────────────────────────────────────
//   const openEdit = (b: Booking) => {
//     setEditTarget(b);
//     setEditForm({ fullName: b.fullName, whatsappNo: b.whatsappNo, email: b.email, college: b.college });
//     setEditErrors({});
//     setEditError("");
//   };

//   const updEdit = (f: keyof EditForm, v: string) => {
//     setEditForm(p => ({ ...p, [f]: v }));
//     setEditErrors(p => { const n = { ...p }; delete n[f]; return n; });
//   };

//   const validateEdit = (): boolean => {
//     const e: EditErrors = {};
//     if (!editForm.fullName.trim())   e.fullName   = "Required";
//     if (!editForm.whatsappNo.trim()) e.whatsappNo = "Required";
//     else if (!isValidPhone(editForm.whatsappNo)) e.whatsappNo = "Valid 10-digit Indian number";
//     if (!editForm.email.trim())      e.email = "Required";
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) e.email = "Invalid email";
//     if (!editForm.college)           e.college = "Required";
//     setEditErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const saveEdit = async () => {
//     if (!validateEdit() || !editTarget) return;
//     setEditSaving(true);
//     setEditError("");
//     try {
//       const res  = await fetch(`/api/bookings/${editTarget.id}`, {
//         method:  "PUT",
//         headers: { "Content-Type": "application/json" },
//         body:    JSON.stringify(editForm),
//       });
//       const data = await res.json();
//       if (data.success) {
//         setBookings(prev => prev.map(b => b.id === editTarget.id ? { ...b, ...editForm } : b));
//         setEditTarget(null);
//         showToast("Booking updated successfully.", "success");
//       } else {
//         setEditError(data.error || "Update failed.");
//       }
//     } catch {
//       setEditError("Network error. Please try again.");
//     } finally {
//       setEditSaving(false);
//     }
//   };

//   // ── Delete ────────────────────────────────────────────
//   const confirmDelete = async () => {
//     if (!deleteTarget) return;
//     setDeleting(true);
//     try {
//       const res  = await fetch(`/api/bookings/${deleteTarget.id}`, { method: "DELETE" });
//       const data = await res.json();
//       if (data.success) {
//         setBookings(prev => prev.filter(b => b.id !== deleteTarget.id));
//         setPagination(p => ({ ...p, total: p.total - 1 }));
//         setDeleteTarget(null);
//         showToast("Booking deleted.", "success");
//       } else {
//         showToast(data.error || "Delete failed.", "error");
//         setDeleteTarget(null);
//       }
//     } catch {
//       showToast("Network error.", "error");
//       setDeleteTarget(null);
//     } finally {
//       setDeleting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">

//       {/* Nav */}
//       <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200">
//         <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <img src={LOGO_URL} alt="CodeScaler" className="w-20 h-20 object-contain"
//               onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
//             <a href="https://www.codescaler.com/">
//               <span className="font-bold text-2xl tracking-tight text-neutral-800">CodeScaler</span>
//             </a>
//           </div>
//           <div className="hidden md:flex items-center gap-8 text-neutral-500 font-medium">
//             <a href="/"                      className="hover:text-blue-600 transition-colors">Roadmap</a>
//             <a href="/admission"             className="hover:text-blue-600 transition-colors">Admission</a>
//             <a href="/batch"                 className="hover:text-blue-600 transition-colors">Batches</a>
//             <a href="/admin/bookings"        className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-0.5">Bookings</a>
//             <a href="/contact"              className="px-5 py-2 rounded-full bg-neutral-900 text-white font-bold hover:bg-neutral-800 transition-all">
//               Contact Us
//             </a>
//           </div>
//           <button onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="md:hidden p-2 text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors">
//             {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>
//       </nav>

//       {/* Body */}
//       <div className="max-w-7xl mx-auto px-4 py-10">

//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-1">
//             Batch Bookings
//           </h1>
//           <p className="text-slate-500">View, edit or remove seat reservations across all batches.</p>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
//           {[
//             { label: "Total Bookings", value: pagination.total },
//             { label: "Batches",        value: batches.length  },
//             { label: "Page",           value: `${pagination.page} / ${pagination.pages || 1}` },
//           ].map(s => (
//             <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
//               <p className="text-2xl font-black text-slate-900">{s.value}</p>
//               <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">{s.label}</p>
//             </div>
//           ))}
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             {/* Search */}
//             <div className="relative flex-1">
//               <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
//               <input type="text" placeholder="Search name, email, phone, college…"
//                 value={search} onChange={e => setSearch(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50
//                   focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition" />
//             </div>

//             {/* Batch filter */}
//             <div className="relative min-w-[200px]">
//               <Users size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
//               <select value={batchFilter} onChange={e => setBatchFilter(e.target.value)}
//                 className="w-full pl-10 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50
//                   focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition appearance-none">
//                 <option value="">All Batches</option>
//                 {batches.map(b => (
//                   <option key={b.id} value={b.id}>{b.name} — {b.course}</option>
//                 ))}
//               </select>
//               <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//             </div>

//             {/* Page size */}
//             <div className="relative">
//               <select value={limit} onChange={e => setLimit(Number(e.target.value))}
//                 className="pl-3 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50
//                   focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition appearance-none">
//                 {PAGE_SIZES.map(s => <option key={s} value={s}>{s} / page</option>)}
//               </select>
//               <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//             </div>

//             {/* Refresh */}
//             <button onClick={() => fetchBookings(pagination.page)}
//               className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
//               <RefreshCw size={14} /> Refresh
//             </button>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="bg-slate-50 border-b border-slate-100">
//                   {["#", "Student", "Contact", "College", "Batch", "Mode", "Booked On", "Actions"].map(h => (
//                     <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {loading ? (
//                   [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
//                 ) : bookings.length === 0 ? (
//                   <tr>
//                     <td colSpan={8} className="py-20 text-center text-slate-400">
//                       <Users size={40} className="mx-auto mb-3 opacity-25" />
//                       <p className="font-semibold">No bookings found.</p>
//                     </td>
//                   </tr>
//                 ) : (
//                   bookings.map((b, i) => (
//                     <motion.tr key={b.id}
//                       initial={{ opacity: 0, y: 6 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: i * 0.03 }}
//                       className="hover:bg-slate-50/70 transition-colors group">

//                       {/* # */}
//                       <td className="px-4 py-3 text-slate-400 text-xs font-mono">
//                         {(pagination.page - 1) * pagination.limit + i + 1}
//                       </td>

//                       {/* Student */}
//                       <td className="px-4 py-3">
//                         <p className="font-semibold text-slate-800 leading-tight">{b.fullName}</p>
//                         <p className="text-xs text-slate-400 mt-0.5">{b.email}</p>
//                       </td>

//                       {/* Contact */}
//                       <td className="px-4 py-3 text-slate-600 font-medium whitespace-nowrap">{b.whatsappNo}</td>

//                       {/* College */}
//                       <td className="px-4 py-3 text-slate-500 max-w-[160px] truncate" title={b.college}>{b.college}</td>

//                       {/* Batch */}
//                       <td className="px-4 py-3">
//                         <p className="font-semibold text-slate-700 leading-tight whitespace-nowrap">{b.batch.name}</p>
//                         <p className="text-xs text-blue-500 mt-0.5">{b.batch.course}</p>
//                         <p className="text-[11px] text-slate-400">
//                           {fmtTime(b.batch.timingStart)} – {fmtTime(b.batch.timingEnd)}
//                         </p>
//                       </td>

//                       {/* Mode */}
//                       <td className="px-4 py-3">
//                         <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-xl border", typeColor(b.batch.batchType))}>
//                           {typeIcon(b.batch.batchType)} {b.batch.batchType}
//                         </span>
//                       </td>

//                       {/* Booked On */}
//                       <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
//                         {fmtDate(b.createdAt)}
//                       </td>

//                       {/* Actions */}
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                           <button onClick={() => openEdit(b)}
//                             className="p-2 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
//                             title="Edit booking">
//                             <Pencil size={15} />
//                           </button>
//                           <button onClick={() => setDeleteTarget(b)}
//                             className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
//                             title="Delete booking">
//                             <Trash2 size={15} />
//                           </button>
//                         </div>
//                       </td>
//                     </motion.tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {pagination.pages > 1 && (
//             <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap">
//               <p className="text-sm text-slate-500">
//                 Showing {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
//                 <strong className="text-slate-700">{pagination.total}</strong> bookings
//               </p>
//               <div className="flex items-center gap-1.5">
//                 <button disabled={pagination.page <= 1}
//                   onClick={() => fetchBookings(pagination.page - 1)}
//                   className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
//                   <ChevronLeft size={15} />
//                 </button>
//                 {Array.from({ length: Math.min(7, pagination.pages) }, (_, i) => {
//                   // Show pages around current
//                   const half  = 3;
//                   let start   = Math.max(1, pagination.page - half);
//                   const end   = Math.min(pagination.pages, start + 6);
//                   start       = Math.max(1, end - 6);
//                   return start + i;
//                 }).map(p => (
//                   <button key={p} onClick={() => fetchBookings(p)}
//                     className={cn(
//                       "w-9 h-9 rounded-xl text-sm font-semibold transition-all",
//                       p === pagination.page
//                         ? "bg-blue-600 text-white shadow-md shadow-blue-200"
//                         : "border border-slate-200 text-slate-600 hover:bg-slate-50"
//                     )}>
//                     {p}
//                   </button>
//                 ))}
//                 <button disabled={pagination.page >= pagination.pages}
//                   onClick={() => fetchBookings(pagination.page + 1)}
//                   className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
//                   <ChevronRight size={15} />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ── Edit Modal ─────────────────────────────────── */}
//       <AnimatePresence>
//         {editTarget && (
//           <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//               onClick={() => setEditTarget(null)}
//               className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm" />
//             <motion.div
//               initial={{ opacity: 0, scale: 0.94, y: 24 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.96, y: 16 }}
//               className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-8">

//               {/* Header */}
//               <div className="flex items-start justify-between p-6 border-b border-slate-100">
//                 <div>
//                   <h2 className="text-xl font-bold text-slate-800">Edit Booking</h2>
//                   <p className="text-sm text-slate-400 mt-0.5">
//                     {editTarget.batch.name} · {editTarget.batch.course}
//                   </p>
//                 </div>
//                 <button onClick={() => setEditTarget(null)}
//                   className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-400">
//                   <X size={20} />
//                 </button>
//               </div>

//               <div className="p-6 space-y-4">
//                 {/* Full Name */}
//                 <EField label="Full Name" error={editErrors.fullName}>
//                   <EInput icon={<User size={15} />} placeholder="e.g. Rahul Kumar"
//                     value={editForm.fullName} onChange={v => updEdit("fullName", v)} error={editErrors.fullName} />
//                 </EField>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   {/* WhatsApp */}
//                   <EField label="WhatsApp Number" error={editErrors.whatsappNo}>
//                     <EInput icon={<Phone size={15} />} placeholder="10-digit mobile" type="tel"
//                       value={editForm.whatsappNo} onChange={v => updEdit("whatsappNo", v)} error={editErrors.whatsappNo} />
//                   </EField>
//                   {/* Email */}
//                   <EField label="Email" error={editErrors.email}>
//                     <EInput icon={<Mail size={15} />} placeholder="you@example.com" type="email"
//                       value={editForm.email} onChange={v => updEdit("email", v)} error={editErrors.email} />
//                   </EField>
//                 </div>

//                 {/* College */}
//                 <EField label="College / Institute" error={editErrors.college}>
//                   <div className="relative">
//                     <GraduationCap size={15} className={cn("absolute left-3.5 top-1/2 -translate-y-1/2 z-10",
//                       editErrors.college ? "text-red-400" : "text-slate-400")} />
//                     <select value={editForm.college} onChange={e => updEdit("college", e.target.value)}
//                       className={cn(
//                         "w-full pl-10 pr-4 py-3 border rounded-xl text-sm bg-slate-50 outline-none transition-all appearance-none focus:bg-white focus:ring-4",
//                         editErrors.college
//                           ? "border-red-400 focus:ring-red-100"
//                           : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
//                       )}>
//                       <option value="" disabled>Select college</option>
//                       {COLLEGES.map(c => <option key={c} value={c}>{c}</option>)}
//                     </select>
//                     <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                   </div>
//                 </EField>

//                 <AnimatePresence>
//                   {editError && (
//                     <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
//                       className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
//                       <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
//                       <div className="flex-1">
//                         <p className="text-sm font-bold text-red-700 mb-0.5">Update Failed</p>
//                         <p className="text-xs text-red-600">{editError}</p>
//                       </div>
//                       <button onClick={() => setEditError("")} className="text-red-300 hover:text-red-500"><X size={15} /></button>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>

//                 <div className="flex gap-3 pt-1">
//                   <button onClick={() => setEditTarget(null)}
//                     className="flex-1 py-3 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 text-sm transition">
//                     Cancel
//                   </button>
//                   <button disabled={editSaving} onClick={saveEdit}
//                     className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl
//                       font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-60 text-sm">
//                     {editSaving ? "Saving…" : <><span>Save Changes</span><ArrowRight size={15} /></>}
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>

//       {/* ── Delete Confirm Modal ────────────────────────── */}
//       <AnimatePresence>
//         {deleteTarget && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//               onClick={() => !deleting && setDeleteTarget(null)}
//               className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm" />
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//               className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden p-8 text-center">

//               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Trash2 size={28} className="text-red-500" />
//               </div>
//               <h3 className="text-xl font-bold text-slate-800 mb-1">Delete Booking?</h3>
//               <p className="text-sm text-slate-400 mb-1">
//                 This will permanently remove the booking for
//               </p>
//               <p className="font-bold text-slate-700 mb-1">{deleteTarget.fullName}</p>
//               <p className="text-xs text-slate-400 mb-6">{deleteTarget.batch.name} · {deleteTarget.batch.course}</p>

//               <div className="flex gap-3">
//                 <button disabled={deleting} onClick={() => setDeleteTarget(null)}
//                   className="flex-1 py-3 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 text-sm transition">
//                   Cancel
//                 </button>
//                 <button disabled={deleting} onClick={confirmDelete}
//                   className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition shadow-lg shadow-red-100 active:scale-95 disabled:opacity-60 text-sm">
//                   {deleting ? "Deleting…" : "Yes, Delete"}
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>

//       {/* ── Toast ──────────────────────────────────────── */}
//       <AnimatePresence>
//         {toast && (
//           <motion.div
//             initial={{ opacity: 0, y: 60 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 60 }}
//             className={cn(
//               "fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold whitespace-nowrap",
//               toast.type === "success"
//                 ? "bg-emerald-600 text-white"
//                 : "bg-red-600 text-white"
//             )}>
//             {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
//             {toast.msg}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// // ── Field / Input helpers (same style as batch page) ──────
// function EField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
//   return (
//     <div className="flex flex-col gap-1.5">
//       <div className="flex justify-between items-center">
//         <label className={cn("text-sm font-semibold", error ? "text-red-500" : "text-slate-600")}>{label}</label>
//         {error && <span className="text-[10px] font-bold text-red-500 uppercase leading-tight max-w-[55%] text-right">{error}</span>}
//       </div>
//       {children}
//     </div>
//   );
// }

// function EInput({ icon, placeholder, value, onChange, type = "text", error }: {
//   icon?: React.ReactNode; placeholder?: string; value: string;
//   onChange: (v: string) => void; type?: string; error?: string;
// }) {
//   return (
//     <div className="relative">
//       {icon && (
//         <div className={cn("absolute left-3.5 top-1/2 -translate-y-1/2", error ? "text-red-400" : "text-slate-400")}>
//           {icon}
//         </div>
//       )}
//       <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
//         className={cn(
//           "w-full bg-slate-50 border rounded-xl py-3 px-4 text-sm outline-none transition-all focus:bg-white focus:ring-4",
//           error ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-blue-100",
//           icon && "pl-10"
//         )} />
//     </div>
//   );
// }


"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, Trash2, Pencil, X, CheckCircle2, AlertCircle,
  ChevronLeft, ChevronRight, Users, Monitor, Building2, Blend,
  ArrowRight, User, Phone, Mail, GraduationCap, ChevronDown,
  Menu, RefreshCw,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const LOGO_URL = "https://www.codescaler.com/logo.png";
function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

// ── Types ──────────────────────────────────────────────────
type BatchType = "ONLINE" | "OFFLINE" | "HYBRID";

interface BatchMini {
  id:          string;
  name:        string;
  course:      string;
  batchType:   BatchType;
  timingStart: string;
  timingEnd:   string;
  startDate:   string;
}

interface Booking {
  id:         string;
  fullName:   string;
  whatsappNo: string;
  email:      string;
  college:    string;
  batchId:    string;
  batch:      BatchMini;
  createdAt:  string;
}

interface EditForm {
  fullName:   string;
  whatsappNo: string;
  email:      string;
  college:    string;
}

type EditErrors = Partial<Record<keyof EditForm, string>>;

interface Pagination {
  total: number;
  page:  number;
  limit: number;
  pages: number;
}

// ── Constants ──────────────────────────────────────────────
const COLLEGES = [
  "Hindu Kanya Mahavidyalaya, Jind",
  "Govt. PG College, Jind",
  "Govt. PIG College, Jind",
  "CRSU, Jind",
  "JIET",
  "GJU Hisar",
  "Govt. College Uchana",
  "Other",
];

const PAGE_SIZES = [10, 20, 50];

// ── Helpers ────────────────────────────────────────────────
const typeIcon = (t: BatchType) =>
  t === "ONLINE"  ? <Monitor  size={12} /> :
  t === "OFFLINE" ? <Building2 size={12} /> :
                    <Blend    size={12} />;

const typeColor = (t: BatchType) =>
  t === "ONLINE"  ? "bg-blue-50 text-blue-700 border-blue-200" :
  t === "OFFLINE" ? "bg-purple-50 text-purple-700 border-purple-200" :
                    "bg-amber-50 text-amber-700 border-amber-200";

const fmtTime = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

function isValidPhone(phone: string): boolean {
  const cleaned    = phone.replace(/[\s\-()+]/g, "");
  const normalized =
    cleaned.length === 12 && cleaned.startsWith("91") ? cleaned.slice(2) :
    cleaned.startsWith("0") && cleaned.length === 11  ? cleaned.slice(1) :
    cleaned;
  return /^[6-9]\d{9}$/.test(normalized);
}

// ── Skeleton row ───────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[...Array(7)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-slate-100 rounded-lg" style={{ width: `${60 + (i * 17) % 40}%` }} />
        </td>
      ))}
    </tr>
  );
}

// ── Page ───────────────────────────────────────────────────
export default function AdminBookingsPage() {
  const [bookings,    setBookings]    = useState<Booking[]>([]);
  const [pagination,  setPagination]  = useState<Pagination>({ total:0, page:1, limit:20, pages:0 });
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [limit,       setLimit]       = useState(20);
  const [isMenuOpen,  setIsMenuOpen]  = useState(false);

  // batches dropdown (fetched once)
  const [batches, setBatches] = useState<BatchMini[]>([]);

  // edit modal
  const [editTarget,  setEditTarget]  = useState<Booking | null>(null);
  const [editForm,    setEditForm]    = useState<EditForm>({ fullName:"", whatsappNo:"", email:"", college:"" });
  const [editErrors,  setEditErrors]  = useState<EditErrors>({});
  const [editSaving,  setEditSaving]  = useState(false);
  const [editError,   setEditError]   = useState("");

  // delete confirm
  const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null);
  const [deleting,     setDeleting]     = useState(false);

  // toast
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  };

  // ── Fetch bookings ────────────────────────────────────
  const fetchBookings = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page:    String(page),
        limit:   String(limit),
        ...(search      ? { search }      : {}),
        ...(batchFilter ? { batchId: batchFilter } : {}),
      });
      const res  = await fetch(`/api/batch/bookings?${params}`);
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings);
        setPagination(data.pagination);
      }
    } catch {
      showToast("Failed to fetch bookings.", "error");
    } finally {
      setLoading(false);
    }
  }, [search, batchFilter, limit]);

  // Fetch batches for filter dropdown
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch("/api/batch");
        const data = await res.json();
        if (data.success) setBatches(data.batches);
      } catch {}
    })();
  }, []);

  // Re-fetch when filters change (debounce search)
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }
    searchTimer.current = setTimeout(() => fetchBookings(1), search ? 350 : 0);
    return () => {
      if (searchTimer.current) {
        clearTimeout(searchTimer.current);
      }
    };
  }, [search, batchFilter, limit, fetchBookings]);

  // ── Edit ─────────────────────────────────────────────
  const openEdit = (b: Booking) => {
    setEditTarget(b);
    setEditForm({ fullName: b.fullName, whatsappNo: b.whatsappNo, email: b.email, college: b.college });
    setEditErrors({});
    setEditError("");
  };

  const updEdit = (f: keyof EditForm, v: string) => {
    setEditForm(p => ({ ...p, [f]: v }));
    setEditErrors(p => { const n = { ...p }; delete n[f]; return n; });
  };

  const validateEdit = (): boolean => {
    const e: EditErrors = {};
    if (!editForm.fullName.trim())   e.fullName   = "Required";
    if (!editForm.whatsappNo.trim()) e.whatsappNo = "Required";
    else if (!isValidPhone(editForm.whatsappNo)) e.whatsappNo = "Valid 10-digit Indian number";
    if (!editForm.email.trim())      e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) e.email = "Invalid email";
    if (!editForm.college)           e.college = "Required";
    setEditErrors(e);
    return Object.keys(e).length === 0;
  };

  const saveEdit = async () => {
    if (!validateEdit() || !editTarget) return;
    setEditSaving(true);
    setEditError("");
    try {
      const res  = await fetch(`/api/batch/bookings/${editTarget.id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(editForm),
      });
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.map(b => b.id === editTarget.id ? { ...b, ...editForm } : b));
        setEditTarget(null);
        showToast("Booking updated successfully.", "success");
      } else {
        setEditError(data.error || "Update failed.");
      }
    } catch {
      setEditError("Network error. Please try again.");
    } finally {
      setEditSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res  = await fetch(`/api/batch/bookings/${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.filter(b => b.id !== deleteTarget.id));
        setPagination(p => ({ ...p, total: p.total - 1 }));
        setDeleteTarget(null);
        showToast("Booking deleted.", "success");
      } else {
        showToast(data.error || "Delete failed.", "error");
        setDeleteTarget(null);
      }
    } catch {
      showToast("Network error.", "error");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">

      {/* Nav */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={LOGO_URL} alt="CodeScaler" className="w-20 h-20 object-contain"
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <a href="https://www.codescaler.com/">
              <span className="font-bold text-2xl tracking-tight text-neutral-800">CodeScaler</span>
            </a>
          </div>
          <div className="hidden md:flex items-center gap-8 text-neutral-500 font-medium">
            <a href="/"                      className="hover:text-blue-600 transition-colors">Roadmap</a>
            <a href="/admission"             className="hover:text-blue-600 transition-colors">Admission</a>
            <a href="/batch"                 className="hover:text-blue-600 transition-colors">Batches</a>
            <a href="/admin/bookings"        className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-0.5">Bookings</a>
            <a href="/contact"              className="px-5 py-2 rounded-full bg-neutral-900 text-white font-bold hover:bg-neutral-800 transition-all">
              Contact Us
            </a>
          </div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-1">
            Batch Bookings
          </h1>
          <p className="text-slate-500">View, edit or remove seat reservations across all batches.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Bookings", value: pagination.total },
            { label: "Batches",        value: batches.length  },
            { label: "Page",           value: `${pagination.page} / ${pagination.pages || 1}` },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
              <p className="text-2xl font-black text-slate-900">{s.value}</p>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search name, email, phone, college…"
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50
                  focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition" />
            </div>

            {/* Batch filter */}
            <div className="relative min-w-[200px]">
              <Users size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
              <select value={batchFilter} onChange={e => setBatchFilter(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50
                  focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition appearance-none">
                <option value="">All Batches</option>
                {batches.map(b => (
                  <option key={b.id} value={b.id}>{b.name} — {b.course}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Page size */}
            <div className="relative">
              <select value={limit} onChange={e => setLimit(Number(e.target.value))}
                className="pl-3 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50
                  focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition appearance-none">
                {PAGE_SIZES.map(s => <option key={s} value={s}>{s} / page</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Refresh */}
            <button onClick={() => fetchBookings(pagination.page)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["#", "Student", "Contact", "College", "Batch", "Mode", "Booked On", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-20 text-center text-slate-400">
                      <Users size={40} className="mx-auto mb-3 opacity-25" />
                      <p className="font-semibold">No bookings found.</p>
                    </td>
                  </tr>
                ) : (
                  bookings.map((b, i) => (
                    <motion.tr key={b.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-slate-50/70 transition-colors group">

                      {/* # */}
                      <td className="px-4 py-3 text-slate-400 text-xs font-mono">
                        {(pagination.page - 1) * pagination.limit + i + 1}
                      </td>

                      {/* Student */}
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-800 leading-tight">{b.fullName}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{b.email}</p>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-3 text-slate-600 font-medium whitespace-nowrap">{b.whatsappNo}</td>

                      {/* College */}
                      <td className="px-4 py-3 text-slate-500 max-w-[160px] truncate" title={b.college}>{b.college}</td>

                      {/* Batch */}
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-700 leading-tight whitespace-nowrap">{b.batch.name}</p>
                        <p className="text-xs text-blue-500 mt-0.5">{b.batch.course}</p>
                        <p className="text-[11px] text-slate-400">
                          {fmtTime(b.batch.timingStart)} – {fmtTime(b.batch.timingEnd)}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Starts {fmtDate(b.batch.startDate)}
                        </p>
                      </td>

                      {/* Mode */}
                      <td className="px-4 py-3">
                        <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-xl border", typeColor(b.batch.batchType))}>
                          {typeIcon(b.batch.batchType)} {b.batch.batchType}
                        </span>
                      </td>

                      {/* Booked On */}
                      <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                        {fmtDate(b.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(b)}
                            className="p-2 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                            title="Edit booking">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => setDeleteTarget(b)}
                            className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                            title="Delete booking">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap">
              <p className="text-sm text-slate-500">
                Showing {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                <strong className="text-slate-700">{pagination.total}</strong> bookings
              </p>
              <div className="flex items-center gap-1.5">
                <button disabled={pagination.page <= 1}
                  onClick={() => fetchBookings(pagination.page - 1)}
                  className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
                  <ChevronLeft size={15} />
                </button>
                {Array.from({ length: Math.min(7, pagination.pages) }, (_, i) => {
                  // Show pages around current
                  const half  = 3;
                  let start   = Math.max(1, pagination.page - half);
                  const end   = Math.min(pagination.pages, start + 6);
                  start       = Math.max(1, end - 6);
                  return start + i;
                }).map(p => (
                  <button key={p} onClick={() => fetchBookings(p)}
                    className={cn(
                      "w-9 h-9 rounded-xl text-sm font-semibold transition-all",
                      p === pagination.page
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}>
                    {p}
                  </button>
                ))}
                <button disabled={pagination.page >= pagination.pages}
                  onClick={() => fetchBookings(pagination.page + 1)}
                  className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Edit Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {editTarget && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setEditTarget(null)}
              className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-8">

              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Edit Booking</h2>
                  <p className="text-sm text-slate-400 mt-0.5">
                    {editTarget.batch.name} · {editTarget.batch.course}
                  </p>
                </div>
                <button onClick={() => setEditTarget(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Full Name */}
                <EField label="Full Name" error={editErrors.fullName}>
                  <EInput icon={<User size={15} />} placeholder="e.g. Rahul Kumar"
                    value={editForm.fullName} onChange={v => updEdit("fullName", v)} error={editErrors.fullName} />
                </EField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* WhatsApp */}
                  <EField label="WhatsApp Number" error={editErrors.whatsappNo}>
                    <EInput icon={<Phone size={15} />} placeholder="10-digit mobile" type="tel"
                      value={editForm.whatsappNo} onChange={v => updEdit("whatsappNo", v)} error={editErrors.whatsappNo} />
                  </EField>
                  {/* Email */}
                  <EField label="Email" error={editErrors.email}>
                    <EInput icon={<Mail size={15} />} placeholder="you@example.com" type="email"
                      value={editForm.email} onChange={v => updEdit("email", v)} error={editErrors.email} />
                  </EField>
                </div>

                {/* College */}
                <EField label="College / Institute" error={editErrors.college}>
                  <div className="relative">
                    <GraduationCap size={15} className={cn("absolute left-3.5 top-1/2 -translate-y-1/2 z-10",
                      editErrors.college ? "text-red-400" : "text-slate-400")} />
                    <select value={editForm.college} onChange={e => updEdit("college", e.target.value)}
                      className={cn(
                        "w-full pl-10 pr-4 py-3 border rounded-xl text-sm bg-slate-50 outline-none transition-all appearance-none focus:bg-white focus:ring-4",
                        editErrors.college
                          ? "border-red-400 focus:ring-red-100"
                          : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                      )}>
                      <option value="" disabled>Select college</option>
                      {COLLEGES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </EField>

                <AnimatePresence>
                  {editError && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
                      <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-red-700 mb-0.5">Update Failed</p>
                        <p className="text-xs text-red-600">{editError}</p>
                      </div>
                      <button onClick={() => setEditError("")} className="text-red-300 hover:text-red-500"><X size={15} /></button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-3 pt-1">
                  <button onClick={() => setEditTarget(null)}
                    className="flex-1 py-3 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 text-sm transition">
                    Cancel
                  </button>
                  <button disabled={editSaving} onClick={saveEdit}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl
                      font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-60 text-sm">
                    {editSaving ? "Saving…" : <><span>Save Changes</span><ArrowRight size={15} /></>}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirm Modal ────────────────────────── */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !deleting && setDeleteTarget(null)}
              className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden p-8 text-center">

              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={28} className="text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">Delete Booking?</h3>
              <p className="text-sm text-slate-400 mb-1">
                This will permanently remove the booking for
              </p>
              <p className="font-bold text-slate-700 mb-1">{deleteTarget.fullName}</p>
              <p className="text-xs text-slate-400 mb-6">{deleteTarget.batch.name} · {deleteTarget.batch.course}</p>

              <div className="flex gap-3">
                <button disabled={deleting} onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 text-sm transition">
                  Cancel
                </button>
                <button disabled={deleting} onClick={confirmDelete}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition shadow-lg shadow-red-100 active:scale-95 disabled:opacity-60 text-sm">
                  {deleting ? "Deleting…" : "Yes, Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Toast ──────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            className={cn(
              "fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold whitespace-nowrap",
              toast.type === "success"
                ? "bg-emerald-600 text-white"
                : "bg-red-600 text-white"
            )}>
            {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Field / Input helpers (same style as batch page) ──────
function EField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <label className={cn("text-sm font-semibold", error ? "text-red-500" : "text-slate-600")}>{label}</label>
        {error && <span className="text-[10px] font-bold text-red-500 uppercase leading-tight max-w-[55%] text-right">{error}</span>}
      </div>
      {children}
    </div>
  );
}

function EInput({ icon, placeholder, value, onChange, type = "text", error }: {
  icon?: React.ReactNode; placeholder?: string; value: string;
  onChange: (v: string) => void; type?: string; error?: string;
}) {
  return (
    <div className="relative">
      {icon && (
        <div className={cn("absolute left-3.5 top-1/2 -translate-y-1/2", error ? "text-red-400" : "text-slate-400")}>
          {icon}
        </div>
      )}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className={cn(
          "w-full bg-slate-50 border rounded-xl py-3 px-4 text-sm outline-none transition-all focus:bg-white focus:ring-4",
          error ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-blue-100",
          icon && "pl-10"
        )} />
    </div>
  );
}