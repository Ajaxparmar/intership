"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, Award, CheckCircle2, Hash, Search, User } from "lucide-react";
import Header from "@/app/components/Header";

type VerifiedCertificate = {
  studentName: string;
  phone: string;
  certificateNo: string;
  certificateUrl: string;
  issuedAt?: string;
  createdAt: string;
};

function formatCertificateNo(value: string) {
  return value.toUpperCase();
}

function formatStudentName(value: string) {
  return value.replace(/\S+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

function isImageCertificate(url: string) {
  return /\.(png|jpe?g|webp|gif)$/i.test(url);
}

export default function VerifyCertificatePage() {
  const [certificateNo, setCertificateNo] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [certificate, setCertificate] = useState<VerifiedCertificate | null>(null);

  const verify = async () => {
    if (!certificateNo.trim() || !name.trim()) {
      setError("Enter certificate number and student name.");
      return;
    }

    setLoading(true);
    setError("");
    setCertificate(null);

    try {
      const params = new URLSearchParams({ certificateNo: certificateNo.trim(), name: name.trim() });
      const response = await fetch(`/api/verify-certificate?${params.toString()}`);
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Certificate could not be verified.");
      setCertificate(data.certificate);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Certificate could not be verified.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") void verify();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header active="verify-certificate" />

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[420px_1fr] lg:py-16">
        <section>
          <p className="text-sm font-black uppercase tracking-wider text-blue-600">Certificate Verification</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Verify a CodeScaler certificate</h1>
          <p className="mt-4 text-base leading-7 text-slate-500">
            Enter the certificate number and the student name exactly as printed on the certificate.
          </p>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <Input icon={<Hash size={18} />} label="Certificate Number" value={certificateNo} onChange={(value) => setCertificateNo(formatCertificateNo(value))} onKeyDown={handleKeyDown} autoCapitalize="characters" />
              <Input icon={<User size={18} />} label="Student Name" value={name} onChange={(value) => setName(formatStudentName(value))} onKeyDown={handleKeyDown} autoCapitalize="words" />

              <AnimatePresence>
                {error && (
                  <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">
                    <AlertCircle size={18} />
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <button onClick={verify} disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-black text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700 disabled:opacity-60">
                {loading ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Verify Certificate
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          <AnimatePresence mode="wait">
            {certificate ? (
              <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 size={34} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-600">Verified Certificate</p>
                    <h2 className="mt-1 text-2xl font-black text-slate-950">{certificate.studentName}</h2>
                  </div>
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <Info label="Certificate Number" value={certificate.certificateNo} />
                  <Info label="Phone Number" value={certificate.phone} />
                </div>

                <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                  {isImageCertificate(certificate.certificateUrl) ? (
                    <img src={certificate.certificateUrl} alt={`${certificate.studentName} certificate`} className="max-h-[620px] w-full object-contain" />
                  ) : (
                    <iframe src={certificate.certificateUrl} title="Verified certificate" className="aspect-[1123/794] w-full" />
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex min-h-[480px] flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
                  <Award size={38} />
                </div>
                <h2 className="mt-5 text-2xl font-black text-slate-900">Certificate result appears here</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  A verified certificate will show the student details and uploaded certificate file.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}

function Input({ label, value, onChange, onKeyDown, icon, autoCapitalize }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  icon: React.ReactNode;
  autoCapitalize?: React.InputHTMLAttributes<HTMLInputElement>["autoCapitalize"];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          autoCapitalize={autoCapitalize}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 pl-10 text-sm outline-none focus:border-blue-500 focus:bg-white"
        />
      </div>
    </label>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 break-words text-base font-black text-slate-900">{value}</p>
    </div>
  );
}
