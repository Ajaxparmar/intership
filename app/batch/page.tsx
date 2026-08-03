// // // "use client";

// // // import React, { useState, useEffect } from "react";
// // // import { motion, AnimatePresence } from "motion/react";
// // // import {
// // //   Calendar, Clock, Users, Monitor, Building2, Blend,
// // //   CheckCircle2, X, Search, ArrowRight, Menu, BookOpen,
// // //   AlertCircle, User, Phone, Mail, GraduationCap,
// // //   Layers, ChevronRight,
// // // } from "lucide-react";
// // // import { clsx, type ClassValue } from "clsx";
// // // import { twMerge } from "tailwind-merge";

// // // const LOGO_URL = "https://www.codescaler.com/logo.png";
// // // function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

// // // // ── Types ──────────────────────────────────────────────────
// // // type BatchType   = "ONLINE" | "OFFLINE" | "HYBRID";
// // // type BatchStatus = "UPCOMING" | "ONGOING" | "FULL" | "COMPLETED";

// // // interface Batch {
// // //   id:          string;
// // //   name:        string;
// // //   course:      string;
// // //   batchType:   BatchType;
// // //   instructor?: string;
// // //   startDate:   string;
// // //   endDate:     string;
// // //   timingStart: string;
// // //   timingEnd:   string;
// // //   days:        string[];
// // //   totalSeats:  number;
// // //   bookedSeats: number;
// // //   status:      BatchStatus;
// // //   description?: string;
// // // }

// // // interface BookingForm {
// // //   fullName:   string;
// // //   whatsappNo: string;
// // //   email:      string;
// // //   college:    string;
// // // }
// // // type BookingErrors = Partial<Record<keyof BookingForm, string>>;

// // // const INIT_FORM: BookingForm = { fullName:"", whatsappNo:"", email:"", college:"" };

// // // const COLLEGES = [
// // //   "Hindu Kanya Mahavidyalaya, Jind",
// // //   "Govt. PG College, Jind",
// // //   "Govt. PIG College, Jind",
// // //   "CRSU, Jind",
// // //   "JIET",
// // //   "GJU Hisar",
// // //   "Govt. College Uchana",
// // //   "Other",
// // // ];

// // // const COURSES: string[]             = ["All", "Frontend Web Design", "Full Stack Development", "Data Analyst"];
// // // const TYPES:   (BatchType | "All")[] = ["All", "ONLINE", "OFFLINE", "HYBRID"];

// // // // ── Mock data ──────────────────────────────────────────────
// // // const MOCK: Batch[] = [
// // //   { id:"1", name:"Batch A – Morning",   course:"Frontend Web Design",   batchType:"ONLINE",  instructor:"Priya Sharma",  startDate:"2025-08-01", endDate:"2025-10-31", timingStart:"09:00", timingEnd:"11:00", days:["Mon","Wed","Fri"],                     totalSeats:20, bookedSeats:13, status:"UPCOMING",  description:"HTML, CSS, Tailwind and React from scratch." },
// // //   { id:"2", name:"Batch B – Evening",   course:"Frontend Web Design",   batchType:"OFFLINE", instructor:"Ravi Verma",    startDate:"2025-08-05", endDate:"2025-11-05", timingStart:"17:00", timingEnd:"19:00", days:["Tue","Thu","Sat"],                     totalSeats:15, bookedSeats:15, status:"FULL",      description:"In-person sessions at Jind campus." },
// // //   { id:"3", name:"Batch C – Weekend",   course:"Full Stack Development", batchType:"HYBRID",  instructor:"Ankit Goyal",   startDate:"2025-08-10", endDate:"2026-01-10", timingStart:"10:00", timingEnd:"14:00", days:["Sat","Sun"],                           totalSeats:20, bookedSeats:7,  status:"UPCOMING",  description:"Weekend intensive — online theory + offline practicals." },
// // //   { id:"4", name:"Batch D – Morning",   course:"Data Analyst",           batchType:"ONLINE",  instructor:"Sneha Patel",   startDate:"2025-09-01", endDate:"2025-11-30", timingStart:"08:00", timingEnd:"10:00", days:["Mon","Tue","Wed","Thu","Fri"],         totalSeats:12, bookedSeats:3,  status:"UPCOMING",  description:"Python, Pandas, SQL and Power BI end-to-end." },
// // //   { id:"5", name:"Batch E – Afternoon", course:"Full Stack Development", batchType:"OFFLINE", instructor:"Mohit Jain",    startDate:"2025-07-15", endDate:"2025-12-15", timingStart:"14:00", timingEnd:"17:00", days:["Mon","Wed","Fri"],                     totalSeats:18, bookedSeats:18, status:"ONGOING",   description:"Currently running. Node.js and React this month." },
// // //   { id:"6", name:"Batch F – Evening",   course:"Data Analyst",           batchType:"ONLINE",  instructor:"Kavya Reddy",   startDate:"2025-09-15", endDate:"2025-12-15", timingStart:"19:00", timingEnd:"21:00", days:["Mon","Wed","Fri"],                     totalSeats:25, bookedSeats:4,  status:"UPCOMING",  description:"Excel, Power BI, Python for analytics." },
// // // ];

// // // // ── Helpers ────────────────────────────────────────────────
// // // const typeIcon = (t: BatchType) =>
// // //   t === "ONLINE" ? <Monitor size={13}/> : t === "OFFLINE" ? <Building2 size={13}/> : <Blend size={13}/>;

// // // const typeColor = (t: BatchType) =>
// // //   t === "ONLINE"  ? "bg-blue-50 text-blue-700 border-blue-200" :
// // //   t === "OFFLINE" ? "bg-purple-50 text-purple-700 border-purple-200" :
// // //                     "bg-amber-50 text-amber-700 border-amber-200";

// // // const statusCfg = (s: BatchStatus) => ({
// // //   UPCOMING:  { label:"Upcoming",  cls:"bg-blue-50 text-blue-700"       },
// // //   ONGOING:   { label:"Ongoing",   cls:"bg-emerald-50 text-emerald-700" },
// // //   FULL:      { label:"Full",      cls:"bg-red-50 text-red-600"         },
// // //   COMPLETED: { label:"Completed", cls:"bg-slate-100 text-slate-500"    },
// // // }[s]);

// // // const fmtTime = (t: string) => {
// // //   const [h, m] = t.split(":").map(Number);
// // //   return `${h % 12 || 12}:${String(m).padStart(2,"0")} ${h >= 12 ? "PM" : "AM"}`;
// // // };
// // // const fmtDate = (d: string) =>
// // //   new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });
// // // const seatsLeft = (b: Batch) => b.totalSeats - b.bookedSeats;

// // // // ── Seat Grid ──────────────────────────────────────────────

// // // function SeatGrid({ total, booked }: { total: number; booked: number }) {
// // //   const displayMax = 50;
// // //   const show   = Math.min(total, displayMax);
// // //   const hidden = total - show;
// // //   // keep hidden count's "overflow" booked correct
// // //   const showBooked = Math.min(booked, show);

// // //   return (
// // //     <div className="space-y-2">
// // //       <div className="flex flex-wrap gap-1">
// // //         {Array.from({ length: show }).map((_, i) => {
// // //           const isBooked = i < showBooked;
// // //           return (
// // //             <div key={i}
// // //               title={isBooked ? `Seat ${i+1} – Booked` : `Seat ${i+1} – Available`}
// // //               className={cn(
// // //                 "w-6 h-6 rounded-md border-2 transition-all",
// // //                 isBooked
// // //                   ? "bg-emerald-500 border-emerald-500"
// // //                   : "bg-white border-slate-200"
// // //               )}
// // //             />
// // //           );
// // //         })}
// // //         {hidden > 0 && (
// // //           <div className="w-6 h-6 rounded-md border-2 border-dashed border-slate-300 bg-slate-50
// // //             flex items-center justify-center text-[8px] font-black text-slate-400">
// // //             +{hidden}
// // //           </div>
// // //         )}
// // //       </div>
// // //       <div className="flex items-center gap-3">
// // //         <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
// // //           <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"/>
// // //           {booked} booked
// // //         </span>
// // //         <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
// // //           <span className="w-2.5 h-2.5 rounded-sm border-2 border-slate-200 inline-block"/>
// // //           {total - booked} free
// // //         </span>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // // ── Page ───────────────────────────────────────────────────

// // // export default function BatchesPage() {
// // //   const [batches,      setBatches]      = useState<Batch[]>(MOCK);
// // //   const [loading,      setLoading]      = useState(false);
// // //   const [courseFilter, setCourseFilter] = useState("All");
// // //   const [typeFilter,   setTypeFilter]   = useState<BatchType | "All">("All");
// // //   const [search,       setSearch]       = useState("");
// // //   const [isMenuOpen,   setIsMenuOpen]   = useState(false);

// // //   // modal
// // //   const [active,      setActive]      = useState<Batch | null>(null);
// // //   const [form,        setForm]        = useState<BookingForm>(INIT_FORM);
// // //   const [errors,      setErrors]      = useState<BookingErrors>({});
// // //   const [submitting,  setSubmitting]  = useState(false);
// // //   const [submitError, setSubmitError] = useState("");
// // //   const [bookingId,   setBookingId]   = useState("");

// // //   useEffect(() => {
// // //     (async () => {
// // //       setLoading(true);
// // //       try {
// // //         const res  = await fetch("/api/batch");
// // //         const data = await res.json();
// // //         if (data.success) setBatches(data.batches);
// // //       } catch { /* keep mock */ }
// // //       finally { setLoading(false); }
// // //     })();
// // //   }, []);

// // //   const filtered = batches.filter(b => {
// // //     const mc = courseFilter === "All" || b.course === courseFilter;
// // //     const mt = typeFilter   === "All" || b.batchType === typeFilter;
// // //     const ms = [b.name, b.course, b.instructor ?? ""]
// // //       .join(" ").toLowerCase().includes(search.toLowerCase());
// // //     return mc && mt && ms;
// // //   });

// // //   const openModal = (batch: Batch) => {
// // //     if (batch.status === "FULL" || batch.status === "COMPLETED") return;
// // //     setActive(batch);
// // //     setForm(INIT_FORM);
// // //     setErrors({});
// // //     setSubmitError("");
// // //     setBookingId("");
// // //   };

// // //   const closeModal = () => { setActive(null); setBookingId(""); };

// // //   const upd = (f: keyof BookingForm, v: string) => {
// // //     setForm(p => ({ ...p, [f]: v }));
// // //     setErrors(p => { const n = { ...p }; delete n[f]; return n; });
// // //   };

// // //   const validate = () => {
// // //     const e: BookingErrors = {};
// // //     if (!form.fullName.trim())   e.fullName   = "Required";
// // //     if (!form.whatsappNo.trim()) e.whatsappNo = "Required";
// // //     else if (!/^\d{10}$/.test(form.whatsappNo.replace(/\D/g,""))) e.whatsappNo = "10 digits";
// // //     if (!form.email.trim())      e.email      = "Required";
// // //     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))     e.email = "Invalid";
// // //     if (!form.college)           e.college    = "Required";
// // //     setErrors(e);
// // //     return Object.keys(e).length === 0;
// // //   };

// // //   const handleBook = async () => {
// // //     if (!validate() || !active) return;
// // //     setSubmitting(true);
// // //     setSubmitError("");
// // //     try {
// // //       const res  = await fetch("/api/bookseat", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body:    JSON.stringify({ batchId: active.id, ...form }),
// // //       });
// // //       const data = await res.json();
// // //       if (data.success) {
// // //         setBookingId(data.bookingId);
// // //         setBatches(prev => prev.map(b =>
// // //           b.id === active.id
// // //             ? { ...b, bookedSeats: b.bookedSeats + 1,
// // //                 status: b.bookedSeats + 1 >= b.totalSeats ? "FULL" : b.status }
// // //             : b
// // //         ));
// // //       } else {
// // //         setSubmitError(data.error || "Booking failed.");
// // //       }
// // //     } catch {
// // //       setSubmitError("Network error. Please try again.");
// // //     } finally {
// // //       setSubmitting(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">

