"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User, MapPin, Phone, Mail, Calendar, CreditCard,
  BookOpen, Building2, GraduationCap, CheckCircle2,
  ChevronRight, ChevronLeft, ArrowRight, X, Briefcase, Hash,
  Menu
} from "lucide-react";

const LOGO_URL = "https://www.codescaler.com/logo.png";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const COLLEGES = [
  { label: "Hindu Kanya Mahavidyalaya, Jind", value: "Hindu Kanya Mahavidyalaya Jind", code: "04" },
  { label: "Govt. PG College, Jind", value: "Govt PG College Jind", code: "02" },
  { label: "Govt. PIG College, Jind", value: "Govt PIG College Jind", code: "03" },
  { label: "CRSU, Jind", value: "CRSU Jind", code: "01" },
  { label: "JIET", value: "JIET", code: "05" },
  { label: "GJU Hisar", value: "GJU Hisar", code: "07" },
  { label: "Govt. College Uchana", value: "Govt College Uchana", code: "06" },
];

const CLASSES = ["BCA", "MCA", "B.Tech", "BA", "BSC"];
const SEMESTERS = ["2nd", "4th", "6th", "8th"];
const COURSES = ["Frontend Web Design", "Full Stack Development", "Data Analyst"];
const GENDERS = ["Male", "Female", "Other"];

interface FormData {
  fullName: string;
  address: string;
  whatsappNo: string;
  email: string;
  fatherName: string;
  fatherContact: string;
  dob: string;
  gender: string;
  aadharCard: string;
  academicClass: string;
  semester: string;
  rollNo: string;
  college: string;
  course: string;
  postCode: string;
}

const INITIAL: FormData = {
  fullName: "", address: "", whatsappNo: "", email: "",
  fatherName: "", fatherContact: "", dob: "", gender: "",
  aadharCard: "", academicClass: "", semester: "", rollNo: "",
  college: "", course: "", postCode: "",
};

type Errors = Partial<Record<keyof FormData, string>>;

interface SuccessData {
  registrationNo: string;
  data: FormData;
}

