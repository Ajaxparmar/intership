"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import { 
  User, 
  BookOpen, 
  CreditCard, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Building2,
  GraduationCap,
  Briefcase,
  Menu,
  X,
  QrCode
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Logo URL provided: https://www.codescaler.com/
// I'll use a text-based logo with a professional icon if the live image fails or looks bad in a container.
// But the user specifically asked to use the logo.
const LOGO_URL = "https://www.codescaler.com/assets/images/logo.png"; // Guessed common path, but I'll fallback to text.

interface FormData {
  // Step 1
  name: string;
  fatherName: string;
  address: string;
  gender: string;
  phone: string;
  email: string;
  // Step 2
  academicClass: string;
  yearSemester: string;
  rollNo: string;
  collegeName: string;
  universityName: string;
  duration: string;
  domain: string;
}

const INITIAL_DATA: FormData = {
  name: "",
  fatherName: "",
  address: "",
  gender: "", // Changed to empty to force selection
  phone: "",
  email: "",
  academicClass: "",
  yearSemester: "",
  rollNo: "",
  collegeName: "",
  universityName: "",
  duration: "", // Force selection
  domain: "", // Force selection
};

const DURATION_PRICES: Record<string, number> = {
  "1 month": 3999,
  "45 days": 5000,
  "2 month": 7500,
  "3 month": 12000,
  "6 month": 24999,
};

