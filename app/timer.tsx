"use client";

import { useState, useEffect } from "react";

const DEADLINE = new Date("2026-05-01T23:59:59");
const BATCH_START = new Date("2026-04-01T00:00:00");
const TOTAL_MS = DEADLINE.getTime() - BATCH_START.getTime();

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function CountdownTimer() {
  const [diff, setDiff] = useState<number | null>(null);

  useEffect(() => {
    // Set initial value client-side to avoid hydration mismatch
    setDiff(DEADLINE.getTime() - Date.now());
    const id = setInterval(() => {
      setDiff(DEADLINE.getTime() - Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Render nothing on server (avoids hydration mismatch)
  if (diff === null) return null;

  const expired = diff <= 0;
  const isUrgent = diff < 86_400_000;
  const isVeryUrgent = diff < 3_600_000;

  const d = Math.max(0, Math.floor(diff / 86_400_000));
  const h = Math.max(0, Math.floor((diff % 86_400_000) / 3_600_000));
  const m = Math.max(0, Math.floor((diff % 3_600_000) / 60_000));
  const s = Math.max(0, Math.floor((diff % 60_000) / 1_000));

  const progressPct = Math.min(
    100,
    Math.max(0, ((Date.now() - BATCH_START.getTime()) / TOTAL_MS) * 100)
  );

  const blockClass = `flex flex-col items-center justify-center w-20 py-4
    rounded-2xl border transition-colors duration-500
    ${isUrgent
      ? "border-red-300 bg-red-50 text-red-600"
      : "border-neutral-200 bg-white text-neutral-900"
    }`;

  const labelClass = `text-[10px] uppercase tracking-widest mt-1
    ${isUrgent ? "text-red-400" : "text-neutral-400"}`;

  const getMessage = () => {
    if (expired) return null;
    if (isVeryUrgent)
      return (
        <span className="text-red-500 animate-pulse font-bold">
          ⚑ Last chance — submit your application now!
        </span>
      );
    if (isUrgent)
      return (
        <span className="text-red-500">
          Running out — only {h}h {m}m left
        </span>
      );
    if (d <= 2)
      return (
        <span className="text-amber-600">
          Only {d} day{d > 1 ? "s" : ""} left — don't miss out
        </span>
      );
    return (
      <span className="text-neutral-400">
        {d} day{d > 1 ? "s" : ""} remaining to secure your seat
      </span>
    );
  };

  if (expired) {
    return (
      <div className="text-center py-6 space-y-1">
        <p className="text-lg font-bold text-neutral-800">
          Applications closed
        </p>
        <p className="text-sm text-neutral-400">
          This batch is no longer accepting submissions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Label */}
      <div className="text-center">
        <p className="text-[11px] uppercase tracking-widest text-neutral-400 font-bold">
          Applications close
        </p>
        <p className="text-sm font-semibold text-neutral-600 mt-0.5">
          Thursday, 1 May 2026 · Midnight
        </p>
      </div>

      {/* Blocks */}
      <div className="flex items-center justify-center gap-2">
        <div className={blockClass}>
          <span className="text-3xl font-bold tabular-nums leading-none">{pad(d)}</span>
          <span className={labelClass}>Days</span>
        </div>
        <span className="text-xl text-neutral-300 pb-4">:</span>
        <div className={blockClass}>
          <span className="text-3xl font-bold tabular-nums leading-none">{pad(h)}</span>
          <span className={labelClass}>Hours</span>
        </div>
        <span className="text-xl text-neutral-300 pb-4">:</span>
        <div className={blockClass}>
          <span className="text-3xl font-bold tabular-nums leading-none">{pad(m)}</span>
          <span className={labelClass}>Mins</span>
        </div>
        <span className="text-xl text-neutral-300 pb-4">:</span>
        <div className={blockClass}>
          <span className="text-3xl font-bold tabular-nums leading-none">{pad(s)}</span>
          <span className={labelClass}>Secs</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="max-w-xs mx-auto">
        <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-400 rounded-full transition-all duration-1000"
            style={{ width: `${progressPct.toFixed(2)}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-neutral-300 mt-1">
          <span>Batch opened</span>
          <span>1 May deadline</span>
        </div>
      </div>

      {/* Message */}
      <p className="text-center text-sm font-semibold">{getMessage()}</p>
    </div>
  );
}