// // //       {/* Nav */}
// // //       <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200">
// // //         <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
// // //           <div className="flex items-center gap-2">
// // //             <img src={LOGO_URL} alt="CodeScaler" className="w-20 h-20 object-contain"
// // //               onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}/>
// // //             <a href="https://www.codescaler.com/">
// // //               <span className="font-bold text-2xl tracking-tight text-neutral-800">CodeScaler</span>
// // //             </a>
// // //           </div>
// // //           <div className="hidden md:flex items-center gap-8 text-neutral-500 font-medium">
// // //             <a href="/"           className="hover:text-blue-600 transition-colors">Roadmap</a>
// // //             <a href="/"           className="hover:text-blue-600 transition-colors">Internship</a>
// // //             <a href="/admission"  className="hover:text-blue-600 transition-colors">Admission</a>
// // //             <a href="/batch"    className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-0.5">Batches</a>
// // //             <a href="/find"       className="hover:text-blue-600 transition-colors">Find Registration</a>
// // //             <a href="/contact"    className="px-5 py-2 rounded-full bg-neutral-900 text-white font-bold hover:bg-neutral-800 transition-all">
// // //               Contact Us
// // //             </a>
// // //           </div>
// // //           <button onClick={() => setIsMenuOpen(!isMenuOpen)}
// // //             className="md:hidden p-2 text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors">
// // //             {isMenuOpen ? <X size={24}/> : <Menu size={24}/>}
// // //           </button>
// // //         </div>
// // //         <AnimatePresence>
// // //           {isMenuOpen && (
// // //             <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }}
// // //               exit={{ opacity:0, height:0 }}
// // //               className="md:hidden border-t border-neutral-100 bg-white overflow-hidden">
// // //               <div className="px-4 py-6 flex flex-col gap-3">
// // //                 {[
// // //                   { href:"/",                   label:"Roadmap"          },
// // //                   { href:"/admission",          label:"Admission"        },
// // //                   { href:"/batches",            label:"Batches", active:true },
// // //                   { href:"/admin/batches/add",  label:"Add Batch"        },
// // //                   { href:"/find",               label:"Find Registration" },
// // //                 ].map(l => (
// // //                   <a key={l.href} href={l.href}
// // //                     className={cn("w-full py-4 px-6 rounded-2xl font-bold transition-all",
// // //                       l.active ? "bg-blue-50 text-blue-600" : "text-neutral-500 hover:bg-neutral-50")}>
// // //                     {l.label}
// // //                   </a>
// // //                 ))}
// // //                 <a href="/contact" className="w-full py-4 px-6 bg-neutral-900 text-white rounded-2xl font-bold text-center">
// // //                   Contact Our Team
// // //                 </a>
// // //               </div>
// // //             </motion.div>
// // //           )}
// // //         </AnimatePresence>
// // //       </nav>

// // //       {/* Body */}
// // //       <div className="max-w-6xl mx-auto px-4 py-10">

// // //         <div className="text-center mb-10">
// // //           <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
// // //             Browse & Book a Batch
// // //           </h1>
// // //           <p className="text-slate-500">Pick a batch, fill your details, and your seat is reserved instantly.</p>
// // //         </div>

// // //         {/* Stats */}
// // //         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
// // //           {[
// // //             { label:"Total Batches",   value: batches.length },
// // //             { label:"Open Batches",    value: batches.filter(b => b.status !== "FULL" && b.status !== "COMPLETED").length },
// // //             { label:"Total Seats",     value: batches.reduce((a,b) => a + b.totalSeats,  0) },
// // //             { label:"Seats Available", value: batches.reduce((a,b) => a + seatsLeft(b), 0) },
// // //           ].map(s => (
// // //             <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
// // //               <p className="text-2xl font-black text-slate-900">{s.value}</p>
// // //               <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">{s.label}</p>
// // //             </div>
// // //           ))}
// // //         </div>

// // //         {/* Filters */}
// // //         <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
// // //           <div className="flex flex-col md:flex-row gap-4">
// // //             <div className="relative flex-1">
// // //               <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
// // //               <input type="text" placeholder="Search batch, course or instructor…"
// // //                 value={search} onChange={e => setSearch(e.target.value)}
// // //                 className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50
// // //                   focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition"/>
// // //             </div>
// // //             <div className="flex gap-2 flex-wrap">
// // //               {COURSES.map(c => (
// // //                 <button key={c} onClick={() => setCourseFilter(c)}
// // //                   className={cn("px-3.5 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap",
// // //                     courseFilter === c
// // //                       ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200"
// // //                       : "bg-white border-slate-200 text-slate-500 hover:border-slate-300")}>
// // //                   {c}
// // //                 </button>
// // //               ))}
// // //             </div>
// // //             <div className="flex gap-2">
// // //               {TYPES.map(t => (
// // //                 <button key={t} onClick={() => setTypeFilter(t)}
// // //                   className={cn("px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1",
// // //                     typeFilter === t
// // //                       ? "bg-slate-900 border-slate-900 text-white"
// // //                       : "bg-white border-slate-200 text-slate-500 hover:border-slate-300")}>
// // //                   {t !== "All" && typeIcon(t as BatchType)}
// // //                   {t}
// // //                 </button>
// // //               ))}
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Grid */}
// // //         {loading ? (
// // //           <div className="text-center py-20 text-slate-400 font-semibold">Loading batches…</div>
// // //         ) : filtered.length === 0 ? (
// // //           <div className="text-center py-20 text-slate-400">
// // //             <BookOpen size={48} className="mx-auto mb-3 opacity-30"/>
// // //             <p className="font-semibold">No batches match your filters.</p>
// // //           </div>
// // //         ) : (
// // //           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
// // //             {filtered.map((batch, i) => (
// // //               <BatchCard key={batch.id} batch={batch} index={i} onBook={() => openModal(batch)}/>
// // //             ))}
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* Booking Modal */}
// // //       <AnimatePresence>
// // //         {active && (
// // //           <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
// // //             <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
// // //               onClick={closeModal}
// // //               className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm"/>
// // //             <motion.div
// // //               initial={{ opacity:0, scale:0.94, y:24 }}
// // //               animate={{ opacity:1, scale:1, y:0 }}
// // //               exit={{ opacity:0, scale:0.96, y:16 }}
// // //               className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-8">

// // //               {bookingId ? (
// // //                 /* Success */
// // //                 <>
// // //                   <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center relative overflow-hidden">
// // //                     <div className="absolute inset-0 opacity-10"
// // //                       style={{ backgroundImage:"radial-gradient(circle at 20% 50%, white 1px, transparent 1px)", backgroundSize:"28px 28px" }}/>
// // //                     <div className="relative">
// // //                       <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
// // //                         <CheckCircle2 size={34} className="text-white"/>
// // //                       </div>
// // //                       <h2 className="text-2xl font-extrabold mb-1">Seat Booked!</h2>
// // //                       <p className="text-blue-100 text-sm">You're in — your seat is confirmed.</p>
// // //                     </div>
// // //                   </div>
// // //                   <div className="mx-6 -mt-4 relative z-10">
// // //                     <div className="bg-white rounded-2xl border-2 border-blue-600 shadow-xl shadow-blue-100 p-4 text-center">
// // //                       <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Booking ID</p>
// // //                       <p className="text-xl font-black text-blue-600 tracking-widest break-all">{bookingId}</p>
// // //                       <p className="text-xs text-slate-400 mt-1">Save this for future reference</p>
// // //                     </div>
// // //                   </div>
// // //                   <div className="p-6 space-y-4 mt-2">
// // //                     <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
// // //                       <p className="text-xs font-black uppercase tracking-wider text-slate-400">Batch Details</p>
// // //                       <div className="grid grid-cols-2 gap-2">
// // //                         {[
// // //                           { label:"Batch",  value: active.name },
// // //                           { label:"Course", value: active.course },
// // //                           { label:"Timing", value: `${fmtTime(active.timingStart)} – ${fmtTime(active.timingEnd)}` },
// // //                           { label:"Days",   value: active.days.join(", ") },
// // //                           { label:"Mode",   value: active.batchType },
// // //                           { label:"Starts", value: fmtDate(active.startDate) },
// // //                         ].map(r => (
// // //                           <div key={r.label} className="bg-white rounded-xl p-2.5">
// // //                             <p className="text-[10px] font-bold text-slate-400 uppercase">{r.label}</p>
// // //                             <p className="text-xs font-semibold text-slate-800 mt-0.5">{r.value}</p>
// // //                           </div>
// // //                         ))}
// // //                       </div>
// // //                     </div>
// // //                     {/* <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-center">
// // //                       <p className="text-sm text-green-800 font-semibold">
// // //                         📲 Share your Booking ID on WhatsApp{" "}
// // //                         <a href="https://wa.me/918572892552" target="_blank" rel="noopener noreferrer"
// // //                           className="underline text-green-700">8572892552</a>{" "}
// // //                         to confirm your seat.
// // //                       </p>
// // //                     </div> */}
// // //                     <div className="flex gap-3">
// // //                       <button onClick={closeModal}
// // //                         className="flex-1 py-3 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 text-sm transition">
// // //                         Close
// // //                       </button>
// // //                       {/* <button onClick={() => window.print()}
// // //                         className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 text-sm transition">
// // //                         Print / Save
// // //                       </button> */}
// // //                     </div>
// // //                   </div>
// // //                 </>
// // //               ) : (
// // //                 /* Form */
// // //                 <>
// // //                   <div className="flex items-start justify-between p-6 border-b border-slate-100">
// // //                     <div>
// // //                       <h2 className="text-xl font-bold text-slate-800">Book Your Seat</h2>
// // //                       <p className="text-sm text-slate-400 mt-0.5">{active.name} · {active.course}</p>
// // //                     </div>
// // //                     <button onClick={closeModal}
// // //                       className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-400 shrink-0">
// // //                       <X size={20}/>
// // //                     </button>
// // //                   </div>

// // //                   {/* Mini seat grid inside modal */}
// // //                   <div className="mx-6 mt-5 bg-slate-50 border border-slate-100 rounded-2xl p-4">
// // //                     <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Seat Availability</p>
// // //                     <SeatGrid total={active.totalSeats} booked={active.bookedSeats}/>
// // //                   </div>

// // //                   <div className="mx-6 mt-3 bg-blue-50 border border-blue-100 rounded-2xl p-3.5">
// // //                     <div className="flex flex-wrap gap-x-5 gap-y-1.5">
// // //                       {[
// // //                         { icon:<Clock size={13}/>,    text:`${fmtTime(active.timingStart)} – ${fmtTime(active.timingEnd)}` },
// // //                         { icon:<Layers size={13}/>,   text:active.days.join(", ") },
// // //                         { icon:<Calendar size={13}/>, text:fmtDate(active.startDate) },
// // //                         { icon:typeIcon(active.batchType), text:active.batchType },
// // //                       ].map((r, i) => (
// // //                         <div key={i} className="flex items-center gap-1.5 text-xs font-semibold text-blue-700">
// // //                           <span className="opacity-70">{r.icon}</span>{r.text}
// // //                         </div>
// // //                       ))}
// // //                     </div>
// // //                   </div>

// // //                   <div className="p-6 space-y-4">
// // //                     <p className="text-xs font-black uppercase tracking-wider text-slate-400">Your Details</p>

// // //                     <MField label="Full Name" error={errors.fullName}>
// // //                       <MInput icon={<User size={15}/>} placeholder="e.g. Rahul Kumar"
// // //                         value={form.fullName} onChange={v => upd("fullName", v)} error={errors.fullName}/>
// // //                     </MField>

// // //                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // //                       <MField label="WhatsApp Number" error={errors.whatsappNo}>
// // //                         <MInput icon={<Phone size={15}/>} placeholder="10-digit" type="tel"
// // //                           value={form.whatsappNo} onChange={v => upd("whatsappNo", v)} error={errors.whatsappNo}/>
// // //                       </MField>
// // //                       <MField label="Email" error={errors.email}>
// // //                         <MInput icon={<Mail size={15}/>} placeholder="you@example.com" type="email"
// // //                           value={form.email} onChange={v => upd("email", v)} error={errors.email}/>
// // //                       </MField>
// // //                     </div>

// // //                     <MField label="College / Institute" error={errors.college}>
// // //                       <div className="relative">
// // //                         <GraduationCap size={15} className={cn("absolute left-3.5 top-1/2 -translate-y-1/2 z-10",
// // //                           errors.college ? "text-red-400" : "text-slate-400")}/>
// // //                         <select value={form.college} onChange={e => upd("college", e.target.value)}
// // //                           className={cn(
// // //                             "w-full pl-10 pr-4 py-3 border rounded-xl text-sm bg-slate-50 outline-none transition-all appearance-none focus:bg-white focus:ring-4",
// // //                             errors.college ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
// // //                           )}>
// // //                           <option value="" disabled>Select your college</option>
// // //                           {COLLEGES.map(c => <option key={c} value={c}>{c}</option>)}
// // //                         </select>
// // //                         <ChevronRight size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none"/>
// // //                       </div>
// // //                     </MField>

// // //                     <AnimatePresence>
// // //                       {submitError && (
// // //                         <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
// // //                           className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
// // //                           <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5"/>
// // //                           <div className="flex-1">
// // //                             <p className="text-sm font-bold text-red-700 mb-0.5">Booking Failed</p>
// // //                             <p className="text-xs text-red-600">{submitError}</p>
// // //                           </div>
// // //                           <button onClick={() => setSubmitError("")} className="text-red-300 hover:text-red-500"><X size={15}/></button>
// // //                         </motion.div>
// // //                       )}
// // //                     </AnimatePresence>

// // //                     <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-2.5 items-start">
// // //                       <span className="text-amber-500 mt-0.5">⚠️</span>
// // //                       <p className="text-xs text-amber-800 leading-relaxed">
// // //                         One email address can book only one seat per batch. Seats are first-come, first-served.
// // //                       </p>
// // //                     </div>

// // //                     <div className="flex gap-3 pt-1">
// // //                       <button onClick={closeModal}
// // //                         className="flex-1 py-3 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 text-sm transition">
// // //                         Cancel
// // //                       </button>
// // //                       <button disabled={submitting} onClick={handleBook}
// // //                         className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl
// // //                           font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-60 text-sm">
// // //                         {submitting ? "Booking…" : <><span>Confirm Booking</span><ArrowRight size={15}/></>}
// // //                       </button>
// // //                     </div>
// // //                   </div>
// // //                 </>
// // //               )}
// // //             </motion.div>
// // //           </div>
// // //         )}
// // //       </AnimatePresence>
// // //     </div>
// // //   );
// // // }

