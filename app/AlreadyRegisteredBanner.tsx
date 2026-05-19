"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import { X, CreditCard, Search, QrCode, Info } from "lucide-react";

type Step = "lookup" | "details" | "qr";

interface RegistrationData {
  name: string;
  phone: string;
  rollNo: string;
  collegeName: string;
  domain: string;
  duration: string;
  paymentStatus: string;
}

export default function AlreadyRegisteredBanner() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("lookup");
  const [phone, setPhone] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<RegistrationData | null>(null);

  const FEE = 4999;
  const UPI = `upi://pay?pa=q566002417@ybl&pn=CodeScaler&am=${FEE}&cu=INR&tn=InternshipFee`;

  const handleLookup = async () => {
    if (!phone.trim() && !rollNo.trim()) {
      setError("Enter your phone number or roll number");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), rollNo: rollNo.trim() }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || "Not found"); return; }
      setData(json.data);
      setStep("details");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const close = () => { setOpen(false); setStep("lookup"); setError(""); setPhone(""); setRollNo(""); };

  return (
    <>
      {/* Banner */}
      <div className="flex items-center justify-between gap-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl mb-8 flex-wrap">
        <div className="flex items-center gap-3">
          <Info size={20} className="text-amber-600 shrink-0" />
          <div>
            <p className="text-sm font-bold text-amber-800">Already registered?</p>
            <p className="text-xs text-amber-700">Pay your internship fee to confirm your seat.</p>
          </div>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white rounded-xl font-bold text-sm hover:bg-amber-700 transition-all"
        >
          <CreditCard size={16} />
          Pay fee
        </button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
              onClick={close}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Step 1 — Lookup */}
              {step === "lookup" && (
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-xl font-bold">Find your registration</h2>
                      <p className="text-sm text-neutral-500 mt-1">Enter your phone or roll number</p>
                    </div>
                    <button onClick={close} className="p-1 text-neutral-400 hover:text-neutral-600"><X size={20} /></button>
                  </div>
                  <div className="space-y-3 mb-4">
                    <input
                      type="tel" placeholder="Phone number" value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                    <p className="text-xs text-center text-neutral-400">or</p>
                    <input
                      type="text" placeholder="Roll number" value={rollNo}
                      onChange={e => setRollNo(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleLookup()}
                      className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                  {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
                  <button
                    onClick={handleLookup} disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
                  >
                    <Search size={16} />
                    {loading ? "Searching…" : "Find my registration"}
                  </button>
                </div>
              )}

              {/* Step 2 — Details */}
              {step === "details" && data && (
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold">Registration found</h2>
                      <span className="text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                        Payment pending
                      </span>
                    </div>
                    <button onClick={close} className="p-1 text-neutral-400 hover:text-neutral-600"><X size={20} /></button>
                  </div>

                  <div className="bg-neutral-50 rounded-2xl p-4 mb-4 space-y-2">
                    {[
                      ["Name", data.name],
                      ["Phone", data.phone],
                      ["Roll no.", data.rollNo],
                      ["College", data.collegeName],
                      ["Domain", data.domain],
                      ["Duration", data.duration],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between text-sm py-1.5 border-b border-neutral-100 last:border-0">
                        <span className="text-neutral-500">{label}</span>
                        <span className="font-semibold text-neutral-800">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between bg-neutral-900 text-white rounded-2xl px-5 py-4 mb-5">
                    <div>
                      <p className="text-xs text-neutral-400 mb-0.5">Internship fee</p>
                      <p className="text-2xl font-bold">₹4,999</p>
                    </div>
                    <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full font-bold">GST incl.</span>
                  </div>

                  <button
                    onClick={() => setStep("qr")}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
                  >
                    <QrCode size={16} />
                    Pay now — ₹4,999
                  </button>
                  <button onClick={() => setStep("lookup")} className="w-full py-2.5 mt-2 text-sm text-neutral-400 hover:text-neutral-600">
                    Go back
                  </button>
                </div>
              )}

              {/* Step 3 — QR */}
              {step === "qr" && (
                <div className="p-8 text-center">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Scan to pay</h2>
                    <button onClick={close} className="p-1 text-neutral-400 hover:text-neutral-600"><X size={20} /></button>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-neutral-100 inline-block mb-4">
                    <QRCodeSVG value={UPI} size={200} />
                  </div>
                  <p className="text-2xl font-bold mb-1">₹4,999</p>
                  <p className="text-xs text-neutral-400 mb-5">UPI · PhonePe · GPay · Paytm</p>

                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-left mb-4">
                    <p className="text-xs font-bold text-blue-700 mb-1">After payment</p>
                    <p className="text-xs text-blue-600">
                      Share your payment screenshot to <strong>8572892552</strong> on WhatsApp to confirm your seat.
                    </p>
                  </div>

                  
                    <a href="https://wa.me/918572892552" target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all"
                  >
                    Share screenshot on WhatsApp
                  </a>
                  <button onClick={() => setStep("details")} className="w-full py-2.5 mt-2 text-sm text-neutral-400 hover:text-neutral-600">
                    Back to details
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}