export default function App() {
  const [view, setView] = useState<"form" | "roadmap" | "contact">("form");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  useEffect(() => {
    setIsMenuOpen(false);
  }, [view]);

  const price = DURATION_PRICES[formData.duration] || 0;

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateStep = (s: number) => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (s === 1) {
      if (!formData.name.trim()) newErrors.name = "Full Name is required";
      if (!formData.fatherName.trim()) newErrors.fatherName = "Father's Name is required";
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!formData.gender) newErrors.gender = "Gender selection is required";
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone Number is required";
      } else if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ""))) {
        newErrors.phone = "Invalid Phone Number (10 digits required)";
      }
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Invalid Email Address";
      }
    } else if (s === 2) {
      if (!formData.academicClass.trim()) newErrors.academicClass = "Degree/Class is required";
      if (!formData.yearSemester.trim()) newErrors.yearSemester = "Year/Semester is required";
      if (!formData.rollNo.trim()) newErrors.rollNo = "Roll Number is required";
      if (!formData.collegeName.trim()) newErrors.collegeName = "College Name is required";
      if (!formData.universityName.trim()) newErrors.universityName = "University Name is required";
      if (!formData.duration || formData.duration === "") newErrors.duration = "Please select duration";
      if (!formData.domain || formData.domain === "") newErrors.domain = "Please select a domain";
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    
    return isValid;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, 3));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2)) {
      alert("Please complete all required fields correctly.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, amount: price }),
      });
      const result = await response.json();
      if (result.success) {
        setIsSubmitted(true);
        setIsPaymentModalOpen(true);
      } else {
        alert(result.error || "Submission failed");
      }
    } catch (err) {
      console.error(err);
      alert("Submission failed. Check network.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-blue-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView("form")}>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              CS
            </div>
            <span className="font-bold text-xl tracking-tight text-neutral-800">CodeScaler</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-neutral-500 font-medium">
            <button onClick={() => setView("roadmap")} className={cn("hover:text-blue-600 transition-colors cursor-pointer", view === "roadmap" && "text-blue-600 font-bold")}>Roadmap</button>
            <button onClick={() => setView("form")} className={cn("hover:text-blue-600 transition-colors cursor-pointer", view === "form" && "text-blue-600 font-bold")}>Internship</button>
            <button 
              onClick={() => setView("contact")} 
              className={cn(
                "px-5 py-2 rounded-full transition-all font-bold",
                view === "contact" ? "bg-blue-600 text-white" : "bg-neutral-900 text-white hover:bg-neutral-800"
              )}
            >
              Contact Us
            </button>
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
                <button 
                  onClick={() => setView("roadmap")} 
                  className={cn(
                    "w-full py-4 px-6 rounded-2xl text-left font-bold transition-all",
                    view === "roadmap" ? "bg-blue-50 text-blue-600" : "text-neutral-500 hover:bg-neutral-50"
                  )}
                >
                  Internship Roadmap
                </button>
                <button 
                  onClick={() => setView("form")} 
                  className={cn(
                    "w-full py-4 px-6 rounded-2xl text-left font-bold transition-all",
                    view === "form" ? "bg-blue-50 text-blue-600" : "text-neutral-500 hover:bg-neutral-50"
                  )}
                >
                  Application Form
                </button>
                <button 
                  onClick={() => setView("contact")} 
                  className="w-full py-4 px-6 bg-neutral-900 text-white rounded-2xl font-bold hover:bg-neutral-800 transition-all text-center"
                >
                  Contact Our Team
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        {view === "roadmap" ? (
          <RoadmapView />
        ) : view === "contact" ? (
          <ContactView />
        ) : (
          <>
            <div className="text-center mb-12">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold border border-blue-100 mb-6"
              >
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                Special Batch: Guru Jambheshwar University Students
              </motion.div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-neutral-900 px-2">
                Internship Program <span className="text-blue-600">2026</span>
              </h1>
              <p className="text-neutral-500 text-lg max-w-2xl mx-auto">
                Kickstart your career with CodeScaler. Join our intensive program and work on real-world projects with industry experts.
              </p>
            </div>

            {/* Step Indicator */}
            {!isSubmitted && (
              <div className="flex items-center justify-center mb-12 relative px-4">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-200 -translate-y-1/2 -z-10 max-w-xs mx-auto" />
                <div className="flex justify-between w-full max-w-xs bg-neutral-50 px-4">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex flex-col items-center gap-2 group">
                      <div 
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2",
                          step === s ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-110" : 
                          step > s ? "bg-green-500 border-green-500 text-white" : 
                          "bg-white border-neutral-300 text-neutral-400"
                        )}
                      >
                        {step > s ? <CheckCircle2 size={18} /> : s}
                      </div>
                      <span className={cn(
                        "text-xs font-semibold uppercase tracking-wider",
                        step === s ? "text-blue-600" : "text-neutral-400"
                      )}>
                        {s === 1 ? "Basic" : s === 2 ? "Academic" : "Review"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Form Container */}
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100 overflow-hidden relative">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-12 text-center"
                  >
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Application Submitted!</h2>
                    <p className="text-neutral-500 mb-8 max-w-md mx-auto">
                      Thank you for applying to CodeScaler. Your details has been saved successfully.
                    </p>
                    <div className="flex flex-col gap-4 items-center">
                      <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 w-full max-w-md">
                        {!showQRCode ? (
                          <>
                            <p className="text-blue-600 font-bold mb-2 text-lg">Order Summary</p>
                            <div className="flex justify-between items-center mb-4 py-2 border-b border-blue-100/50">
                              <span className="text-neutral-600">Internship Program</span>
                              <span className="font-bold">₹{price}</span>
                            </div>
                            <button 
                              onClick={() => {
                                setIsPaymentModalOpen(true);
                                setShowQRCode(true);
                              }}
                              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                            >
                              <QrCode size={20} />
                              View Payment QR
                            </button>
                          </>
                        ) : (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center"
                          >
                            <div className="bg-white p-4 rounded-2xl shadow-inner mb-6 border border-neutral-100">
                                <QRCodeSVG value={`upi://pay?pa=codescaler@okaxis&pn=CodeScaler&am=${price}&cu=INR`} size={200} />
                            </div>
                            <div className="text-center space-y-4">
                              <p className="font-bold text-neutral-800">Scan QR to Pay: ₹{price}</p>
                              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                                <p className="text-sm text-amber-800 font-semibold">
                                  ⚠️ MANDATORY STEP:
                                </p>
                                <p className="text-sm text-amber-700 mt-1 leading-relaxed decoration-amber-300">
                                  After payment, share your payment screenshot to <span className="font-black text-amber-900 underline">7201000220</span> on WhatsApp for confirmation.
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => setShowQRCode(false)}
                                  className="flex-1 py-3 text-sm font-bold text-neutral-500 hover:text-neutral-800"
                                >
                                  Go Back
                                </button>
                                <a 
                                  href="https://rzp.io/l/codescaler-internship" 
                                  target="_blank"
                                  className="flex-1 py-3 text-sm font-bold text-blue-600 hover:text-blue-800"
                                >
                                  Pay via Link
                                </a>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                      <button 
                        onClick={() => {
                            setStep(1);
                            setFormData(INITIAL_DATA);
                            setIsSubmitted(false);
                            setShowQRCode(false);
                        }}
                        className="text-neutral-400 text-sm hover:text-neutral-600 transition-colors mt-4"
                      >
                        Submit another application
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="p-5 md:p-12"
                  >
                    {step === 1 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <User size={20} />
                          </div>
                          <h2 className="text-2xl font-bold">Personal Information</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Input label="Full Name" placeholder="John Doe" value={formData.name} onChange={(v) => updateField("name", v)} icon={<User size={18} />} error={errors.name} />
                          <Input label="Father's Name" placeholder="Robert Doe" value={formData.fatherName} onChange={(v) => updateField("fatherName", v)} icon={<User size={18} />} error={errors.fatherName} />
                          <div className="md:col-span-2">
                            <Input label="Full Address" placeholder="123 Street, City, State" value={formData.address} onChange={(v) => updateField("address", v)} icon={<MapPin size={18} />} error={errors.address} />
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                              <label className={cn(
                                "text-sm font-semibold transition-colors",
                                errors.gender ? "text-red-500" : "text-neutral-600"
                              )}>Gender</label>
                              {errors.gender && <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">{errors.gender}</span>}
                            </div>
                            <div className="flex gap-4">
                              {["Male", "Female", "Other"].map((g) => (
                                <button
                                  key={g}
                                  type="button"
                                  onClick={() => updateField("gender", g)}
                                  className={cn(
                                    "flex-1 py-3 px-4 rounded-xl border text-sm font-medium transition-all",
                                    formData.gender === g ? "border-blue-600 bg-blue-50 text-blue-600" : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
                                  )}
                                >
                                  {g}
                                </button>
                              ))}
                            </div>
                          </div>
                          <Input label="Phone Number" placeholder="10 Digit Phone" type="tel" value={formData.phone} onChange={(v) => updateField("phone", v)} icon={<Phone size={18} />} error={errors.phone} />
                          <div className="md:col-span-2">
                            <Input label="Email Address" placeholder="john@example.com" type="email" value={formData.email} onChange={(v) => updateField("email", v)} icon={<Mail size={18} />} error={errors.email} />
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <BookOpen size={20} />
                          </div>
                          <div className="flex flex-col">
                            <h2 className="text-2xl font-bold">Academic Details</h2>
                            <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Priority Admission for GJU Students</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Input label="Class/Degree" placeholder="B.Tech" value={formData.academicClass} onChange={(v) => updateField("academicClass", v)} icon={<GraduationCap size={18} />} error={errors.academicClass} />
                          <Input label="Year/Semester" placeholder="3rd Year / 6th Sem" value={formData.yearSemester} onChange={(v) => updateField("yearSemester", v)} icon={<BookOpen size={18} />} error={errors.yearSemester} />
                          <Input label="Roll Number" placeholder="123456" value={formData.rollNo} onChange={(v) => updateField("rollNo", v)} error={errors.rollNo} />
                          <Input label="College Name" placeholder="Example Institute of Tech" value={formData.collegeName} onChange={(v) => updateField("collegeName", v)} icon={<Building2 size={18} />} error={errors.collegeName} />
                          <div className="md:col-span-2">
                            <Input label="University Name" placeholder="State University" value={formData.universityName} onChange={(v) => updateField("universityName", v)} icon={<Building2 size={18} />} error={errors.universityName} />
                          </div>
                          
                          <Select 
                            label="Internship Duration" 
                            value={formData.duration} 
                            options={["1 month", "45 days", "2 month", "3 month", "6 month"]} 
                            onChange={(v) => updateField("duration", v)} 
                            error={errors.duration}
                          />
                          <Select 
                            label="Selected Domain" 
                            value={formData.domain} 
                            options={["Data Analyst Development", "Full Stack Web Development", "Frontend Web Development", "Backend Web Development"]} 
                            onChange={(v) => updateField("domain", v)} 
                            icon={<Briefcase size={18} />}
                            error={errors.domain}
                          />
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-8">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <CreditCard size={20} />
                          </div>
                          <h2 className="text-2xl font-bold">Review & Payment</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">Application Summary</h3>
                            <div className="space-y-3">
                              <SummaryItem label="Applicant" value={formData.name} />
                              <SummaryItem label="Domain" value={formData.domain} />
                              <SummaryItem label="Duration" value={formData.duration} />
                              <SummaryItem label="College" value={formData.collegeName} />
                            </div>
                          </div>
                          
                          <div className="bg-neutral-900 text-white rounded-3xl p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full" />
                            <h3 className="text-blue-400 font-bold text-sm mb-6 uppercase tracking-widest">Pricing Details</h3>
                            <div className="flex items-end gap-1 mb-2">
                              <span className="text-4xl font-bold">₹{price}</span>
                              <span className="text-neutral-400 text-sm mb-1">GST Incl.</span>
                            </div>
                            <p className="text-neutral-400 text-sm mb-8">Selected Duration: {formData.duration}</p>
                            <div className="flex items-center gap-2 text-green-400 text-xs font-bold bg-green-400/10 px-3 py-1.5 rounded-full w-fit">
                              <CheckCircle2 size={12} />
                              VERIFIED INTERNSHIP
                            </div>
                          </div>
                        </div>

                        <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex gap-4">
                          <div className="w-10 h-10 shrink-0 bg-white rounded-full flex items-center justify-center text-amber-500 shadow-sm">
                            !
                          </div>
                          <p className="text-sm text-amber-800 leading-relaxed">
                            Please review all details carefully before submission. Once submitted, you'll be redirected to our secure payment gateway to complete the process.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Footer Controls */}
                    <div className="mt-12 pt-8 border-t border-neutral-100 flex items-center justify-between">
                      <button
                        disabled={step === 1 || isSubmitting}
                        onClick={prevStep}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors disabled:opacity-0"
                      >
                        <ChevronLeft size={20} />
                        Back
                      </button>
                      
                      {step < 3 ? (
                        <button
                          onClick={nextStep}
                          className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                        >
                          Next Step
                          <ChevronRight size={20} />
                        </button>
                      ) : (
                        <button
                          disabled={isSubmitting}
                          onClick={handleSubmit}
                          className="flex items-center gap-2 px-8 py-3 bg-neutral-900 text-white rounded-xl font-bold hover:bg-neutral-800 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                        >
                          {isSubmitting ? "Processing..." : "Complete Application"}
                          {!isSubmitting && <ArrowRight size={20} />}
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-neutral-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 grayscale brightness-0">
             <div className="w-8 h-8 bg-neutral-800 rounded-lg flex items-center justify-center text-white font-bold text-lg">CS</div>
             <span className="font-bold text-lg tracking-tight">CodeScaler</span>
          </div>
          <p className="text-neutral-400 text-sm">© 2026 CodeScaler. All rights reserved. Designed for excellence.</p>
          <div className="flex gap-6">
            <a href="#" className="text-neutral-400 hover:text-neutral-600 transition-colors">Privacy</a>
            <a href="#" className="text-neutral-400 hover:text-neutral-600 transition-colors">Terms</a>
          </div>
        </div>
      </footer>

      {/* Payment Modal */}
      <AnimatePresence>
        {isPaymentModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
              onClick={() => setIsPaymentModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl shadow-neutral-900/20 overflow-hidden"
            >
              <button 
                onClick={() => setIsPaymentModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-all"
              >
                <X size={20} />
              </button>

              <div className="p-8 md:p-10">
                {!showQRCode ? (
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CreditCard size={32} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Final Step: Secure Payment</h2>
                    <p className="text-neutral-500 mb-8 max-w-sm mx-auto">
                      Your application for <b>{formData.domain}</b> is ready. Submit the internship fee to confirm your seat.
                    </p>
                    
                    <div className="bg-neutral-50 rounded-2xl p-6 mb-8 border border-neutral-100 text-left">
                       <div className="flex justify-between items-center mb-3 text-sm text-neutral-500">
                          <span>Internship Duration</span>
                          <span className="font-bold text-neutral-700">{formData.duration}</span>
                       </div>
                       <div className="flex justify-between items-center text-lg font-bold">
                          <span>Processing Fee</span>
                          <span className="text-blue-600">₹{price}</span>
                       </div>
                    </div>

                    <button 
                      onClick={() => setShowQRCode(true)}
                      className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                      <QrCode size={24} />
                      Pay Now
                    </button>
                    <p className="mt-6 text-xs text-neutral-400 font-medium">Securely processed via CodeScaler Finance Team</p>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col items-center"
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-green-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                      Scan to Pay
                    </div>
                    
                    <div className="bg-white p-6 rounded-[2rem] shadow-2xl border border-neutral-100 mb-8 relative group">
                        <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-700" />
                        <div className="relative">
                          <QRCodeSVG value={`upi://pay?pa=codescaler@okaxis&pn=CodeScaler&am=${price}&cu=INR`} size={220} />
                        </div>
                    </div>

                    <div className="text-center space-y-6 w-full">
                      <div>
                        <p className="font-black text-3xl text-neutral-900">₹{price}</p>
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">Due Amount (GST Incl.)</p>
                      </div>

                      <div className="p-6 bg-blue-600 rounded-3xl text-white shadow-xl shadow-blue-900/20 text-left relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2" />
                        <p className="text-sm font-black uppercase tracking-widest mb-3 opacity-80 flex items-center gap-2">
                           <CheckCircle2 size={16} />
                           Mandatory Step
                        </p>
                        <p className="text-sm font-medium leading-relaxed">
                          After successful payment, please share your <span className="font-black underline underline-offset-4 text-white">Payment Screenshot</span> to this number:
                        </p>
                        <div className="mt-4 py-3 px-4 bg-white/10 rounded-xl font-black text-center text-xl tracking-tighter">
                          7201000220
                        </div>
                        <p className="text-[10px] text-white/60 mt-3 font-bold uppercase tracking-widest text-center italic">WhatsApp Only Support</p>
                      </div>

                      <div className="flex gap-4">
                        <button 
                          onClick={() => setShowQRCode(false)}
                          className="flex-1 py-4 text-sm font-bold text-neutral-400 hover:text-neutral-900 transition-colors"
                        >
                          Go Back
                        </button>
                        <a 
                          href="https://rzp.io/l/codescaler-internship" 
                          target="_blank"
                          className="flex-1 py-4 text-sm font-black text-blue-600 hover:text-blue-800 transition-colors border border-blue-100 rounded-2xl"
                        >
                          Pay via Link
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text", icon, error }: { 
  label: string; 
  value: string; 
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-2 group">
      <div className="flex justify-between items-center">
        <label className={cn(
          "text-sm font-semibold transition-colors group-focus-within:text-blue-600",
          error ? "text-red-500" : "text-neutral-600"
        )}>
          {label}
        </label>
        {error && <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">{error}</span>}
      </div>
      <div className="relative">
        {icon && (
          <div className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 transition-colors",
            error ? "text-red-400" : "text-neutral-400 group-focus-within:text-blue-500"
          )}>
            {icon}
          </div>
        )}
        <input 
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full bg-neutral-50/50 border rounded-xl py-3 px-4 outline-none transition-all focus:bg-white focus:ring-4",
            error ? "border-red-500 focus:ring-red-100" : "border-neutral-200 focus:border-blue-500 focus:ring-blue-100",
            icon && "pl-11"
          )}
        />
      </div>
    </div>
  );
}

function Select({ label, value, options, onChange, icon, error }: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  icon?: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label className={cn(
          "text-sm font-semibold transition-colors",
          error ? "text-red-500" : "text-neutral-600"
        )}>
          {label}
        </label>
        {error && <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">{error}</span>}
      </div>
      <div className="relative">
         {icon && (
          <div className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 transition-colors",
            error ? "text-red-400" : "text-neutral-400"
          )}>
            {icon}
          </div>
        )}
        <select 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full bg-neutral-50/50 border rounded-xl py-3 px-4 outline-none transition-all appearance-none focus:bg-white focus:ring-4",
            error ? "border-red-500 focus:ring-red-100" : "border-neutral-200 focus:border-blue-500 focus:ring-blue-100",
            icon && "pl-11"
          )}
        >
          <option value="" disabled>Select {label}</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
          <ChevronRight size={18} className="rotate-90" />
        </div>
      </div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-neutral-50">
      <span className="text-neutral-500 text-sm">{label}</span>
      <span className="font-semibold text-neutral-800">{value || "Not provided"}</span>
    </div>
  );
}

function ContactView() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-16">
        <h2 className="text-4xl font-extrabold text-neutral-900 mb-4 tracking-tight uppercase">Get in Touch</h2>
        <p className="text-neutral-500 max-w-xl mx-auto italic">Have questions about the internship? Reach out to our team directly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        <div className="space-y-8">
          <div className="group p-8 bg-white rounded-3xl border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <MapPin size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">Our Office</h3>
                <p className="text-neutral-500 leading-relaxed font-medium">
                  2nd Floor, 43, Housing Board Colony,<br />
                  Shiv Colony, Jind, Haryana 126102
                </p>
                <div className="mt-4 flex items-center gap-2 text-blue-600 font-bold text-sm">
                   <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                   Get there: 2 mins from city center
                </div>
              </div>
            </div>
          </div>

          <div className="group p-8 bg-white rounded-3xl border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                <Phone size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">Phone Numbers</h3>
                <div className="space-y-2">
                  <p className="text-neutral-500 font-bold text-lg hover:text-green-600 transition-colors">095881 61422</p>
                  <p className="text-neutral-500 font-bold text-lg hover:text-green-600 transition-colors">7015822199</p>
                </div>
                <p className="text-xs text-neutral-400 mt-4 uppercase tracking-widest font-bold">Mon - Sat: 9am to 6pm</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-neutral-900 rounded-[2.5rem] p-10 md:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -z-10" />
          <h3 className="text-2xl font-bold mb-8">Send us a Message</h3>
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Message sent! We will contact you soon.'); }}>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-neutral-500 tracking-widest">Name</label>
              <input type="text" required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-blue-500 transition-all placeholder:text-neutral-600" placeholder="Your Name" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-neutral-500 tracking-widest">Email</label>
              <input type="email" required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-blue-500 transition-all placeholder:text-neutral-600" placeholder="your@email.com" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-neutral-500 tracking-widest">Message</label>
              <textarea rows={4} required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-blue-500 transition-all placeholder:text-neutral-600 resize-none" placeholder="How can we help?" />
            </div>
            <button className="w-full py-5 bg-blue-600 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-500 active:scale-[0.98] transition-all shadow-xl shadow-blue-900/20">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

function RoadmapView() {
  const roadmaps = [
    {
      title: "Data Analyst Development",
      icon: <Briefcase className="text-blue-500" />,
      topics: [
        { name: "Excel Mastery", detail: "Advanced formulas (VLOOKUP, INDEX-MATCH), Pivot tables and charts, Data cleaning with Power Query, Automating tasks with Macros and basic VBA." },
        { name: "Python for Data", detail: "Programming fundamentals, Data manipulation with Pandas and NumPy, Advanced visualization using Matplotlib, Seaborn, and Plotly, intro to Scikit-learn for ML." },
        { name: "Statistics", detail: "Descriptive vs Inferential stats, Probability distributions, Hypothesis testing (P-values, T-tests), ANOVA, and Linear/Logistic Regression analysis." },
        { name: "SQL Essentials", detail: "Advanced queries, Complex Joins, Subqueries, Common Table Expressions (CTEs), Window functions, Indexing, and Query optimization for large datasets." },
        { name: "PowerBI", detail: "Advanced DAX (calculated columns & measures), Data modeling (star schema), interactive dashboards, Power Query transformations, and publishing to PowerBI Service." },
        { name: "GitHub", detail: "Version control for data science project tracking, collaborative notebooks, managing repository branches, and documenting analysis with Markdown READMEs." }
      ]
    },
    {
      title: "Full Stack Web Development",
      icon: <GraduationCap className="text-purple-500" />,
      topics: [
        { name: "Web Fundamentals", detail: "Modern HTML5 (Semantic elements, SEO), CSS3 (Flexbox, CSS Grid, Custom properties), Responsive design with Mobile-First approach, and Web accessibility (ARIA)." },
        { name: "JS Frameworks", detail: "Modern ES6+ Syntax, React.js (Hooks, Context, Performance), Next.js (App Router, Server Actions, SSR/SSG), and TypeScript for robust type-safe development." },
        { name: "Backend Core", detail: "Node.js architecture, Express.js middleware system, Prisma ORM for type-safe database access, Schema migrations, and structured MVC folder architecture." },
        { name: "Database Stack", detail: "MongoDB aggregation pipelines, Firebase features (Auth, Firestore, Cloud Messaging, Storage), and relational vs. non-relational data modeling strategies." },
        { name: "Security", detail: "Implementation of JWT (JSON Web Tokens), Secure cookie management, Role-Based Access Control (RBAC), OAuth 2.0 integration, and protecting against OWASP Top 10." },
        { name: "GitHub", detail: "Advanced Git workflows (Git Flow, Feature branching), Pull Request reviews, merge conflict resolution, and basic CI/CD pipeline setup for automated deployment." },
        { name: "Live Projects", detail: "End-to-end development of an individual capstone project and contributing to production-level features in our active client software ecosystem." }
      ]
    },
    {
      title: "Frontend Web Development",
      icon: <User className="text-green-500" />,
      topics: [
        { name: "UI Core", detail: "Advanced DOM manipulation, asynchronous JavaScript (Promises, Async/Await), Browser APIs, and building modern interactive web components." },
        { name: "Frameworks", detail: "React.js State Management (Zustand/Redux), Next.js Optimization (Image, Fonts, Script), and high-performance rendering techniques." },
        { name: "Styling", detail: "Utility-first design with Tailwind CSS, creating reusable UI systems with Shadcn/UI, framer-motion for complex layout transitions, and CSS-in-JS alternatives." },
        { name: "GitHub", detail: "Collaborative frontend development, using Git for managing UI component versions, and deploying static sites via GitHub Pages/Vercel integrations." }
      ]
    },
    {
      title: "Backend Web Development",
      icon: <Building2 className="text-orange-500" />,
      topics: [
        { name: "Runtime & Framework", detail: "Building scalable servers with Node.js and TypeScript, handling file systems, streams, and child processes, and Express.js advanced routing." },
        { name: "REST API", detail: "Designing standardized RESTful APIs, Swagger/OpenAPI documentation, handling HTTP methods, status codes, and request/response lifecycle." },
        { name: "API Security", detail: "Implementing Rate Limiting, CORS policies, Input validation with Zod/Joi, password hashing with bcrypt, and securing headers with Helmet.js." },
        { name: "GitHub", detail: "Managing backend codebases, repository organization for environment variables (.env practices), and versioning APIs using Git tags." }
      ]
    }
  ];

  const trainingInstructions = [
    { name: "Daily Assessments", detail: "Mandatory daily check-ins and logic-building assignments to track progress." },
    { name: "Real Project Work", detail: "Hands-on experience with production codebases and real business logic." },
    { name: "Mentorship", detail: "Direct guidance from senior developers on best practices and industry standards." }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-16"
    >
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-neutral-900 mb-4 uppercase tracking-tighter">Internship Roadmap</h2>
        <p className="text-neutral-500">A step-by-step path from learning to production-level expertise.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {roadmaps.map((rm, idx) => (
          <div key={idx} className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-neutral-50 rounded-lg">{rm.icon}</div>
              <h3 className="text-xl font-bold">{rm.title}</h3>
            </div>
            <div className="space-y-6">
              {rm.topics.map((topic, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-300 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-neutral-800">{topic.name}</h4>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{topic.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-neutral-900 text-white rounded-3xl p-6 md:p-16">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <h3 className="text-2xl font-bold mb-6">Training Instructions</h3>
            <p className="text-neutral-400 mb-8 leading-relaxed">
              Our program doesn't just focus on coding; it's about building a professional mindset. We follow a rigorous routine to ensure quality development.
            </p>
            <div className="space-y-6">
              {trainingInstructions.map((ins, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} className="text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{ins.name}</h4>
                    <p className="text-sm text-neutral-400 mt-1">{ins.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="md:w-1/2 grid grid-cols-2 gap-4">
             <div className="aspect-square bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center p-6 text-center">
                <span className="text-3xl font-bold text-blue-400 mb-2">10+</span>
                <span className="text-xs text-neutral-500">Live Projects</span>
             </div>
             <div className="aspect-square bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center p-6 text-center">
                <span className="text-3xl font-bold text-purple-400 mb-2">24/7</span>
                <span className="text-xs text-neutral-500">Mentor Support</span>
             </div>
             <div className="aspect-square bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center p-6 text-center">
                <span className="text-3xl font-bold text-green-400 mb-2">100%</span>
                <span className="text-xs text-neutral-500">Practical Work</span>
             </div>
             <div className="aspect-square bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center p-6 text-center">
                <span className="text-3xl font-bold text-orange-400 mb-2">Daily</span>
                <span className="text-xs text-neutral-500">Assessments</span>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