// // // // Removed duplicate implementation of SeatGrid function

// // // // ── Batch Card ─────────────────────────────────────────────

// // // function BatchCard({ batch, index, onBook }: { batch: Batch; index: number; onBook: () => void }) {
// // //   const closed = batch.status === "FULL" || batch.status === "COMPLETED";
// // //   const sc     = statusCfg(batch.status);

// // //   return (
// // //     <motion.div
// // //       initial={{ opacity:0, y:20 }}
// // //       animate={{ opacity:1, y:0 }}
// // //       transition={{ delay: index * 0.055, duration:0.3 }}
// // //       className={cn(
// // //         "bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col transition-shadow hover:shadow-md",
// // //         closed && "opacity-70"
// // //       )}
// // //     >
// // //       {/* Top */}
// // //       <div className="p-5 pb-4 border-b border-slate-50">
// // //         <div className="flex items-start justify-between gap-3 mb-2">
// // //           <div>
// // //             <h3 className="font-bold text-slate-800 text-base leading-tight">{batch.name}</h3>
// // //             <p className="text-xs text-blue-600 font-semibold mt-0.5">{batch.course}</p>
// // //           </div>
// // //           <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap shrink-0", sc.cls)}>
// // //             {sc.label}
// // //           </span>
// // //         </div>
// // //         {batch.description && (
// // //           <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{batch.description}</p>
// // //         )}
// // //       </div>

// // //       {/* Details */}
// // //       <div className="p-5 flex-1 space-y-2.5">
// // //         <Row icon={<Clock size={13}/>}    text={`${fmtTime(batch.timingStart)} – ${fmtTime(batch.timingEnd)}`}/>
// // //         <Row icon={<Calendar size={13}/>} text={`${fmtDate(batch.startDate)} → ${fmtDate(batch.endDate)}`}/>
// // //         <Row icon={<Layers size={13}/>}   text={batch.days.join(", ")}/>
// // //         {batch.instructor && <Row icon={<User size={13}/>} text={batch.instructor}/>}

// // //         <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border", typeColor(batch.batchType))}>
// // //           {typeIcon(batch.batchType)} {batch.batchType}
// // //         </span>

// // //         {/* ── SEAT GRID ── */}
// // //         <div className="pt-2 border-t border-slate-50">
// // //           <SeatGrid total={batch.totalSeats} booked={batch.bookedSeats}/>
// // //         </div>
// // //       </div>

// // //       {/* CTA */}
// // //       <div className="px-5 pb-5">
// // //         <button onClick={onBook} disabled={closed}
// // //           className={cn(
// // //             "w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
// // //             closed
// // //               ? "bg-slate-100 text-slate-400 cursor-not-allowed"
// // //               : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95"
// // //           )}>
// // //           {closed
// // //             ? (batch.status === "FULL" ? "Batch Full" : "Completed")
// // //             : <><span>Book Seat</span><ArrowRight size={14}/></>}
// // //         </button>
// // //       </div>
// // //     </motion.div>
// // //   );
// // // }

// // // // ── Tiny helpers ───────────────────────────────────────────

// // // function Row({ icon, text }: { icon: React.ReactNode; text: string }) {
// // //   return (
// // //     <div className="flex items-center gap-2 text-xs text-slate-500">
// // //       <span className="text-slate-400 shrink-0">{icon}</span>
// // //       <span className="leading-snug">{text}</span>
// // //     </div>
// // //   );
// // // }

// // // function MField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
// // //   return (
// // //     <div className="flex flex-col gap-1.5">
// // //       <div className="flex justify-between items-center">
// // //         <label className={cn("text-sm font-semibold", error ? "text-red-500" : "text-slate-600")}>{label}</label>
// // //         {error && <span className="text-[10px] font-bold text-red-500 uppercase">{error}</span>}
// // //       </div>
// // //       {children}
// // //     </div>
// // //   );
// // // }

// // // function MInput({ icon, placeholder, value, onChange, type = "text", error }: {
// // //   icon?: React.ReactNode; placeholder?: string; value: string;
// // //   onChange: (v: string) => void; type?: string; error?: string;
// // // }) {
// // //   return (
// // //     <div className="relative">
// // //       {icon && <div className={cn("absolute left-3.5 top-1/2 -translate-y-1/2", error ? "text-red-400" : "text-slate-400")}>{icon}</div>}
// // //       <input type={type} value={value} onChange={e => onChange(e.target.value)}
// // //         placeholder={placeholder}
// // //         className={cn(
// // //           "w-full bg-slate-50 border rounded-xl py-3 px-4 text-sm outline-none transition-all focus:bg-white focus:ring-4",
// // //           error ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-blue-100",
// // //           icon && "pl-10"
// // //         )}/>
// // //     </div>
// // //   );
// // // }

// // "use client";

// // import React, { useState, useEffect } from "react";
// // import { motion, AnimatePresence } from "motion/react";
// // import {
// //   Calendar, Clock, Users, Monitor, Building2, Blend,
// //   CheckCircle2, X, Search, ArrowRight, Menu, BookOpen,
// //   AlertCircle, User, Phone, Mail, GraduationCap,
// //   Layers, ChevronRight,
// // } from "lucide-react";
// // import { clsx, type ClassValue } from "clsx";
// // import { twMerge } from "tailwind-merge";

// // const LOGO_URL = "https://www.codescaler.com/logo.png";
// // function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

// // // ── Types ──────────────────────────────────────────────────
// // type BatchType   = "ONLINE" | "OFFLINE" | "HYBRID";
// // type BatchStatus = "UPCOMING" | "ONGOING" | "FULL" | "COMPLETED";

// // interface Batch {
// //   id:          string;
// //   name:        string;
// //   course:      string;
// //   batchType:   BatchType;
// //   instructor?: string;
// //   startDate:   string;
// //   endDate:     string;
// //   timingStart: string;
// //   timingEnd:   string;
// //   days:        string[];
// //   totalSeats:  number;
// //   bookedSeats: number;
// //   status:      BatchStatus;
// //   description?: string;
// // }

// // interface BookingForm {
// //   fullName:   string;
// //   whatsappNo: string;
// //   email:      string;
// //   college:    string;
// // }
// // type BookingErrors = Partial<Record<keyof BookingForm, string>>;

// // const INIT_FORM: BookingForm = { fullName:"", whatsappNo:"", email:"", college:"" };

// // const COLLEGES = [
// //   "Hindu Kanya Mahavidyalaya, Jind",
// //   "Govt. PG College, Jind",
// //   "Govt. PIG College, Jind",
// //   "CRSU, Jind",
// //   "JIET",
// //   "GJU Hisar",
// //   "Govt. College Uchana",
// //   "Other",
// // ];

// // const COURSES: string[]             = ["All", "Frontend Web Design", "Full Stack Development", "Data Analyst"];
// // const TYPES:   (BatchType | "All")[] = ["All", "ONLINE", "OFFLINE", "HYBRID"];

// // // ── Mock data ──────────────────────────────────────────────
// // const MOCK: Batch[] = [
// //   { id:"1", name:"Batch A – Morning",   course:"Frontend Web Design",   batchType:"ONLINE",  instructor:"Priya Sharma",  startDate:"2025-08-01", endDate:"2025-10-31", timingStart:"09:00", timingEnd:"11:00", days:["Mon","Wed","Fri"],                     totalSeats:20, bookedSeats:13, status:"UPCOMING",  description:"HTML, CSS, Tailwind and React from scratch." },
// //   { id:"2", name:"Batch B – Evening",   course:"Frontend Web Design",   batchType:"OFFLINE", instructor:"Ravi Verma",    startDate:"2025-08-05", endDate:"2025-11-05", timingStart:"17:00", timingEnd:"19:00", days:["Tue","Thu","Sat"],                     totalSeats:15, bookedSeats:15, status:"FULL",      description:"In-person sessions at Jind campus." },
// //   { id:"3", name:"Batch C – Weekend",   course:"Full Stack Development", batchType:"HYBRID",  instructor:"Ankit Goyal",   startDate:"2025-08-10", endDate:"2026-01-10", timingStart:"10:00", timingEnd:"14:00", days:["Sat","Sun"],                           totalSeats:20, bookedSeats:7,  status:"UPCOMING",  description:"Weekend intensive — online theory + offline practicals." },
// //   { id:"4", name:"Batch D – Morning",   course:"Data Analyst",           batchType:"ONLINE",  instructor:"Sneha Patel",   startDate:"2025-09-01", endDate:"2025-11-30", timingStart:"08:00", timingEnd:"10:00", days:["Mon","Tue","Wed","Thu","Fri"],         totalSeats:12, bookedSeats:3,  status:"UPCOMING",  description:"Python, Pandas, SQL and Power BI end-to-end." },
// //   { id:"5", name:"Batch E – Afternoon", course:"Full Stack Development", batchType:"OFFLINE", instructor:"Mohit Jain",    startDate:"2025-07-15", endDate:"2025-12-15", timingStart:"14:00", timingEnd:"17:00", days:["Mon","Wed","Fri"],                     totalSeats:18, bookedSeats:18, status:"ONGOING",   description:"Currently running. Node.js and React this month." },
// //   { id:"6", name:"Batch F – Evening",   course:"Data Analyst",           batchType:"ONLINE",  instructor:"Kavya Reddy",   startDate:"2025-09-15", endDate:"2025-12-15", timingStart:"19:00", timingEnd:"21:00", days:["Mon","Wed","Fri"],                     totalSeats:25, bookedSeats:4,  status:"UPCOMING",  description:"Excel, Power BI, Python for analytics." },
// // ];

// // // ── Status sort order ──────────────────────────────────────
// // const STATUS_ORDER: Record<BatchStatus, number> = {
// //   UPCOMING:  0,
// //   ONGOING:   1,
// //   FULL:      2,
// //   COMPLETED: 3,
// // };

// // // ── Helpers ────────────────────────────────────────────────
// // const typeIcon = (t: BatchType) =>
// //   t === "ONLINE" ? <Monitor size={13}/> : t === "OFFLINE" ? <Building2 size={13}/> : <Blend size={13}/>;

// // const typeColor = (t: BatchType) =>
// //   t === "ONLINE"  ? "bg-blue-50 text-blue-700 border-blue-200" :
// //   t === "OFFLINE" ? "bg-purple-50 text-purple-700 border-purple-200" :
// //                     "bg-amber-50 text-amber-700 border-amber-200";

// // const statusCfg = (s: BatchStatus) => ({
// //   UPCOMING:  { label:"Upcoming",  cls:"bg-blue-50 text-blue-700"       },
// //   ONGOING:   { label:"Ongoing",   cls:"bg-emerald-50 text-emerald-700" },
// //   FULL:      { label:"Full",      cls:"bg-red-50 text-red-600"         },
// //   COMPLETED: { label:"Completed", cls:"bg-slate-100 text-slate-500"    },
// // }[s]);

// // const fmtTime = (t: string) => {
// //   const [h, m] = t.split(":").map(Number);
// //   return `${h % 12 || 12}:${String(m).padStart(2,"0")} ${h >= 12 ? "PM" : "AM"}`;
// // };
// // const fmtDate = (d: string) =>
// //   new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });
// // const seatsLeft = (b: Batch) => b.totalSeats - b.bookedSeats;

// // // ── Seat Grid ──────────────────────────────────────────────

// // function SeatGrid({ total, booked }: { total: number; booked: number }) {
// //   const displayMax = 50;
// //   const show   = Math.min(total, displayMax);
// //   const hidden = total - show;
// //   const showBooked = Math.min(booked, show);

// //   return (
// //     <div className="space-y-2">
// //       <div className="flex flex-wrap gap-1">
// //         {Array.from({ length: show }).map((_, i) => {
// //           const isBooked = i < showBooked;
// //           return (
// //             <div key={i}
// //               title={isBooked ? `Seat ${i+1} – Booked` : `Seat ${i+1} – Available`}
// //               className={cn(
// //                 "w-6 h-6 rounded-md border-2 transition-all",
// //                 isBooked
// //                   ? "bg-emerald-500 border-emerald-500"
// //                   : "bg-white border-slate-200"
// //               )}
// //             />
// //           );
// //         })}
// //         {hidden > 0 && (
// //           <div className="w-6 h-6 rounded-md border-2 border-dashed border-slate-300 bg-slate-50
// //             flex items-center justify-center text-[8px] font-black text-slate-400">
// //             +{hidden}
// //           </div>
// //         )}
// //       </div>
// //       <div className="flex items-center gap-3">
// //         <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
// //           <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"/>
// //           {booked} booked
// //         </span>
// //         <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
// //           <span className="w-2.5 h-2.5 rounded-sm border-2 border-slate-200 inline-block"/>
// //           {total - booked} free
// //         </span>
// //       </div>
// //     </div>
// //   );
// // }

// // // ── Page ───────────────────────────────────────────────────

// // export default function BatchesPage() {
// //   const [batches,      setBatches]      = useState<Batch[]>(MOCK);
// //   const [loading,      setLoading]      = useState(false);
// //   const [courseFilter, setCourseFilter] = useState("All");
// //   const [typeFilter,   setTypeFilter]   = useState<BatchType | "All">("All");
// //   const [search,       setSearch]       = useState("");
// //   const [isMenuOpen,   setIsMenuOpen]   = useState(false);