export default function AdmissionPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<SuccessData | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => { setIsMenuOpen(false); }, []);

  const update = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const validate = (s: number): boolean => {
    const e: Errors = {};
    if (s === 1) {
      if (!form.fullName.trim()) e.fullName = "Required";
      if (!form.address.trim()) e.address = "Required";
      if (!form.whatsappNo.trim()) e.whatsappNo = "Required";
      else if (!/^\d{10}$/.test(form.whatsappNo.replace(/\D/g, ""))) e.whatsappNo = "Must be 10 digits";
      if (!form.email.trim()) e.email = "Required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
      if (!form.fatherName.trim()) e.fatherName = "Required";
      if (!form.fatherContact.trim()) e.fatherContact = "Required";
      else if (!/^\d{10}$/.test(form.fatherContact.replace(/\D/g, ""))) e.fatherContact = "Must be 10 digits";
      if (!form.dob) e.dob = "Required";
      if (!form.gender) e.gender = "Required";
      if (!form.aadharCard.trim()) e.aadharCard = "Required";
      else if (!/^\d{12}$/.test(form.aadharCard.replace(/\s/g, ""))) e.aadharCard = "Must be 12 digits";
    }
    if (s === 2) {
      if (!form.academicClass) e.academicClass = "Required";
      if (!form.semester) e.semester = "Required";
      if (!form.rollNo.trim()) e.rollNo = "Required";
      if (!form.college) e.college = "Required";
      if (!form.course) e.course = "Required";
      if (!form.postCode.trim()) e.postCode = "Required";
      else if (!/^\d{6}$/.test(form.postCode)) e.postCode = "Must be 6 digits";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const [submitError, setSubmitError] = useState("");

  const next = () => { if (validate(step)) { setStep(s => Math.min(s + 1, 3)); window.scrollTo({ top: 0, behavior: "smooth" }); } };
  const back = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!validate(1) || !validate(2)) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/admission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (result.success) {
        setSuccess({ registrationNo: result.registrationNo, data: { ...form } });
      } else if (res.status === 409) {
        setSubmitError(result.error || "This Roll Number is already registered for the selected college.");
      } else {
        setSubmitError(result.error || "Submission failed. Please try again.");
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const collegeLabel = COLLEGES.find(c => c.value === form.college)?.label || form.college;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-15 h-15 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              <img src={LOGO_URL} alt="CodeScaler Logo" className="w-20 h-20 object-contain" onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }} />
            </div>
            <a href="https://www.codescaler.com/">
              <span className="font-bold text-2xl tracking-tight text-neutral-800">CodeScaler</span>
            </a>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-neutral-500 font-medium">
            <a href="/" className="hover:text-blue-600 transition-colors cursor-pointer">Roadmap</a>
            <a href="/" className="hover:text-blue-600 transition-colors cursor-pointer">Internship</a>
            <a href="/admission" className="hover:text-blue-600 transition-colors ">Admission</a>
            <a href="/batch"    className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-0.5">Batches</a>
            <a href="/find" className="hover:text-blue-600 transition-colors ">Find Registation</a>
            <a
              href="/CodeScaler_Industrial_Training_Curriculum.pdf"
              download="CodeScaler_Industrial_Training_Curriculum.pdf"
              className="cursor-pointer hover:text-blue-600 transition-colors font-medium text-neutral-500"
            >
              Download
            </a>
            <a
              href="/contact"
              className="px-5 py-2 rounded-full transition-all font-bold bg-neutral-900 text-white hover:bg-neutral-800"
            >
              Contact Us
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-neutral-100 bg-white overflow-hidden"
            >
              <div className="px-4 py-6 flex flex-col gap-4">
                <a
                  href="/"
                  className="w-full py-4 px-6 rounded-2xl text-left font-bold transition-all text-neutral-500 hover:bg-neutral-50"
                >
                  Internship Roadmap
                </a>
                <a
                  href="/"
                  className="w-full py-4 px-6 rounded-2xl text-left font-bold transition-all text-neutral-500 hover:bg-neutral-50"
                >
                  Application Form
                </a>
                <a href="/batch"    className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-0.5">Batches</a>
                <a
                  href="/CodeScaler_Industrial_Training_Curriculum.pdf"
                  download="CodeScaler_Industrial_Training_Curriculum.pdf"
                  className="w-full py-4 px-6 rounded-2xl text-left font-bold transition-all cursor-pointer text-neutral-500 hover:bg-neutral-50 hover:text-blue-600"
                >
                  Download Curriculum
                </a>
                <a href="/admission" className="w-full py-4 px-6 rounded-2xl text-left font-bold transition-all cursor-pointer text-neutral-500 hover:bg-neutral-50 hover:text-blue-600 ">Admission</a>
                <a href="/find" className="w-full py-4 px-6 rounded-2xl text-left font-bold transition-all cursor-pointer text-neutral-500 hover:bg-neutral-50 hover:text-blue-600">Find Registation</a>
                <a href="/batch"    className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-0.5">Batches</a>
                <a
                  href="/contact"
                  className="w-full py-4 px-6 bg-neutral-900 text-white rounded-2xl font-bold hover:bg-neutral-800 transition-all text-center"
                >
                  Contact Our Team
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Internship Admission Form
          </h1>
          <p className="text-slate-500">Fill in all details carefully. Registration number will be generated on submission.</p>
        </div>

        {/* Step Indicator */}
        {!success && (
          <div className="flex items-center justify-center mb-10">
            <div className="flex items-center gap-2">
              {[
                { n: 1, label: "Personal" },
                { n: 2, label: "Academic" },
                { n: 3, label: "Review" },
              ].map(({ n, label }, i, arr) => (
                <React.Fragment key={n}>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300",
                      step === n ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-110"
                        : step > n ? "bg-emerald-500 border-emerald-500 text-white"
                        : "bg-white border-slate-300 text-slate-400"
                    )}>
                      {step > n ? <CheckCircle2 size={18} /> : n}
                    </div>
                    <span className={cn("text-[11px] font-semibold uppercase tracking-wider",
                      step === n ? "text-blue-600" : "text-slate-400")}>{label}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className={cn("w-16 md:w-24 h-0.5 mb-5 transition-colors", step > n ? "bg-emerald-400" : "bg-slate-200")} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="p-6 md:p-10"
            >
              {/* Step 1 */}
              {step === 1 && (
                <div className="space-y-6">
                  <SectionHeader icon={<User size={20} />} title="Personal Information" color="blue" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Full Name" error={errors.fullName}>
                      <TextInput icon={<User size={16} />} placeholder="e.g. Rahul Kumar" value={form.fullName} onChange={v => update("fullName", v)} error={errors.fullName} />
                    </Field>
                    <Field label="Date of Birth" error={errors.dob}>
                      <TextInput icon={<Calendar size={16} />} type="date" value={form.dob} onChange={v => update("dob", v)} error={errors.dob} />
                    </Field>
                    <Field label="Gender" error={errors.gender} className="md:col-span-2">
                      <div className="flex gap-3 flex-wrap">
                        {GENDERS.map(g => (
                          <button key={g} type="button" onClick={() => update("gender", g)}
                            className={cn("flex-1 min-w-[100px] py-3 rounded-xl border text-sm font-semibold transition-all",
                              form.gender === g ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-500 hover:border-slate-300"
                            )}>
                            {g}
                          </button>
                        ))}
                      </div>
                    </Field>
                    <Field label="Address" error={errors.address} className="md:col-span-2">
                      <TextInput icon={<MapPin size={16} />} placeholder="Full address with city, state" value={form.address} onChange={v => update("address", v)} error={errors.address} />
                    </Field>
                    <Field label="WhatsApp Number" error={errors.whatsappNo}>
                      <TextInput icon={<Phone size={16} />} placeholder="10-digit number" type="tel" value={form.whatsappNo} onChange={v => update("whatsappNo", v)} error={errors.whatsappNo} />
                    </Field>
                    <Field label="Email Address" error={errors.email}>
                      <TextInput icon={<Mail size={16} />} placeholder="you@example.com" type="email" value={form.email} onChange={v => update("email", v)} error={errors.email} />
                    </Field>
                    <Field label="Father's Name" error={errors.fatherName}>
                      <TextInput icon={<User size={16} />} placeholder="Father's full name" value={form.fatherName} onChange={v => update("fatherName", v)} error={errors.fatherName} />
                    </Field>
                    <Field label="Father's Contact" error={errors.fatherContact}>
                      <TextInput icon={<Phone size={16} />} placeholder="Father's 10-digit number" type="tel" value={form.fatherContact} onChange={v => update("fatherContact", v)} error={errors.fatherContact} />
                    </Field>
                    <Field label="Aadhar Card Number" error={errors.aadharCard} className="md:col-span-2">
                      <TextInput icon={<CreditCard size={16} />} placeholder="12-digit Aadhar number" value={form.aadharCard} onChange={v => update("aadharCard", v)} error={errors.aadharCard} maxLength={12} />
                    </Field>
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="space-y-6">
                  <SectionHeader icon={<BookOpen size={20} />} title="Academic Details" color="purple" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Class / Degree" error={errors.academicClass}>
                      <SelectInput value={form.academicClass} options={CLASSES} onChange={v => update("academicClass", v)} placeholder="Select class" error={errors.academicClass} />
                    </Field>
                    <Field label="Semester" error={errors.semester}>
                      <SelectInput value={form.semester} options={SEMESTERS} onChange={v => update("semester", v)} placeholder="Select semester" error={errors.semester} />
                    </Field>
                    <Field label="Class Roll Number" error={errors.rollNo}>
                      <TextInput icon={<Hash size={16} />} placeholder="e.g. 12345" value={form.rollNo} onChange={v => update("rollNo", v)} error={errors.rollNo} />
                    </Field>
                    <Field label="Post Code (PIN)" error={errors.postCode}>
                      <TextInput icon={<MapPin size={16} />} placeholder="6-digit PIN code" value={form.postCode} onChange={v => update("postCode", v)} error={errors.postCode} maxLength={6} />
                    </Field>
                    <Field label="College Name" error={errors.college} className="md:col-span-2">
                      <SelectInput
                        value={form.college}
                        options={COLLEGES.map(c => c.value)}
                        labels={COLLEGES.map(c => c.label)}
                        onChange={v => update("college", v)}
                        placeholder="Select your college"
                        error={errors.college}
                      />
                    </Field>
                    <Field label="Course / Domain" error={errors.course} className="md:col-span-2">
                      <SelectInput
                        value={form.course}
                        options={COURSES}
                        onChange={v => update("course", v)}
                        placeholder="Select internship course"
                        error={errors.course}
                        icon={<Briefcase size={16} />}
                      />
                    </Field>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="space-y-8">
                  <SectionHeader icon={<CheckCircle2 size={20} />} title="Review Your Application" color="green" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ReviewCard title="Personal Details" color="blue" items={[
                      { label: "Full Name", value: form.fullName },
                      { label: "Date of Birth", value: form.dob },
                      { label: "Gender", value: form.gender },
                      { label: "WhatsApp", value: form.whatsappNo },
                      { label: "Email", value: form.email },
                      { label: "Address", value: form.address },
                    ]} />
                    <ReviewCard title="Family Details" color="purple" items={[
                      { label: "Father's Name", value: form.fatherName },
                      { label: "Father's Contact", value: form.fatherContact },
                      { label: "Aadhar Card", value: form.aadharCard },
                    ]} />
                    <ReviewCard title="Academic Details" color="indigo" items={[
                      { label: "Class", value: form.academicClass },
                      { label: "Semester", value: form.semester },
                      { label: "Roll No.", value: form.rollNo },
                      { label: "College", value: collegeLabel },
                      { label: "Course", value: form.course },
                      { label: "Post Code", value: form.postCode },
                    ]} className="md:col-span-2" />
                  </div>
                  <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3 items-start">
                    <span className="text-amber-500 text-lg mt-0.5">⚠️</span>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      Please verify all details before submitting. A unique registration number will be generated after submission. Aadhar number is kept strictly confidential.
                    </p>
                  </div>
                </div>
              )}

              {/* Nav Buttons */}
              <div className="mt-10 pt-8 border-t border-slate-100 space-y-4">

                {/* Duplicate Roll No Error Banner */}
                <AnimatePresence>
                  {submitError && step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl"
                    >
                      <div className="w-9 h-9 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shrink-0">
                        <span className="text-lg font-black">!</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-red-700 mb-0.5">Registration Already Exists</p>
                        <p className="text-xs text-red-600 leading-relaxed">{submitError}</p>
                        <button
                          onClick={() => { setSubmitError(""); setStep(2); }}
                          className="mt-2 text-xs font-bold text-red-600 underline underline-offset-2 hover:text-red-800 transition"
                        >
                          ← Go back and correct details
                        </button>
                      </div>
                      <button onClick={() => setSubmitError("")} className="text-red-300 hover:text-red-500 transition shrink-0">
                        <X size={16} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between">
                  <button
                    disabled={step === 1}
                    onClick={back}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition disabled:opacity-0"
                  >
                    <ChevronLeft size={18} /> Back
                  </button>
                  {step < 3 ? (
                    <button onClick={next}
                      className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 active:scale-95">
                      Next Step <ChevronRight size={18} />
                    </button>
                  ) : (
                    <button disabled={submitting} onClick={handleSubmit}
                      className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg active:scale-95 disabled:opacity-60">
                      {submitting ? "Submitting..." : "Submit Application"}
                      {!submitting && <ArrowRight size={18} />}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {success && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8"
            >
              {/* Top Banner */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
                <div className="relative">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={36} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-extrabold mb-1">Application Submitted!</h2>
                  <p className="text-blue-100 text-sm">Your admission has been registered successfully.</p>
                </div>
              </div>

              {/* Reg No Banner */}
              <div className="mx-6 -mt-4 relative z-10">
                <div className="bg-white rounded-2xl border-2 border-blue-600 shadow-xl shadow-blue-100 p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Your Registration Number</p>
                  <p className="text-3xl font-black text-blue-600 tracking-widest">{success.registrationNo}</p>
                  <p className="text-xs text-slate-400 mt-1">Keep this number for all future correspondence</p>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Details Grid */}
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Application Summary</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Name", value: success.data.fullName },
                    { label: "DOB", value: success.data.dob },
                    { label: "Gender", value: success.data.gender },
                    { label: "WhatsApp", value: success.data.whatsappNo },
                    { label: "Email", value: success.data.email },
                    { label: "Father's Name", value: success.data.fatherName },
                    { label: "Father's Contact", value: success.data.fatherContact },
                    { label: "Class", value: success.data.academicClass },
                    { label: "Semester", value: success.data.semester },
                    { label: "Roll No.", value: success.data.rollNo },
                    { label: "Course", value: success.data.course },
                    { label: "Post Code", value: success.data.postCode },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-slate-50 rounded-xl p-3">
                      <p className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">{label}</p>
                      <p className="text-sm font-semibold text-slate-800 truncate">{value || "—"}</p>
                    </div>
                  ))}
                  <div className="col-span-2 bg-slate-50 rounded-xl p-3">
                    <p className="text-[10px] font-bold uppercase text-slate-400 mb-0.5">College</p>
                    <p className="text-sm font-semibold text-slate-800">{COLLEGES.find(c => c.value === success.data.college)?.label || success.data.college}</p>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-2xl text-center">
                  <p className="text-sm text-green-800 font-semibold">
                    📲 Share your registration number <span className="font-black">{success.registrationNo}</span> on WhatsApp{" "}
                    <a href="https://wa.me/918572892552" target="_blank" rel="noopener noreferrer" className="underline text-green-700">8572892552</a>{" "}
                    to confirm your seat.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSuccess(null);
                      setStep(1);
                      setForm(INITIAL);
                    }}
                    className="flex-1 py-3 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 text-sm"
                  >
                    New Application
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 text-sm"
                  >
                    Print / Save
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────

function SectionHeader({ icon, title, color }: { icon: React.ReactNode; title: string; color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-emerald-50 text-emerald-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };
  return (
    <div className="flex items-center gap-3 mb-2">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colors[color])}>{icon}</div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    </div>
  );
}

