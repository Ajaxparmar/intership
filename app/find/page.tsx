"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, Hash, Building2, CheckCircle2,
  AlertCircle, X, Menu, GraduationCap, User,
  CreditCard, Phone, Mail, BookOpen, MapPin
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const LOGO_URL = "https://www.codescaler.com/logo.png";

const COLLEGES = [
  { label: "Hindu Kanya Mahavidyalaya, Jind", value: "Hindu Kanya Mahavidyalaya Jind" },
  { label: "Govt. PG College, Jind", value: "Govt PG College Jind" },
  { label: "Govt. PIG College, Jind", value: "Govt PIG College Jind" },
  { label: "CRSU, Jind", value: "CRSU Jind" },
  { label: "JIET", value: "JIET" },
  { label: "GJU Hisar", value: "GJU Hisar" },
  { label: "Govt. College Uchana", value: "Govt College Uchana" },
];

interface StudentResult {
  fullName: string;
  registrationNo: string;
  college: string;
  academicClass: string;
  semester: string;
  course: string;
  rollNo: string;
  email: string;
  whatsappNo: string;
  gender: string;
  dob: string;
  fatherName: string;
  createdAt: string;
}

export default function FindRegistrationPage() {
  const [rollNo, setRollNo] = useState("");
  const [college, setCollege] = useState("");
  const [academicClass, setAcademicClass] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StudentResult | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = async () => {
    if (!rollNo.trim()) { setError("Please enter your Roll Number."); return; }
    if (!college) { setError("Please select your College."); return; }
    if (!academicClass) { setError("Please select your Class."); return; }

    setLoading(true);
    setError("");
    setResult(null);
    setSearched(false);

    try {
      const params = new URLSearchParams({ rollNo: rollNo.trim(), college, academicClass });
      const res = await fetch(`/api/find?${params}`);
      const data = await res.json();

      if (data.success && data.student) {
        setResult(data.student);
        setShowModal(true);
      } else {
        setError(data.error || "No record found for this Roll Number and College.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const reset = () => {
    setRollNo("");
    setCollege("");
    setAcademicClass("");
    setResult(null);
    setError("");
    setSearched(false);
    setShowModal(false);
  };

  const collegeLabel = COLLEGES.find(c => c.value === result?.college)?.label || result?.college;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-blue-50/20 to-indigo-50/30">

      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg flex items-center justify-center text-white font-bold text-xl">
              <img src={LOGO_URL} alt="CodeScaler Logo" className="w-20 h-20 object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
            <a href="https://www.codescaler.com/">
              <span className="font-bold text-2xl tracking-tight text-neutral-800">CodeScaler</span>
            </a>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-neutral-500 font-medium">
            <a href="/" className="hover:text-blue-600 transition-colors">Roadmap</a>
            <a href="/" className="hover:text-blue-600 transition-colors font-bold text-blue-600">Internship</a>
            <a href="/CodeScaler_Industrial_Training_Curriculum.pdf"
              download className="hover:text-blue-600 transition-colors">Download</a>
                 <a href="/admission" className="hover:text-blue-600 transition-colors ">Admission</a>
            <a href="/find" className="hover:text-blue-600 transition-colors ">Find Registation</a>
            <a href="/contact"
              className="px-5 py-2 rounded-full font-bold bg-neutral-900 text-white hover:bg-neutral-800 transition-all">
              Contact Us
            </a>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-neutral-100 bg-white overflow-hidden">
              <div className="px-4 py-6 flex flex-col gap-4">
                <a href="/" className="w-full py-4 px-6 rounded-2xl text-left font-bold text-neutral-500 hover:bg-neutral-50">Internship Roadmap</a>
                <a href="/" className="w-full py-4 px-6 rounded-2xl text-left font-bold bg-blue-50 text-blue-600">Application Form</a>
                <a href="/CodeScaler_Industrial_Training_Curriculum.pdf" download
                  className="w-full py-4 px-6 rounded-2xl text-left font-bold text-neutral-500 hover:bg-neutral-50 hover:text-blue-600">Download Curriculum</a>
                    <a href="/batch"    className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-0.5">Batches</a>
                    <a href="/admission" className="w-full py-4 px-6 rounded-2xl text-left font-bold transition-all cursor-pointer text-neutral-500 hover:bg-neutral-50 hover:text-blue-600 ">Admission</a>
                <a href="/find" className="w-full py-4 px-6 rounded-2xl text-left font-bold transition-all cursor-pointer text-neutral-500 hover:bg-neutral-50 hover:text-blue-600">Find Registation</a>
             
                <a href="/contact"
                  className="w-full py-4 px-6 bg-neutral-900 text-white rounded-2xl font-bold hover:bg-neutral-800 transition-all text-center">Contact Our Team</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main */}
      <div className="max-w-2xl mx-auto px-4 py-12 md:py-20">

        {/* Hero */}
        <div className="text-center mb-10">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold border border-blue-100 mb-5">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            Admission Lookup — Batch 2026
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight mb-3">
            Find Your <span className="text-blue-600">Registration Number</span>
          </h1>
          <p className="text-neutral-500 text-base max-w-md mx-auto">
            Enter your class roll number and select your college to retrieve your registration details.
          </p>
        </div>

        {/* Search Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl shadow-neutral-200/50 border border-neutral-100 p-6 md:p-8 mb-6">

          <div className="space-y-4">
            {/* Roll No Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-neutral-600">Class Roll Number</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                  <Hash size={18} />
                </div>
                <input
                  type="text"
                  value={rollNo}
                  onChange={e => { setRollNo(e.target.value); setError(""); }}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your roll number"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-3.5 pl-11 pr-4 text-sm outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* College Select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-neutral-600">College</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                  <Building2 size={18} />
                </div>
                <select
                  value={college}
                  onChange={e => { setCollege(e.target.value); setError(""); }}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-3.5 pl-11 pr-10 text-sm outline-none transition-all appearance-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="" disabled>Select your college</option>
                  {COLLEGES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                  <GraduationCap size={16} />
                </div>
              </div>
            </div>

            {/* Class Select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-neutral-600">Class / Degree</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                  <BookOpen size={18} />
                </div>
                <select
                  value={academicClass}
                  onChange={e => { setAcademicClass(e.target.value); setError(""); }}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-3.5 pl-11 pr-10 text-sm outline-none transition-all appearance-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="" disabled>Select your class</option>
                  {["BCA", "MCA", "B.Tech", "BA", "BSC"].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                  <GraduationCap size={16} />
                </div>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle size={18} className="text-red-500 shrink-0" />
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Search Button */}
            <button onClick={handleSearch} disabled={loading}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 text-sm">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Find Registration
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* No result state */}
        <AnimatePresence>
          {searched && !result && !error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-12">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={28} className="text-neutral-400" />
              </div>
              <p className="font-bold text-neutral-700 mb-1">No record found</p>
              <p className="text-sm text-neutral-400">Double-check your roll number and college selection.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Result Modal Popup ── */}
      <AnimatePresence>
        {showModal && result && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-neutral-900/70 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[88vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/90 hover:bg-white text-neutral-500 hover:text-neutral-900 rounded-full flex items-center justify-center shadow-md transition-all"
              >
                <X size={18} />
              </button>

              {/* Top Banner */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 pt-8 pb-10 text-white shrink-0">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                    <CheckCircle2 size={26} className="text-white" />
                  </div>
                  <div>
                    <p className="font-extrabold text-xl leading-tight">{result.fullName}</p>
                    <p className="text-blue-200 text-xs font-medium mt-0.5">
                      {COLLEGES.find(c => c.value === result.college)?.label || result.college}
                    </p>
                  </div>
                </div>

                {/* Reg No highlight box */}
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/20">
                  <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest mb-1">Registration Number</p>
                  <p className="text-3xl font-black tracking-widest">{result.registrationNo}</p>
                  <p className="text-blue-200/70 text-[10px] mt-1">Keep this for all future correspondence</p>
                </div>
              </div>

              {/* Scrollable body */}
              <div className="overflow-y-auto flex-1 px-5 pb-6 -mt-5">
                {/* Student Details Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 p-4 mb-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3">Student Details</p>
                  <div className="divide-y divide-neutral-50">
                    <DetailRow icon={<User size={14} />}         label="Full Name"     value={result.fullName} />
                    <DetailRow icon={<Hash size={14} />}         label="Roll Number"   value={result.rollNo} />
                    <DetailRow icon={<GraduationCap size={14}/>} label="Class"         value={result.academicClass} />
                    <DetailRow icon={<BookOpen size={14} />}     label="Semester"      value={result.semester} />
                    <DetailRow icon={<Building2 size={14} />}    label="Course"        value={result.course} />
                  </div>
                </div>

                {/* Contact Details Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 p-4 mb-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3">Contact Info</p>
                  <div className="divide-y divide-neutral-50">
                    <DetailRow icon={<Mail size={14} />}    label="Email"          value={result.email} />
                    <DetailRow icon={<Phone size={14} />}   label="WhatsApp"       value={result.whatsappNo} />
                    <DetailRow icon={<User size={14} />}    label="Father's Name"  value={result.fatherName} />
                    <DetailRow icon={<MapPin size={14} />}  label="Registered On"  value={new Date(result.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} />
                  </div>
                </div>

                {/* WhatsApp CTA */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-2xl mb-4">
                  <p className="text-sm text-green-800 font-semibold text-center leading-relaxed">
                    📲 Share <span className="font-black">{result.registrationNo}</span> on WhatsApp{" "}
                    <a href="https://wa.me/918572892552" target="_blank" rel="noopener noreferrer"
                      className="underline font-black text-green-700">8572892552</a>{" "}
                    to confirm your seat.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button onClick={reset}
                    className="flex-1 py-3 rounded-xl border border-neutral-200 font-semibold text-neutral-600 hover:bg-neutral-50 text-sm transition">
                    Search Again
                  </button>
                  <button onClick={() => window.print()}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 text-sm transition">
                    Print / Save
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-8 border-t border-neutral-200 mt-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 grayscale brightness-0">
            <img src={LOGO_URL} alt="CodeScaler" className="w-16 h-16 object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <span className="font-bold text-xl tracking-tight text-neutral-800">CodeScaler</span>
          </div>
          <p className="text-neutral-400 text-sm">© 2026 CodeScaler. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-neutral-400 hover:text-neutral-600 text-sm transition-colors">Privacy</a>
            <a href="#" className="text-neutral-400 hover:text-neutral-600 text-sm transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-neutral-50 last:border-0">
      <div className="w-7 h-7 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center shrink-0">
        {icon}
      </div>
      <span className="text-xs text-neutral-400 font-semibold w-32 shrink-0">{label}</span>
      <span className="text-sm font-bold text-neutral-800 truncate">{value || "—"}</span>
    </div>
  );
}