// //   // modal
// //   const [active,      setActive]      = useState<Batch | null>(null);
// //   const [form,        setForm]        = useState<BookingForm>(INIT_FORM);
// //   const [errors,      setErrors]      = useState<BookingErrors>({});
// //   const [submitting,  setSubmitting]  = useState(false);
// //   const [submitError, setSubmitError] = useState("");
// //   const [bookingId,   setBookingId]   = useState("");

// //   useEffect(() => {
// //     (async () => {
// //       setLoading(true);
// //       try {
// //         const res  = await fetch("/api/batch");
// //         const data = await res.json();
// //         if (data.success) setBatches(data.batches);
// //       } catch { /* keep mock */ }
// //       finally { setLoading(false); }
// //     })();
// //   }, []);

// //   // ── Filtered + Sorted ──────────────────────────────────
// //   const filtered = batches
// //     .filter(b => {
// //       const mc = courseFilter === "All" || b.course === courseFilter;
// //       const mt = typeFilter   === "All" || b.batchType === typeFilter;
// //       const ms = [b.name, b.course, b.instructor ?? ""]
// //         .join(" ").toLowerCase().includes(search.toLowerCase());
// //       return mc && mt && ms;
// //     })
// //     .sort((a, b) => {
// //       // 1. Sort by status priority: UPCOMING → ONGOING → FULL → COMPLETED
// //       const statusDiff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
// //       if (statusDiff !== 0) return statusDiff;
// //       // 2. Within the same status, sort by startDate ascending (earliest first)
// //       return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
// //     });

// //   const openModal = (batch: Batch) => {
// //     if (batch.status === "FULL" || batch.status === "COMPLETED") return;
// //     setActive(batch);
// //     setForm(INIT_FORM);
// //     setErrors({});
// //     setSubmitError("");
// //     setBookingId("");
// //   };

// //   const closeModal = () => { setActive(null); setBookingId(""); };

// //   const upd = (f: keyof BookingForm, v: string) => {
// //     setForm(p => ({ ...p, [f]: v }));
// //     setErrors(p => { const n = { ...p }; delete n[f]; return n; });
// //   };

// //   const validate = () => {
// //     const e: BookingErrors = {};
// //     if (!form.fullName.trim())   e.fullName   = "Required";
// //     if (!form.whatsappNo.trim()) e.whatsappNo = "Required";
// //     else if (!/^\d{10}$/.test(form.whatsappNo.replace(/\D/g,""))) e.whatsappNo = "10 digits";
// //     if (!form.email.trim())      e.email      = "Required";
// //     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))     e.email = "Invalid";
// //     if (!form.college)           e.college    = "Required";
// //     setErrors(e);
// //     return Object.keys(e).length === 0;
// //   };

// //   const handleBook = async () => {
// //     if (!validate() || !active) return;
// //     setSubmitting(true);
// //     setSubmitError("");
// //     try {
// //       const res  = await fetch("/api/bookseat", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body:    JSON.stringify({ batchId: active.id, ...form }),
// //       });
// //       const data = await res.json();
// //       if (data.success) {
// //         setBookingId(data.bookingId);
// //         setBatches(prev => prev.map(b =>
// //           b.id === active.id
// //             ? { ...b, bookedSeats: b.bookedSeats + 1,
// //                 status: b.bookedSeats + 1 >= b.totalSeats ? "FULL" : b.status }
// //             : b
// //         ));
// //       } else {
// //         setSubmitError(data.error || "Booking failed.");
// //       }
// //     } catch {
// //       setSubmitError("Network error. Please try again.");
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">

// //       {/* Nav */}
// //       <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200">
// //         <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
// //           <div className="flex items-center gap-2">
// //             <img src={LOGO_URL} alt="CodeScaler" className="w-20 h-20 object-contain"
// //               onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}/>
// //             <a href="https://www.codescaler.com/">
// //               <span className="font-bold text-2xl tracking-tight text-neutral-800">CodeScaler</span>
// //             </a>
// //           </div>
// //           <div className="hidden md:flex items-center gap-8 text-neutral-500 font-medium">
// //             <a href="/"           className="hover:text-blue-600 transition-colors">Roadmap</a>
// //             <a href="/"           className="hover:text-blue-600 transition-colors">Internship</a>
// //             <a href="/admission"  className="hover:text-blue-600 transition-colors">Admission</a>
// //             <a href="/batch"      className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-0.5">Batches</a>
// //             <a href="/find"       className="hover:text-blue-600 transition-colors">Find Registration</a>
// //             <a href="/contact"    className="px-5 py-2 rounded-full bg-neutral-900 text-white font-bold hover:bg-neutral-800 transition-all">
// //               Contact Us
// //             </a>
// //           </div>
// //           <button onClick={() => setIsMenuOpen(!isMenuOpen)}
// //             className="md:hidden p-2 text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors">
// //             {isMenuOpen ? <X size={24}/> : <Menu size={24}/>}
// //           </button>
// //         </div>
// //         <AnimatePresence>
// //           {isMenuOpen && (
// //             <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }}
// //               exit={{ opacity:0, height:0 }}
// //               className="md:hidden border-t border-neutral-100 bg-white overflow-hidden">
// //               <div className="px-4 py-6 flex flex-col gap-3">
// //                 {[
// //                   { href:"/",                   label:"Roadmap"          },
// //                   { href:"/admission",          label:"Admission"        },
// //                   { href:"/batches",            label:"Batches", active:true },
// //                   { href:"/admin/batches/add",  label:"Add Batch"        },
// //                   { href:"/find",               label:"Find Registration" },
// //                 ].map(l => (
// //                   <a key={l.href} href={l.href}
// //                     className={cn("w-full py-4 px-6 rounded-2xl font-bold transition-all",
// //                       l.active ? "bg-blue-50 text-blue-600" : "text-neutral-500 hover:bg-neutral-50")}>
// //                     {l.label}
// //                   </a>
// //                 ))}
// //                 <a href="/contact" className="w-full py-4 px-6 bg-neutral-900 text-white rounded-2xl font-bold text-center">
// //                   Contact Our Team
// //                 </a>
// //               </div>
// //             </motion.div>
// //           )}
// //         </AnimatePresence>
// //       </nav>

// //       {/* Body */}
// //       <div className="max-w-6xl mx-auto px-4 py-10">

// //         <div className="text-center mb-10">
// //           <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
// //             Browse & Book a Batch
// //           </h1>
// //           <p className="text-slate-500">Pick a batch, fill your details, and your seat is reserved instantly.</p>
// //         </div>

// //         {/* Stats */}
// //         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
// //           {[
// //             { label:"Total Batches",   value: batches.length },
// //             { label:"Open Batches",    value: batches.filter(b => b.status !== "FULL" && b.status !== "COMPLETED").length },
// //             { label:"Total Seats",     value: batches.reduce((a,b) => a + b.totalSeats,  0) },
// //             { label:"Seats Available", value: batches.reduce((a,b) => a + seatsLeft(b), 0) },
// //           ].map(s => (
// //             <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
// //               <p className="text-2xl font-black text-slate-900">{s.value}</p>
// //               <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">{s.label}</p>
// //             </div>
// //           ))}
// //         </div>

// //         {/* Filters */}
// //         <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
// //           <div className="flex flex-col md:flex-row gap-4">
// //             <div className="relative flex-1">
// //               <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
// //               <input type="text" placeholder="Search batch, course or instructor…"
// //                 value={search} onChange={e => setSearch(e.target.value)}
// //                 className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50
// //                   focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition"/>
// //             </div>
// //             <div className="flex gap-2 flex-wrap">
// //               {COURSES.map(c => (
// //                 <button key={c} onClick={() => setCourseFilter(c)}
// //                   className={cn("px-3.5 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap",
// //                     courseFilter === c
// //                       ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200"
// //                       : "bg-white border-slate-200 text-slate-500 hover:border-slate-300")}>
// //                   {c}
// //                 </button>
// //               ))}
// //             </div>
// //             <div className="flex gap-2">
// //               {TYPES.map(t => (
// //                 <button key={t} onClick={() => setTypeFilter(t)}
// //                   className={cn("px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1",
// //                     typeFilter === t
// //                       ? "bg-slate-900 border-slate-900 text-white"
// //                       : "bg-white border-slate-200 text-slate-500 hover:border-slate-300")}>
// //                   {t !== "All" && typeIcon(t as BatchType)}
// //                   {t}
// //                 </button>
// //               ))}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Grid */}
// //         {loading ? (
// //           <div className="text-center py-20 text-slate-400 font-semibold">Loading batches…</div>
// //         ) : filtered.length === 0 ? (
// //           <div className="text-center py-20 text-slate-400">
// //             <BookOpen size={48} className="mx-auto mb-3 opacity-30"/>
// //             <p className="font-semibold">No batches match your filters.</p>
// //           </div>
// //         ) : (
// //           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
// //             {filtered.map((batch, i) => (
// //               <BatchCard key={batch.id} batch={batch} index={i} onBook={() => openModal(batch)}/>
// //             ))}
// //           </div>
// //         )}
// //       </div>

// //       {/* Booking Modal */}
// //       <AnimatePresence>
// //         {active && (
// //           <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
// //             <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
// //               onClick={closeModal}
// //               className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm"/>
// //             <motion.div
// //               initial={{ opacity:0, scale:0.94, y:24 }}
// //               animate={{ opacity:1, scale:1, y:0 }}
// //               exit={{ opacity:0, scale:0.96, y:16 }}
// //               className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-8">

// //               {bookingId ? (
// //                 /* Success */
// //                 <>
// //                   <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center relative overflow-hidden">
// //                     <div className="absolute inset-0 opacity-10"
// //                       style={{ backgroundImage:"radial-gradient(circle at 20% 50%, white 1px, transparent 1px)", backgroundSize:"28px 28px" }}/>
// //                     <div className="relative">
// //                       <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
// //                         <CheckCircle2 size={34} className="text-white"/>
// //                       </div>
// //                       <h2 className="text-2xl font-extrabold mb-1">Seat Booked!</h2>
// //                       <p className="text-blue-100 text-sm">You're in — your seat is confirmed.</p>
// //                     </div>
// //                   </div>
// //                   <div className="mx-6 -mt-4 relative z-10">
// //                     <div className="bg-white rounded-2xl border-2 border-blue-600 shadow-xl shadow-blue-100 p-4 text-center">
// //                       <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Booking ID</p>
// //                       <p className="text-xl font-black text-blue-600 tracking-widest break-all">{bookingId}</p>
// //                       <p className="text-xs text-slate-400 mt-1">Save this for future reference</p>
// //                     </div>
// //                   </div>
// //                   <div className="p-6 space-y-4 mt-2">
// //                     <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
// //                       <p className="text-xs font-black uppercase tracking-wider text-slate-400">Batch Details</p>
// //                       <div className="grid grid-cols-2 gap-2">
// //                         {[
// //                           { label:"Batch",  value: active.name },
// //                           { label:"Course", value: active.course },
// //                           { label:"Timing", value: `${fmtTime(active.timingStart)} – ${fmtTime(active.timingEnd)}` },
// //                           { label:"Days",   value: active.days.join(", ") },
// //                           { label:"Mode",   value: active.batchType },
// //                           { label:"Starts", value: fmtDate(active.startDate) },
// //                         ].map(r => (
// //                           <div key={r.label} className="bg-white rounded-xl p-2.5">
// //                             <p className="text-[10px] font-bold text-slate-400 uppercase">{r.label}</p>
// //                             <p className="text-xs font-semibold text-slate-800 mt-0.5">{r.value}</p>
// //                           </div>
// //                         ))}
// //                       </div>
// //                     </div>
// //                     <div className="flex gap-3">
// //                       <button onClick={closeModal}
// //                         className="flex-1 py-3 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 text-sm transition">
// //                         Close
// //                       </button>
// //                     </div>
// //                   </div>
// //                 </>
// //               ) : (
// //                 /* Form */
// //                 <>
// //                   <div className="flex items-start justify-between p-6 border-b border-slate-100">
// //                     <div>
// //                       <h2 className="text-xl font-bold text-slate-800">Book Your Seat</h2>
// //                       <p className="text-sm text-slate-400 mt-0.5">{active.name} · {active.course}</p>
// //                     </div>
// //                     <button onClick={closeModal}
// //                       className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-400 shrink-0">
// //                       <X size={20}/>
// //                     </button>
// //                   </div>

// //                   {/* Mini seat grid inside modal */}
// //                   <div className="mx-6 mt-5 bg-slate-50 border border-slate-100 rounded-2xl p-4">
// //                     <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Seat Availability</p>
// //                     <SeatGrid total={active.totalSeats} booked={active.bookedSeats}/>
// //                   </div>

// //                   <div className="mx-6 mt-3 bg-blue-50 border border-blue-100 rounded-2xl p-3.5">
// //                     <div className="flex flex-wrap gap-x-5 gap-y-1.5">
// //                       {[
// //                         { icon:<Clock size={13}/>,    text:`${fmtTime(active.timingStart)} – ${fmtTime(active.timingEnd)}` },
// //                         { icon:<Layers size={13}/>,   text:active.days.join(", ") },
// //                         { icon:<Calendar size={13}/>, text:fmtDate(active.startDate) },
// //                         { icon:typeIcon(active.batchType), text:active.batchType },
// //                       ].map((r, i) => (
// //                         <div key={i} className="flex items-center gap-1.5 text-xs font-semibold text-blue-700">
// //                           <span className="opacity-70">{r.icon}</span>{r.text}
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </div>