function Field({ label, error, children, className }: { label: string; error?: string; children: React.ReactNode; className?: string }) {
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

function TextInput({ icon, placeholder, value, onChange, type = "text", error, maxLength }: {
  icon?: React.ReactNode; placeholder?: string; value: string;
  onChange: (v: string) => void; type?: string; error?: string; maxLength?: number;
}) {
  return (
    <div className="relative">
      {icon && <div className={cn("absolute left-3.5 top-1/2 -translate-y-1/2", error ? "text-red-400" : "text-slate-400")}>{icon}</div>}
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} maxLength={maxLength}
        className={cn(
          "w-full bg-slate-50 border rounded-xl py-3 px-4 text-sm outline-none transition-all focus:bg-white focus:ring-4",
          error ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-blue-100",
          icon && "pl-10"
        )}
      />
    </div>
  );
}

function SelectInput({ value, options, labels, onChange, placeholder, error, icon }: {
  value: string; options: string[]; labels?: string[]; onChange: (v: string) => void;
  placeholder?: string; error?: string; icon?: React.ReactNode;
}) {
  return (
    <div className="relative">
      {icon && <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10">{icon}</div>}
      <select value={value} onChange={e => onChange(e.target.value)}
        className={cn(
          "w-full bg-slate-50 border rounded-xl py-3 px-4 text-sm outline-none transition-all appearance-none focus:bg-white focus:ring-4",
          error ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-blue-100",
          icon && "pl-10"
        )}>
        <option value="" disabled>{placeholder}</option>
        {options.map((opt, i) => <option key={opt} value={opt}>{labels ? labels[i] : opt}</option>)}
      </select>
      <ChevronRight size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
    </div>
  );
}

function ReviewCard({ title, color, items, className }: {
  title: string; color: string; items: { label: string; value: string }[]; className?: string;
}) {
  const borders: Record<string, string> = {
    blue: "border-blue-100 bg-blue-50/30", purple: "border-purple-100 bg-purple-50/30",
    indigo: "border-indigo-100 bg-indigo-50/30", green: "border-emerald-100 bg-emerald-50/30",
  };
  const headings: Record<string, string> = {
    blue: "text-blue-700", purple: "text-purple-700", indigo: "text-indigo-700", green: "text-emerald-700",
  };
  return (
    <div className={cn("rounded-2xl border p-5", borders[color], className)}>
      <h4 className={cn("text-xs font-black uppercase tracking-wider mb-4", headings[color])}>{title}</h4>
      <div className="space-y-2.5">
        {items.map(({ label, value }) => (
          <div key={label} className="flex justify-between items-start gap-2">
            <span className="text-xs text-slate-500 font-medium shrink-0">{label}</span>
            <span className="text-xs font-semibold text-slate-800 text-right">{value || "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}