// //                   <div className="p-6 space-y-4">
// //                     <p className="text-xs font-black uppercase tracking-wider text-slate-400">Your Details</p>

// //                     <MField label="Full Name" error={errors.fullName}>
// //                       <MInput icon={<User size={15}/>} placeholder="e.g. Rahul Kumar"
// //                         value={form.fullName} onChange={v => upd("fullName", v)} error={errors.fullName}/>
// //                     </MField>

// //                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                       <MField label="WhatsApp Number" error={errors.whatsappNo}>
// //                         <MInput icon={<Phone size={15}/>} placeholder="10-digit" type="tel"
// //                           value={form.whatsappNo} onChange={v => upd("whatsappNo", v)} error={errors.whatsappNo}/>
// //                       </MField>
// //                       <MField label="Email" error={errors.email}>
// //                         <MInput icon={<Mail size={15}/>} placeholder="you@example.com" type="email"
// //                           value={form.email} onChange={v => upd("email", v)} error={errors.email}/>
// //                       </MField>
// //                     </div>

// //                     <MField label="College / Institute" error={errors.college}>
// //                       <div className="relative">
// //                         <GraduationCap size={15} className={cn("absolute left-3.5 top-1/2 -translate-y-1/2 z-10",
// //                           errors.college ? "text-red-400" : "text-slate-400")}/>
// //                         <select value={form.college} onChange={e => upd("college", e.target.value)}
// //                           className={cn(
// //                             "w-full pl-10 pr-4 py-3 border rounded-xl text-sm bg-slate-50 outline-none transition-all appearance-none focus:bg-white focus:ring-4",
// //                             errors.college ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
// //                           )}>
// //                           <option value="" disabled>Select your college</option>
// //                           {COLLEGES.map(c => <option key={c} value={c}>{c}</option>)}
// //                         </select>
// //                         <ChevronRight size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none"/>
// //                       </div>
// //                     </MField>

// //                     <AnimatePresence>
// //                       {submitError && (
// //                         <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
// //                           className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
// //                           <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5"/>
// //                           <div className="flex-1">
// //                             <p className="text-sm font-bold text-red-700 mb-0.5">Booking Failed</p>
// //                             <p className="text-xs text-red-600">{submitError}</p>
// //                           </div>
// //                           <button onClick={() => setSubmitError("")} className="text-red-300 hover:text-red-500"><X size={15}/></button>
// //                         </motion.div>
// //                       )}
// //                     </AnimatePresence>

// //                     <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-2.5 items-start">
// //                       <span className="text-amber-500 mt-0.5">⚠️</span>
// //                       <p className="text-xs text-amber-800 leading-relaxed">
// //                         One email address can book only one seat per batch. Seats are first-come, first-served.
// //                       </p>
// //                     </div>

// //                     <div className="flex gap-3 pt-1">
// //                       <button onClick={closeModal}
// //                         className="flex-1 py-3 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 text-sm transition">
// //                         Cancel
// //                       </button>
// //                       <button disabled={submitting} onClick={handleBook}
// //                         className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl
// //                           font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-60 text-sm">
// //                         {submitting ? "Booking…" : <><span>Confirm Booking</span><ArrowRight size={15}/></>}
// //                       </button>
// //                     </div>
// //                   </div>
// //                 </>
// //               )}
// //             </motion.div>
// //           </div>
// //         )}
// //       </AnimatePresence>
// //     </div>
// //   );
// // }

// // // ── Batch Card ─────────────────────────────────────────────

// // function BatchCard({ batch, index, onBook }: { batch: Batch; index: number; onBook: () => void }) {
// //   const closed = batch.status === "FULL" || batch.status === "COMPLETED";
// //   const sc     = statusCfg(batch.status);

// //   return (
// //     <motion.div
// //       initial={{ opacity:0, y:20 }}
// //       animate={{ opacity:1, y:0 }}
// //       transition={{ delay: index * 0.055, duration:0.3 }}
// //       className={cn(
// //         "bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col transition-shadow hover:shadow-md",
// //         closed && "opacity-70"
// //       )}
// //     >
// //       {/* Top */}
// //       <div className="p-5 pb-4 border-b border-slate-50">
// //         <div className="flex items-start justify-between gap-3 mb-2">
// //           <div>
// //             <h3 className="font-bold text-slate-800 text-base leading-tight">{batch.name}</h3>
// //             <p className="text-xs text-blue-600 font-semibold mt-0.5">{batch.course}</p>
// //           </div>
// //           <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap shrink-0", sc.cls)}>
// //             {sc.label}
// //           </span>
// //         </div>
// //         {batch.description && (
// //           <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{batch.description}</p>
// //         )}
// //       </div>

// //       {/* Details */}
// //       <div className="p-5 flex-1 space-y-2.5">
// //         <Row icon={<Clock size={13}/>}    text={`${fmtTime(batch.timingStart)} – ${fmtTime(batch.timingEnd)}`}/>
// //         <Row icon={<Calendar size={13}/>} text={`${fmtDate(batch.startDate)} → ${fmtDate(batch.endDate)}`}/>
// //         <Row icon={<Layers size={13}/>}   text={batch.days.join(", ")}/>
// //         {batch.instructor && <Row icon={<User size={13}/>} text={batch.instructor}/>}

// //         <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border", typeColor(batch.batchType))}>
// //           {typeIcon(batch.batchType)} {batch.batchType}
// //         </span>

// //         {/* ── SEAT GRID ── */}
// //         <div className="pt-2 border-t border-slate-50">
// //           <SeatGrid total={batch.totalSeats} booked={batch.bookedSeats}/>
// //         </div>
// //       </div>

// //       {/* CTA */}
// //       <div className="px-5 pb-5">
// //         <button onClick={onBook} disabled={closed}
// //           className={cn(
// //             "w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
// //             closed
// //               ? "bg-slate-100 text-slate-400 cursor-not-allowed"
// //               : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95"
// //           )}>
// //           {closed
// //             ? (batch.status === "FULL" ? "Batch Full" : "Completed")
// //             : <><span>Book Seat</span><ArrowRight size={14}/></>}
// //         </button>
// //       </div>
// //     </motion.div>
// //   );
// // }

// // // ── Tiny helpers ───────────────────────────────────────────

// // function Row({ icon, text }: { icon: React.ReactNode; text: string }) {
// //   return (
// //     <div className="flex items-center gap-2 text-xs text-slate-500">
// //       <span className="text-slate-400 shrink-0">{icon}</span>
// //       <span className="leading-snug">{text}</span>
// //     </div>
// //   );
// // }

// // function MField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
// //   return (
// //     <div className="flex flex-col gap-1.5">
// //       <div className="flex justify-between items-center">
// //         <label className={cn("text-sm font-semibold", error ? "text-red-500" : "text-slate-600")}>{label}</label>
// //         {error && <span className="text-[10px] font-bold text-red-500 uppercase">{error}</span>}
// //       </div>
// //       {children}
// //     </div>
// //   );
// // }

// // function MInput({ icon, placeholder, value, onChange, type = "text", error }: {
// //   icon?: React.ReactNode; placeholder?: string; value: string;
// //   onChange: (v: string) => void; type?: string; error?: string;
// // }) {
// //   return (
// //     <div className="relative">
// //       {icon && <div className={cn("absolute left-3.5 top-1/2 -translate-y-1/2", error ? "text-red-400" : "text-slate-400")}>{icon}</div>}
// //       <input type={type} value={value} onChange={e => onChange(e.target.value)}
// //         placeholder={placeholder}
// //         className={cn(
// //           "w-full bg-slate-50 border rounded-xl py-3 px-4 text-sm outline-none transition-all focus:bg-white focus:ring-4",
// //           error ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-blue-100",
// //           icon && "pl-10"
// //         )}/>
// //     </div>
// //   );
// // }


// "use client";

// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "motion/react";
// import {
//   Calendar, Clock, Monitor, Building2, Blend,
//   CheckCircle2, X, Search, ArrowRight, BookOpen,
//   AlertCircle, User, Phone, Mail, GraduationCap,
//   Layers, ChevronRight,
// } from "lucide-react";
// import Header from "@/app/components/Header";
// import { clsx, type ClassValue } from "clsx";
// import { twMerge } from "tailwind-merge";

// function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

// // ── Types ──────────────────────────────────────────────────
// type BatchType   = "ONLINE" | "OFFLINE" | "HYBRID";
// type BatchStatus = "UPCOMING" | "ONGOING" | "FULL" | "COMPLETED";

// interface Batch {
//   id:          string;
//   name:        string;
//   course:      string;
//   batchType:   BatchType;
//   instructor?: string;
//   startDate:   string;
//   endDate:     string;
//   timingStart: string;
//   timingEnd:   string;
//   days:        string[];
//   totalSeats:  number;
//   bookedSeats: number;
//   status:      BatchStatus;
//   description?: string;
// }

// interface BookingForm {
//   fullName:   string;
//   whatsappNo: string;
//   email:      string;
//   college:    string;
// }
// type BookingErrors = Partial<Record<keyof BookingForm, string>>;

// const INIT_FORM: BookingForm = { fullName:"", whatsappNo:"", email:"", college:"" };

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

// const COURSES: string[]              = ["All", "Frontend Web Design", "Full Stack Development", "Data Analyst"];
// const TYPES:   (BatchType | "All")[] = ["All", "ONLINE", "OFFLINE", "HYBRID"];

// // ── Mock data ──────────────────────────────────────────────
// const MOCK: Batch[] = [
//   { id:"1", name:"Batch A – Morning",   course:"Frontend Web Design",   batchType:"ONLINE",  instructor:"Priya Sharma",  startDate:"2025-08-01", endDate:"2025-10-31", timingStart:"09:00", timingEnd:"11:00", days:["Mon","Wed","Fri"],             totalSeats:20, bookedSeats:13, status:"UPCOMING",  description:"HTML, CSS, Tailwind and React from scratch." },
//   { id:"2", name:"Batch B – Evening",   course:"Frontend Web Design",   batchType:"OFFLINE", instructor:"Ravi Verma",    startDate:"2025-08-05", endDate:"2025-11-05", timingStart:"17:00", timingEnd:"19:00", days:["Tue","Thu","Sat"],             totalSeats:15, bookedSeats:15, status:"FULL",      description:"In-person sessions at Jind campus." },
//   { id:"3", name:"Batch C – Weekend",   course:"Full Stack Development", batchType:"HYBRID",  instructor:"Ankit Goyal",   startDate:"2025-08-10", endDate:"2026-01-10", timingStart:"10:00", timingEnd:"14:00", days:["Sat","Sun"],                   totalSeats:20, bookedSeats:7,  status:"UPCOMING",  description:"Weekend intensive — online theory + offline practicals." },
//   { id:"4", name:"Batch D – Morning",   course:"Data Analyst",           batchType:"ONLINE",  instructor:"Sneha Patel",   startDate:"2025-09-01", endDate:"2025-11-30", timingStart:"08:00", timingEnd:"10:00", days:["Mon","Tue","Wed","Thu","Fri"], totalSeats:12, bookedSeats:3,  status:"UPCOMING",  description:"Python, Pandas, SQL and Power BI end-to-end." },
//   { id:"5", name:"Batch E – Afternoon", course:"Full Stack Development", batchType:"OFFLINE", instructor:"Mohit Jain",    startDate:"2025-07-15", endDate:"2025-12-15", timingStart:"14:00", timingEnd:"17:00", days:["Mon","Wed","Fri"],             totalSeats:18, bookedSeats:18, status:"ONGOING",   description:"Currently running. Node.js and React this month." },
//   { id:"6", name:"Batch F – Evening",   course:"Data Analyst",           batchType:"ONLINE",  instructor:"Kavya Reddy",   startDate:"2025-09-15", endDate:"2025-12-15", timingStart:"19:00", timingEnd:"21:00", days:["Mon","Wed","Fri"],             totalSeats:25, bookedSeats:4,  status:"UPCOMING",  description:"Excel, Power BI, Python for analytics." },
// ];

// // ── Status sort order ──────────────────────────────────────
// const STATUS_ORDER: Record<BatchStatus, number> = {
//   UPCOMING:  0,
//   ONGOING:   1,
//   FULL:      2,
//   COMPLETED: 3,
// };

// // ── Helpers ────────────────────────────────────────────────
// const typeIcon = (t: BatchType) =>
//   t === "ONLINE" ? <Monitor size={13}/> : t === "OFFLINE" ? <Building2 size={13}/> : <Blend size={13}/>;

// const typeColor = (t: BatchType) =>
//   t === "ONLINE"  ? "bg-blue-50 text-blue-700 border-blue-200" :
//   t === "OFFLINE" ? "bg-purple-50 text-purple-700 border-purple-200" :
//                     "bg-amber-50 text-amber-700 border-amber-200";

// const statusCfg = (s: BatchStatus) => ({
//   UPCOMING:  { label:"Upcoming",  cls:"bg-blue-50 text-blue-700"       },
//   ONGOING:   { label:"Ongoing",   cls:"bg-emerald-50 text-emerald-700" },
//   FULL:      { label:"Full",      cls:"bg-red-50 text-red-600"         },
//   COMPLETED: { label:"Completed", cls:"bg-slate-100 text-slate-500"    },
// }[s]);

// const fmtTime = (t: string) => {
//   const [h, m] = t.split(":").map(Number);
//   return `${h % 12 || 12}:${String(m).padStart(2,"0")} ${h >= 12 ? "PM" : "AM"}`;
// };

// const fmtDate = (d: string) =>
//   new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });

// const seatsLeft = (b: Batch) => b.totalSeats - b.bookedSeats;

// /** Validates Indian mobile: 10 digits starting with 6–9, optional +91 or 0 prefix */
// function isValidPhone(phone: string): boolean {
//   const cleaned = phone.replace(/[\s\-()+]/g, "");
//   const normalized =
//     cleaned.length === 12 && cleaned.startsWith("91") ? cleaned.slice(2) :
//     cleaned.startsWith("0") && cleaned.length === 11  ? cleaned.slice(1)  :
//     cleaned;
//   return /^[6-9]\d{9}$/.test(normalized);
// }

// // ── Seat Grid ──────────────────────────────────────────────
// function SeatGrid({ total, booked }: { total: number; booked: number }) {
//   const displayMax = 50;
//   const show       = Math.min(total, displayMax);
//   const hidden     = total - show;
//   const showBooked = Math.min(booked, show);

//   return (
//     <div className="space-y-2">
//       <div className="flex flex-wrap gap-1">
//         {Array.from({ length: show }).map((_, i) => {
//           const isBooked = i < showBooked;
//           return (
//             <div key={i}
//               title={isBooked ? `Seat ${i+1} – Booked` : `Seat ${i+1} – Available`}
//               className={cn(
//                 "w-6 h-6 rounded-md border-2 transition-all",
//                 isBooked ? "bg-emerald-500 border-emerald-500" : "bg-white border-slate-200"
//               )}
//             />
//           );
//         })}
//         {hidden > 0 && (
//           <div className="w-6 h-6 rounded-md border-2 border-dashed border-slate-300 bg-slate-50
//             flex items-center justify-center text-[8px] font-black text-slate-400">
//             +{hidden}
//           </div>
//         )}
//       </div>
//       <div className="flex items-center gap-3">
//         <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
//           <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"/>
//           {booked} booked
//         </span>
//         <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
//           <span className="w-2.5 h-2.5 rounded-sm border-2 border-slate-200 inline-block"/>
//           {total - booked} free
//         </span>
//       </div>
//     </div>
//   );
// }

// // ── Page ───────────────────────────────────────────────────
// export default function BatchesPage() {
//   const [batches,      setBatches]      = useState<Batch[]>(MOCK);
//   const [loading,      setLoading]      = useState(false);
//   const [courseFilter, setCourseFilter] = useState("All");
//   const [typeFilter,   setTypeFilter]   = useState<BatchType | "All">("All");
//   const [search,       setSearch]       = useState("");

//   // modal
//   const [active,      setActive]      = useState<Batch | null>(null);
//   const [form,        setForm]        = useState<BookingForm>(INIT_FORM);
//   const [errors,      setErrors]      = useState<BookingErrors>({});
//   const [submitting,  setSubmitting]  = useState(false);
//   const [submitError, setSubmitError] = useState("");
//   const [bookingId,   setBookingId]   = useState("");

//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       try {
//         const res  = await fetch("/api/batch");
//         const data = await res.json();
//         if (data.success) setBatches(data.batches);
//       } catch { /* keep mock */ }
//       finally { setLoading(false); }
//     })();
//   }, []);

//   // ── Filtered + Sorted ──────────────────────────────────
//   const filtered = batches
//     .filter(b => {
//       const mc = courseFilter === "All" || b.course === courseFilter;
//       const mt = typeFilter   === "All" || b.batchType === typeFilter;
//       const ms = [b.name, b.course, b.instructor ?? ""]
//         .join(" ").toLowerCase().includes(search.toLowerCase());
//       return mc && mt && ms;
//     })
//     .sort((a, b) => {
//       // 1. Status priority: UPCOMING → ONGOING → FULL → COMPLETED
//       const statusDiff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
//       if (statusDiff !== 0) return statusDiff;
//       // 2. Within same status, earliest startDate first
//       return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
//     });

//   const openModal = (batch: Batch) => {
//     if (batch.status === "FULL" || batch.status === "COMPLETED") return;
//     setActive(batch);
//     setForm(INIT_FORM);
//     setErrors({});
//     setSubmitError("");
//     setBookingId("");
//   };

//   const closeModal = () => { setActive(null); setBookingId(""); };

//   const upd = (f: keyof BookingForm, v: string) => {
//     setForm(p => ({ ...p, [f]: v }));
//     setErrors(p => { const n = { ...p }; delete n[f]; return n; });
//   };

//   const validate = () => {
//     const e: BookingErrors = {};
//     if (!form.fullName.trim())
//       e.fullName = "Required";

//     if (!form.whatsappNo.trim())
//       e.whatsappNo = "Required";
//     else if (!isValidPhone(form.whatsappNo))
//       e.whatsappNo = "Valid 10-digit Indian number (6–9)";

//     if (!form.email.trim())
//       e.email = "Required";
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
//       e.email = "Invalid email";

//     if (!form.college)
//       e.college = "Required";

//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleBook = async () => {
//     if (!validate() || !active) return;
//     setSubmitting(true);
//     setSubmitError("");
//     try {
//       const res  = await fetch("/api/bookseat", {
//         method:  "POST",
//         headers: { "Content-Type": "application/json" },
//         body:    JSON.stringify({ batchId: active.id, ...form }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         setBookingId(data.bookingId);
//         setBatches(prev => prev.map(b =>
//           b.id === active.id
//             ? { ...b, bookedSeats: b.bookedSeats + 1,
//                 status: b.bookedSeats + 1 >= b.totalSeats ? "FULL" : b.status }
//             : b
//         ));
//       } else {
//         setSubmitError(data.error || "Booking failed.");
//       }
//     } catch {
//       setSubmitError("Network error. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">

//       <Header
//         active="batches"
//         extraLinks={[{ key: "manageBatches", label: "Manage Batches", href: "/batch/manage" }]}
//       />

//       {/* Body */}
//       <div className="max-w-6xl mx-auto px-4 py-10">

//         <div className="text-center mb-10">
//           <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
//             Browse & Book a Batch
//           </h1>
//           <p className="text-slate-500">Pick a batch, fill your details, and your seat is reserved instantly.</p>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//           {[
//             { label:"Total Batches",   value: batches.length },
//             { label:"Open Batches",    value: batches.filter(b => b.status !== "FULL" && b.status !== "COMPLETED").length },
//             { label:"Total Seats",     value: batches.reduce((a,b) => a + b.totalSeats,  0) },
//             { label:"Seats Available", value: batches.reduce((a,b) => a + seatsLeft(b), 0) },
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
//             <div className="relative flex-1">
//               <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
//               <input type="text" placeholder="Search batch, course or instructor…"
//                 value={search} onChange={e => setSearch(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50
//                   focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition"/>
//             </div>
//             <div className="flex gap-2 flex-wrap">
//               {COURSES.map(c => (
//                 <button key={c} onClick={() => setCourseFilter(c)}
//                   className={cn("px-3.5 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap",
//                     courseFilter === c
//                       ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200"
//                       : "bg-white border-slate-200 text-slate-500 hover:border-slate-300")}>
//                   {c}
//                 </button>
//               ))}
//             </div>
//             <div className="flex gap-2">
//               {TYPES.map(t => (
//                 <button key={t} onClick={() => setTypeFilter(t)}
//                   className={cn("px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1",
//                     typeFilter === t
//                       ? "bg-slate-900 border-slate-900 text-white"
//                       : "bg-white border-slate-200 text-slate-500 hover:border-slate-300")}>
//                   {t !== "All" && typeIcon(t as BatchType)}
//                   {t}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Grid */}
//         {loading ? (
//           <div className="text-center py-20 text-slate-400 font-semibold">Loading batches…</div>
//         ) : filtered.length === 0 ? (
//           <div className="text-center py-20 text-slate-400">
//             <BookOpen size={48} className="mx-auto mb-3 opacity-30"/>
//             <p className="font-semibold">No batches match your filters.</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
//             {filtered.map((batch, i) => (
//               <BatchCard key={batch.id} batch={batch} index={i} onBook={() => openModal(batch)}/>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Booking Modal */}
//       <AnimatePresence>
//         {active && (
//           <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
//             <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
//               onClick={closeModal}
//               className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm"/>
//             <motion.div
//               initial={{ opacity:0, scale:0.94, y:24 }}
//               animate={{ opacity:1, scale:1, y:0 }}
//               exit={{ opacity:0, scale:0.96, y:16 }}
//               className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-8">

//               {bookingId ? (
//                 /* ── Success ── */
//                 <>
//                   <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center relative overflow-hidden">
//                     <div className="absolute inset-0 opacity-10"
//                       style={{ backgroundImage:"radial-gradient(circle at 20% 50%, white 1px, transparent 1px)", backgroundSize:"28px 28px" }}/>
//                     <div className="relative">
//                       <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                         <CheckCircle2 size={34} className="text-white"/>
//                       </div>
//                       <h2 className="text-2xl font-extrabold mb-1">Seat Booked!</h2>
//                       <p className="text-blue-100 text-sm">You're in — your seat is confirmed.</p>
//                     </div>
//                   </div>
//                   <div className="mx-6 -mt-4 relative z-10">
//                     <div className="bg-white rounded-2xl border-2 border-blue-600 shadow-xl shadow-blue-100 p-4 text-center">
//                       <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Booking ID</p>
//                       <p className="text-xl font-black text-blue-600 tracking-widest break-all">{bookingId}</p>
//                       <p className="text-xs text-slate-400 mt-1">Save this for future reference</p>
//                     </div>
//                   </div>
//                   <div className="p-6 space-y-4 mt-2">
//                     <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
//                       <p className="text-xs font-black uppercase tracking-wider text-slate-400">Batch Details</p>
//                       <div className="grid grid-cols-2 gap-2">
//                         {[
//                           { label:"Batch",  value: active.name },
//                           { label:"Course", value: active.course },
//                           { label:"Timing", value: `${fmtTime(active.timingStart)} – ${fmtTime(active.timingEnd)}` },
//                           { label:"Days",   value: active.days.join(", ") },
//                           { label:"Mode",   value: active.batchType },
//                           { label:"Starts", value: fmtDate(active.startDate) },
//                         ].map(r => (
//                           <div key={r.label} className="bg-white rounded-xl p-2.5">
//                             <p className="text-[10px] font-bold text-slate-400 uppercase">{r.label}</p>
//                             <p className="text-xs font-semibold text-slate-800 mt-0.5">{r.value}</p>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                     <div className="flex gap-3">
//                       <button onClick={closeModal}
//                         className="flex-1 py-3 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 text-sm transition">
//                         Close
//                       </button>
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 /* ── Form ── */
//                 <>
//                   <div className="flex items-start justify-between p-6 border-b border-slate-100">
//                     <div>
//                       <h2 className="text-xl font-bold text-slate-800">Book Your Seat</h2>
//                       <p className="text-sm text-slate-400 mt-0.5">{active.name} · {active.course}</p>
//                     </div>
//                     <button onClick={closeModal}
//                       className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-400 shrink-0">
//                       <X size={20}/>
//                     </button>
//                   </div>

//                   {/* Seat grid */}
//                   <div className="mx-6 mt-5 bg-slate-50 border border-slate-100 rounded-2xl p-4">
//                     <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Seat Availability</p>
//                     <SeatGrid total={active.totalSeats} booked={active.bookedSeats}/>
//                   </div>

//                   {/* Batch info strip */}
//                   <div className="mx-6 mt-3 bg-blue-50 border border-blue-100 rounded-2xl p-3.5">
//                     <div className="flex flex-wrap gap-x-5 gap-y-1.5">
//                       {[
//                         { icon:<Clock size={13}/>,         text:`${fmtTime(active.timingStart)} – ${fmtTime(active.timingEnd)}` },
//                         { icon:<Layers size={13}/>,        text:active.days.join(", ") },
//                         { icon:<Calendar size={13}/>,      text:fmtDate(active.startDate) },
//                         { icon:typeIcon(active.batchType), text:active.batchType },
//                       ].map((r, i) => (
//                         <div key={i} className="flex items-center gap-1.5 text-xs font-semibold text-blue-700">
//                           <span className="opacity-70">{r.icon}</span>{r.text}
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="p-6 space-y-4">
//                     <p className="text-xs font-black uppercase tracking-wider text-slate-400">Your Details</p>

//                     <MField label="Full Name" error={errors.fullName}>
//                       <MInput icon={<User size={15}/>} placeholder="e.g. Rahul Kumar"
//                         value={form.fullName} onChange={v => upd("fullName", v)} error={errors.fullName}/>
//                     </MField>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <MField label="WhatsApp Number" error={errors.whatsappNo}>
//                         <MInput icon={<Phone size={15}/>} placeholder="10-digit mobile no." type="tel"
//                           value={form.whatsappNo} onChange={v => upd("whatsappNo", v)} error={errors.whatsappNo}/>
//                         {!errors.whatsappNo && (
//                           <p className="text-[10px] text-slate-400 pl-1 -mt-0.5">
//                             Indian number starting with 6–9
//                           </p>
//                         )}
//                       </MField>
//                       <MField label="Email" error={errors.email}>
//                         <MInput icon={<Mail size={15}/>} placeholder="you@example.com" type="email"
//                           value={form.email} onChange={v => upd("email", v)} error={errors.email}/>
//                       </MField>
//                     </div>

//                     <MField label="College / Institute" error={errors.college}>
//                       <div className="relative">
//                         <GraduationCap size={15} className={cn("absolute left-3.5 top-1/2 -translate-y-1/2 z-10",
//                           errors.college ? "text-red-400" : "text-slate-400")}/>
//                         <select value={form.college} onChange={e => upd("college", e.target.value)}
//                           className={cn(
//                             "w-full pl-10 pr-4 py-3 border rounded-xl text-sm bg-slate-50 outline-none transition-all appearance-none focus:bg-white focus:ring-4",
//                             errors.college
//                               ? "border-red-400 focus:ring-red-100"
//                               : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
//                           )}>
//                           <option value="" disabled>Select your college</option>
//                           {COLLEGES.map(c => <option key={c} value={c}>{c}</option>)}
//                         </select>
//                         <ChevronRight size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none"/>
//                       </div>
//                     </MField>

//                     <AnimatePresence>
//                       {submitError && (
//                         <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
//                           className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
//                           <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5"/>
//                           <div className="flex-1">
//                             <p className="text-sm font-bold text-red-700 mb-0.5">Booking Failed</p>
//                             <p className="text-xs text-red-600">{submitError}</p>
//                           </div>
//                           <button onClick={() => setSubmitError("")} className="text-red-300 hover:text-red-500"><X size={15}/></button>
//                         </motion.div>
//                       )}
//                     </AnimatePresence>

//                     <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-2.5 items-start">
//                       <span className="text-amber-500 mt-0.5">⚠️</span>
//                       <p className="text-xs text-amber-800 leading-relaxed">
//                         One email address can book only one seat per batch. Seats are first-come, first-served.
//                       </p>
//                     </div>

//                     <div className="flex gap-3 pt-1">
//                       <button onClick={closeModal}
//                         className="flex-1 py-3 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 text-sm transition">
//                         Cancel
//                       </button>
//                       <button disabled={submitting} onClick={handleBook}
//                         className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl
//                           font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-60 text-sm">
//                         {submitting ? "Booking…" : <><span>Confirm Booking</span><ArrowRight size={15}/></>}
//                       </button>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// // ── Batch Card ─────────────────────────────────────────────
// function BatchCard({ batch, index, onBook }: { batch: Batch; index: number; onBook: () => void }) {
//   const closed = batch.status === "FULL" || batch.status === "COMPLETED";
//   const sc     = statusCfg(batch.status);

//   return (
//     <motion.div
//       initial={{ opacity:0, y:20 }}
//       animate={{ opacity:1, y:0 }}
//       transition={{ delay: index * 0.055, duration:0.3 }}
//       className={cn(
//         "bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col transition-shadow hover:shadow-md",
//         closed && "opacity-70"
//       )}
//     >
//       {/* Top */}
//       <div className="p-5 pb-4 border-b border-slate-50">
//         <div className="flex items-start justify-between gap-3 mb-2">
//           <div>
//             <h3 className="font-bold text-slate-800 text-base leading-tight">{batch.name}</h3>
//             <p className="text-xs text-blue-600 font-semibold mt-0.5">{batch.course}</p>
//           </div>
//           <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap shrink-0", sc.cls)}>
//             {sc.label}
//           </span>
//         </div>
//         {batch.description && (
//           <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{batch.description}</p>
//         )}
//       </div>

//       {/* Details */}
//       <div className="p-5 flex-1 space-y-2.5">
//         <Row icon={<Clock size={13}/>} text={`${fmtTime(batch.timingStart)} – ${fmtTime(batch.timingEnd)}`}/>

//         {/* ── Bold dates ── */}
//         <div className="flex items-center gap-2 text-xs text-slate-500">
//           <span className="text-slate-400 shrink-0"><Calendar size={13}/></span>
//           <span>
//             <strong className="font-bold text-slate-700">{fmtDate(batch.startDate)}</strong>
//             <span className="mx-1 text-slate-300">→</span>
//             <strong className="font-bold text-slate-700">{fmtDate(batch.endDate)}</strong>
//           </span>
//         </div>

//         <Row icon={<Layers size={13}/>} text={batch.days.join(", ")}/>
//         {batch.instructor && <Row icon={<User size={13}/>} text={batch.instructor}/>}

//         <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border", typeColor(batch.batchType))}>
//           {typeIcon(batch.batchType)} {batch.batchType}
//         </span>

//         {/* Seat grid */}
//         <div className="pt-2 border-t border-slate-50">
//           <SeatGrid total={batch.totalSeats} booked={batch.bookedSeats}/>
//         </div>
//       </div>

//       {/* CTA */}
//       <div className="px-5 pb-5">
//         <button onClick={onBook} disabled={closed}
//           className={cn(
//             "w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
//             closed
//               ? "bg-slate-100 text-slate-400 cursor-not-allowed"
//               : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95"
//           )}>
//           {closed
//             ? (batch.status === "FULL" ? "Batch Full" : "Completed")
//             : <><span>Book Seat</span><ArrowRight size={14}/></>}
//         </button>
//       </div>
//     </motion.div>
//   );
// }

// // ── Tiny helpers ───────────────────────────────────────────
// function Row({ icon, text }: { icon: React.ReactNode; text: string }) {
//   return (
//     <div className="flex items-center gap-2 text-xs text-slate-500">
//       <span className="text-slate-400 shrink-0">{icon}</span>
//       <span className="leading-snug">{text}</span>
//     </div>
//   );
// }

// function MField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
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

// function MInput({ icon, placeholder, value, onChange, type = "text", error }: {
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
//       <input type={type} value={value} onChange={e => onChange(e.target.value)}
//         placeholder={placeholder}
//         className={cn(
//           "w-full bg-slate-50 border rounded-xl py-3 px-4 text-sm outline-none transition-all focus:bg-white focus:ring-4",
//           error ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-blue-100",
//           icon && "pl-10"
//         )}/>
//     </div>
//   );
// }



"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar, Clock, Monitor, Building2, Blend,
  CheckCircle2, X, Search, ArrowRight, BookOpen,
  AlertCircle, User, Phone, Mail, GraduationCap,
  Layers, ChevronRight,
} from "lucide-react";
import Header from "@/app/components/Header";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

// ── Types ──────────────────────────────────────────────────
type BatchType   = "ONLINE" | "OFFLINE" | "HYBRID";
type BatchStatus = "UPCOMING" | "ONGOING" | "FULL" | "COMPLETED";

interface Batch {
  id:          string;
  name:        string;
  course:      string;
  batchType:   BatchType;
  instructor?: string;
  startDate:   string;
  endDate:     string;
  timingStart: string;
  timingEnd:   string;
  days:        string[];
  totalSeats:  number;
  bookedSeats: number;
  status:      BatchStatus;
  description?: string;
}

interface BookingForm {
  fullName:   string;
  whatsappNo: string;
  email:      string;
  college:    string;
}
type BookingErrors = Partial<Record<keyof BookingForm, string>>;

const INIT_FORM: BookingForm = { fullName:"", whatsappNo:"", email:"", college:"" };

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

const COURSES: string[]              = ["All", "Frontend Web Design", "Full Stack Development", "Data Analyst"];
const TYPES:   (BatchType | "All")[] = ["All", "ONLINE", "OFFLINE", "HYBRID"];

// ── Mock data ──────────────────────────────────────────────
const MOCK: Batch[] = [
  { id:"1", name:"Batch A – Morning",   course:"Frontend Web Design",   batchType:"ONLINE",  instructor:"Priya Sharma",  startDate:"2025-08-01", endDate:"2025-10-31", timingStart:"09:00", timingEnd:"11:00", days:["Mon","Wed","Fri"],             totalSeats:20, bookedSeats:13, status:"UPCOMING",  description:"HTML, CSS, Tailwind and React from scratch." },
  { id:"2", name:"Batch B – Evening",   course:"Frontend Web Design",   batchType:"OFFLINE", instructor:"Ravi Verma",    startDate:"2025-08-05", endDate:"2025-11-05", timingStart:"17:00", timingEnd:"19:00", days:["Tue","Thu","Sat"],             totalSeats:15, bookedSeats:15, status:"FULL",      description:"In-person sessions at Jind campus." },
  { id:"3", name:"Batch C – Weekend",   course:"Full Stack Development", batchType:"HYBRID",  instructor:"Ankit Goyal",   startDate:"2025-08-10", endDate:"2026-01-10", timingStart:"10:00", timingEnd:"14:00", days:["Sat","Sun"],                   totalSeats:20, bookedSeats:7,  status:"UPCOMING",  description:"Weekend intensive — online theory + offline practicals." },
  { id:"4", name:"Batch D – Morning",   course:"Data Analyst",           batchType:"ONLINE",  instructor:"Sneha Patel",   startDate:"2025-09-01", endDate:"2025-11-30", timingStart:"08:00", timingEnd:"10:00", days:["Mon","Tue","Wed","Thu","Fri"], totalSeats:12, bookedSeats:3,  status:"UPCOMING",  description:"Python, Pandas, SQL and Power BI end-to-end." },
  { id:"5", name:"Batch E – Afternoon", course:"Full Stack Development", batchType:"OFFLINE", instructor:"Mohit Jain",    startDate:"2025-07-15", endDate:"2025-12-15", timingStart:"14:00", timingEnd:"17:00", days:["Mon","Wed","Fri"],             totalSeats:18, bookedSeats:18, status:"ONGOING",   description:"Currently running. Node.js and React this month." },
  { id:"6", name:"Batch F – Evening",   course:"Data Analyst",           batchType:"ONLINE",  instructor:"Kavya Reddy",   startDate:"2025-09-15", endDate:"2025-12-15", timingStart:"19:00", timingEnd:"21:00", days:["Mon","Wed","Fri"],             totalSeats:25, bookedSeats:4,  status:"UPCOMING",  description:"Excel, Power BI, Python for analytics." },
];

// ── Status sort order ──────────────────────────────────────
const STATUS_ORDER: Record<BatchStatus, number> = {
  UPCOMING:  0,
  ONGOING:   1,
  FULL:      2,
  COMPLETED: 3,
};

// ── Helpers ────────────────────────────────────────────────
const typeIcon = (t: BatchType) =>
  t === "ONLINE" ? <Monitor size={13}/> : t === "OFFLINE" ? <Building2 size={13}/> : <Blend size={13}/>;

const typeColor = (t: BatchType) =>
  t === "ONLINE"  ? "bg-blue-50 text-blue-700 border-blue-200" :
  t === "OFFLINE" ? "bg-purple-50 text-purple-700 border-purple-200" :
                    "bg-amber-50 text-amber-700 border-amber-200";

const statusCfg = (s: BatchStatus) => ({
  UPCOMING:  { label:"Upcoming",  cls:"bg-blue-50 text-blue-700"       },
  ONGOING:   { label:"Ongoing",   cls:"bg-emerald-50 text-emerald-700" },
  FULL:      { label:"Full",      cls:"bg-red-50 text-red-600"         },
  COMPLETED: { label:"Completed", cls:"bg-slate-100 text-slate-500"    },
}[s]);

const fmtTime = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2,"0")} ${h >= 12 ? "PM" : "AM"}`;
};

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });

const seatsLeft = (b: Batch) => b.totalSeats - b.bookedSeats;

/** Validates Indian mobile: 10 digits starting with 6–9, optional +91 or 0 prefix */
function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()+]/g, "");
  const normalized =
    cleaned.length === 12 && cleaned.startsWith("91") ? cleaned.slice(2) :
    cleaned.startsWith("0") && cleaned.length === 11  ? cleaned.slice(1)  :
    cleaned;
  return /^[6-9]\d{9}$/.test(normalized);
}

// ── Seat Grid ──────────────────────────────────────────────
function SeatGrid({ total, booked }: { total: number; booked: number }) {
  const displayMax = 50;
  const show       = Math.min(total, displayMax);
  const hidden     = total - show;
  const showBooked = Math.min(booked, show);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: show }).map((_, i) => {
          const isBooked = i < showBooked;
          return (
            <div key={i}
              title={isBooked ? `Seat ${i+1} – Booked` : `Seat ${i+1} – Available`}
              className={cn(
                "w-6 h-6 rounded-md border-2 transition-all",
                isBooked ? "bg-emerald-500 border-emerald-500" : "bg-white border-slate-200"
              )}
            />
          );
        })}
        {hidden > 0 && (
          <div className="w-6 h-6 rounded-md border-2 border-dashed border-slate-300 bg-slate-50
            flex items-center justify-center text-[8px] font-black text-slate-400">
            +{hidden}
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"/>
          {booked} booked
        </span>
        <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
          <span className="w-2.5 h-2.5 rounded-sm border-2 border-slate-200 inline-block"/>
          {total - booked} free
        </span>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────
export default function BatchesPage() {
  const [batches,      setBatches]      = useState<Batch[]>(MOCK);
  const [loading,      setLoading]      = useState(false);
  const [courseFilter, setCourseFilter] = useState("All");
  const [typeFilter,   setTypeFilter]   = useState<BatchType | "All">("All");
  const [search,       setSearch]       = useState("");

  // modal
  const [active,      setActive]      = useState<Batch | null>(null);
  const [form,        setForm]        = useState<BookingForm>(INIT_FORM);
  const [errors,      setErrors]      = useState<BookingErrors>({});
  const [submitting,  setSubmitting]  = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [bookingId,   setBookingId]   = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res  = await fetch("/api/batch");
        const data = await res.json();
        if (data.success) setBatches(data.batches);
      } catch { /* keep mock */ }
      finally { setLoading(false); }
    })();
  }, []);

  // ── Filtered + Sorted ──────────────────────────────────
  const filtered = batches
    .filter(b => {
      const mc = courseFilter === "All" || b.course === courseFilter;
      const mt = typeFilter   === "All" || b.batchType === typeFilter;
      const ms = [b.name, b.course, b.instructor ?? ""]
        .join(" ").toLowerCase().includes(search.toLowerCase());
      return mc && mt && ms;
    })
    .sort((a, b) => {
      // 1. Status: UPCOMING → ONGOING → FULL → COMPLETED
      const statusDiff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      if (statusDiff !== 0) return statusDiff;

      // 2. Date: earliest first (Jun 8 → Jun 15 → …)
      const dateDiff = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      if (dateDiff !== 0) return dateDiff;

      // 3. Time: morning first (08:00 → 09:00 → 17:00)
      const timeDiff = a.timingStart.localeCompare(b.timingStart);
      if (timeDiff !== 0) return timeDiff;

      // 4. Course name A→Z (Data Analyst → Full Stack Development → …)
      return a.course.localeCompare(b.course);
    });

  const openModal = (batch: Batch) => {
    if (batch.status === "FULL" || batch.status === "COMPLETED") return;
    setActive(batch);
    setForm(INIT_FORM);
    setErrors({});
    setSubmitError("");
    setBookingId("");
  };

  const closeModal = () => { setActive(null); setBookingId(""); };

  const upd = (f: keyof BookingForm, v: string) => {
    setForm(p => ({ ...p, [f]: v }));
    setErrors(p => { const n = { ...p }; delete n[f]; return n; });
  };

  const validate = () => {
    const e: BookingErrors = {};
    if (!form.fullName.trim())
      e.fullName = "Required";

    if (!form.whatsappNo.trim())
      e.whatsappNo = "Required";
    else if (!isValidPhone(form.whatsappNo))
      e.whatsappNo = "Valid 10-digit Indian number (6–9)";

    if (!form.email.trim())
      e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email";

    if (!form.college)
      e.college = "Required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleBook = async () => {
    if (!validate() || !active) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res  = await fetch("/api/bookseat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ batchId: active.id, ...form }),
      });
      const data = await res.json();
      if (data.success) {
        setBookingId(data.bookingId);
        setBatches(prev => prev.map(b =>
          b.id === active.id
            ? { ...b, bookedSeats: b.bookedSeats + 1,
                status: b.bookedSeats + 1 >= b.totalSeats ? "FULL" : b.status }
            : b
        ));
      } else {
        setSubmitError(data.error || "Booking failed.");
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">

      <Header/>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 py-10">

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Browse & Book a Batch
          </h1>
          <p className="text-slate-500">Pick a batch, fill your details, and your seat is reserved instantly.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label:"Total Batches",   value: batches.length },
            { label:"Open Batches",    value: batches.filter(b => b.status !== "FULL" && b.status !== "COMPLETED").length },
            { label:"Total Seats",     value: batches.reduce((a,b) => a + b.totalSeats,  0) },
            { label:"Seats Available", value: batches.reduce((a,b) => a + seatsLeft(b), 0) },
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
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
              <input type="text" placeholder="Search batch, course or instructor…"
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50
                  focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition"/>
            </div>
            <div className="flex gap-2 flex-wrap">
              {COURSES.map(c => (
                <button key={c} onClick={() => setCourseFilter(c)}
                  className={cn("px-3.5 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap",
                    courseFilter === c
                      ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200"
                      : "bg-white border-slate-200 text-slate-500 hover:border-slate-300")}>
                  {c}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {TYPES.map(t => (
                <button key={t} onClick={() => setTypeFilter(t)}
                  className={cn("px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1",
                    typeFilter === t
                      ? "bg-slate-900 border-slate-900 text-white"
                      : "bg-white border-slate-200 text-slate-500 hover:border-slate-300")}>
                  {t !== "All" && typeIcon(t as BatchType)}
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-400 font-semibold">Loading batches…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <BookOpen size={48} className="mx-auto mb-3 opacity-30"/>
            <p className="font-semibold">No batches match your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((batch, i) => (
              <BatchCard key={batch.id} batch={batch} index={i} onBook={() => openModal(batch)}/>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm"/>
            <motion.div
              initial={{ opacity:0, scale:0.94, y:24 }}
              animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.96, y:16 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-8">

              {bookingId ? (
                /* ── Success ── */
                <>
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10"
                      style={{ backgroundImage:"radial-gradient(circle at 20% 50%, white 1px, transparent 1px)", backgroundSize:"28px 28px" }}/>
                    <div className="relative">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={34} className="text-white"/>
                      </div>
                      <h2 className="text-2xl font-extrabold mb-1">Seat Booked!</h2>
                      <p className="text-blue-100 text-sm">You're in — your seat is confirmed.</p>
                    </div>
                  </div>
                  <div className="mx-6 -mt-4 relative z-10">
                    <div className="bg-white rounded-2xl border-2 border-blue-600 shadow-xl shadow-blue-100 p-4 text-center">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Booking ID</p>
                      <p className="text-xl font-black text-blue-600 tracking-widest break-all">{bookingId}</p>
                      <p className="text-xs text-slate-400 mt-1">Save this for future reference</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-4 mt-2">
                    <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                      <p className="text-xs font-black uppercase tracking-wider text-slate-400">Batch Details</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label:"Batch",  value: active.name },
                          { label:"Course", value: active.course },
                          { label:"Timing", value: `${fmtTime(active.timingStart)} – ${fmtTime(active.timingEnd)}` },
                          { label:"Days",   value: active.days.join(", ") },
                          { label:"Mode",   value: active.batchType },
                          { label:"Starts", value: fmtDate(active.startDate) },
                        ].map(r => (
                          <div key={r.label} className="bg-white rounded-xl p-2.5">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">{r.label}</p>
                            <p className="text-xs font-semibold text-slate-800 mt-0.5">{r.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={closeModal}
                        className="flex-1 py-3 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 text-sm transition">
                        Close
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* ── Form ── */
                <>
                  <div className="flex items-start justify-between p-6 border-b border-slate-100">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">Book Your Seat</h2>
                      <p className="text-sm text-slate-400 mt-0.5">{active.name} · {active.course}</p>
                    </div>
                    <button onClick={closeModal}
                      className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-400 shrink-0">
                      <X size={20}/>
                    </button>
                  </div>

                  {/* Seat grid */}
                  <div className="mx-6 mt-5 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Seat Availability</p>
                    <SeatGrid total={active.totalSeats} booked={active.bookedSeats}/>
                  </div>

                  {/* Batch info strip */}
                  <div className="mx-6 mt-3 bg-blue-50 border border-blue-100 rounded-2xl p-3.5">
                    <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                      {[
                        { icon:<Clock size={13}/>,         text:`${fmtTime(active.timingStart)} – ${fmtTime(active.timingEnd)}` },
                        { icon:<Layers size={13}/>,        text:active.days.join(", ") },
                        { icon:<Calendar size={13}/>,      text:fmtDate(active.startDate) },
                        { icon:typeIcon(active.batchType), text:active.batchType },
                      ].map((r, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                          <span className="opacity-70">{r.icon}</span>{r.text}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-400">Your Details</p>

                    <MField label="Full Name" error={errors.fullName}>
                      <MInput icon={<User size={15}/>} placeholder="e.g. Rahul Kumar"
                        value={form.fullName} onChange={v => upd("fullName", v)} error={errors.fullName}/>
                    </MField>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <MField label="WhatsApp Number" error={errors.whatsappNo}>
                        <MInput icon={<Phone size={15}/>} placeholder="10-digit mobile no." type="tel"
                          value={form.whatsappNo} onChange={v => upd("whatsappNo", v)} error={errors.whatsappNo}/>
                        {!errors.whatsappNo && (
                          <p className="text-[10px] text-slate-400 pl-1 -mt-0.5">
                            Indian number starting with 6–9
                          </p>
                        )}
                      </MField>
                      <MField label="Email" error={errors.email}>
                        <MInput icon={<Mail size={15}/>} placeholder="you@example.com" type="email"
                          value={form.email} onChange={v => upd("email", v)} error={errors.email}/>
                      </MField>
                    </div>

                    <MField label="College / Institute" error={errors.college}>
                      <div className="relative">
                        <GraduationCap size={15} className={cn("absolute left-3.5 top-1/2 -translate-y-1/2 z-10",
                          errors.college ? "text-red-400" : "text-slate-400")}/>
                        <select value={form.college} onChange={e => upd("college", e.target.value)}
                          className={cn(
                            "w-full pl-10 pr-4 py-3 border rounded-xl text-sm bg-slate-50 outline-none transition-all appearance-none focus:bg-white focus:ring-4",
                            errors.college
                              ? "border-red-400 focus:ring-red-100"
                              : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                          )}>
                          <option value="" disabled>Select your college</option>
                          {COLLEGES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronRight size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none"/>
                      </div>
                    </MField>

                    <AnimatePresence>
                      {submitError && (
                        <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                          className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
                          <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5"/>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-red-700 mb-0.5">Booking Failed</p>
                            <p className="text-xs text-red-600">{submitError}</p>
                          </div>
                          <button onClick={() => setSubmitError("")} className="text-red-300 hover:text-red-500"><X size={15}/></button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-2.5 items-start">
                      <span className="text-amber-500 mt-0.5">⚠️</span>
                      <p className="text-xs text-amber-800 leading-relaxed">
                        One email address can book only one seat per batch, and one WhatsApp number can have only one booking. For booking help, contact 9588161422.
                      </p>
                    </div>

                    <div className="flex gap-3 pt-1">
                      <button onClick={closeModal}
                        className="flex-1 py-3 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 text-sm transition">
                        Cancel
                      </button>
                      <button disabled={submitting} onClick={handleBook}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl
                          font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-60 text-sm">
                        {submitting ? "Booking…" : <><span>Confirm Booking</span><ArrowRight size={15}/></>}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Batch Card ─────────────────────────────────────────────
function BatchCard({ batch, index, onBook }: { batch: Batch; index: number; onBook: () => void }) {
  const closed = batch.status === "FULL" || batch.status === "COMPLETED";
  const sc     = statusCfg(batch.status);

  return (
    <motion.div
      initial={{ opacity:0, y:20 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay: index * 0.055, duration:0.3 }}
      className={cn(
        "bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col transition-shadow hover:shadow-md",
        closed && "opacity-70"
      )}
    >
      {/* Top */}
      <div className="p-5 pb-4 border-b border-slate-50">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h3 className="font-bold text-slate-800 text-base leading-tight">{batch.name}</h3>
            <p className="text-xs text-blue-600 font-semibold mt-0.5">{batch.course}</p>
          </div>
          <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap shrink-0", sc.cls)}>
            {sc.label}
          </span>
        </div>
        {batch.description && (
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{batch.description}</p>
        )}
      </div>

      {/* Details */}
      <div className="p-5 flex-1 space-y-2.5">
        <Row icon={<Clock size={13}/>} text={`${fmtTime(batch.timingStart)} – ${fmtTime(batch.timingEnd)}`}/>

        {/* ── Bold dates ── */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="text-slate-400 shrink-0"><Calendar size={13}/></span>
          <span>
            <strong className="font-bold text-slate-700">{fmtDate(batch.startDate)}</strong>
            <span className="mx-1 text-slate-300">→</span>
            <strong className="font-bold text-slate-700">{fmtDate(batch.endDate)}</strong>
          </span>
        </div>

        <Row icon={<Layers size={13}/>} text={batch.days.join(", ")}/>
        {batch.instructor && <Row icon={<User size={13}/>} text={batch.instructor}/>}

        <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border", typeColor(batch.batchType))}>
          {typeIcon(batch.batchType)} {batch.batchType}
        </span>

        {/* Seat grid */}
        <div className="pt-2 border-t border-slate-50">
          <SeatGrid total={batch.totalSeats} booked={batch.bookedSeats}/>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 pb-5">
        <button onClick={onBook} disabled={closed}
          className={cn(
            "w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
            closed
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95"
          )}>
          {closed
            ? (batch.status === "FULL" ? "Batch Full" : "Completed")
            : <><span>Book Seat</span><ArrowRight size={14}/></>}
        </button>
        {batch.status === "FULL" && (
          <div className="mt-3 flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
            <AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5"/>
            <p className="text-xs text-red-700 leading-relaxed">
              Batch is full. Please contact admin —{" "}
              <a href="tel:+919588161422"
                className="font-bold text-red-600 hover:underline whitespace-nowrap">
                +91 95881 61422
              </a>
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Tiny helpers ───────────────────────────────────────────
function Row({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-500">
      <span className="text-slate-400 shrink-0">{icon}</span>
      <span className="leading-snug">{text}</span>
    </div>
  );
}

function MField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
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

function MInput({ icon, placeholder, value, onChange, type = "text", error }: {
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
