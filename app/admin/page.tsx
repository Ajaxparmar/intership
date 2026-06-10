"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, CalendarDays, IndianRupee, LayoutDashboard, RefreshCw, UserRoundCog, Users } from "lucide-react";

type Metrics = {
  totalCollection: number;
  totalRegistrations: number;
  totalGroups: number;
  totalCourses: number;
  totalBatches: number;
};

const initialMetrics: Metrics = {
  totalCollection: 0,
  totalRegistrations: 0,
  totalGroups: 0,
  totalCourses: 0,
  totalBatches: 0,
};

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState(initialMetrics);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMetrics = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/dashboard", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Could not load dashboard.");
      setMetrics(data.metrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMetrics();
  }, []);

  const cards = [
    {
      label: "Total Collection",
      value: `₹${metrics.totalCollection.toLocaleString("en-IN")}`,
      description: "Fees received from all students",
      icon: IndianRupee,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Total Registrations",
      value: metrics.totalRegistrations.toLocaleString("en-IN"),
      description: "Registered student accounts",
      icon: Users,
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Total Groups",
      value: metrics.totalGroups.toLocaleString("en-IN"),
      description: "Active student groups",
      icon: UserRoundCog,
      color: "bg-purple-50 text-purple-700",
    },
    {
      label: "Total Courses",
      value: metrics.totalCourses.toLocaleString("en-IN"),
      description: "Distinct registered courses",
      icon: BookOpen,
      color: "bg-amber-50 text-amber-700",
    },
    {
      label: "Total Batches",
      value: metrics.totalBatches.toLocaleString("en-IN"),
      description: "Created training batches",
      icon: CalendarDays,
      color: "bg-cyan-50 text-cyan-700",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-wider text-blue-600">Overview</p>
          <h1 className="mt-1 flex items-center gap-3 text-3xl font-black text-slate-900">
            <LayoutDashboard className="text-blue-600" /> Dashboard
          </h1>
          <p className="mt-2 text-slate-500">A quick overview of registrations, collections, groups, and courses.</p>
        </div>
        <button
          onClick={loadMetrics}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && <p className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p>}

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.color}`}>
                <Icon size={22} />
              </div>
              <p className="mt-5 text-xs font-black uppercase tracking-wider text-slate-400">{card.label}</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{loading ? "..." : card.value}</p>
              <p className="mt-2 text-sm font-semibold text-slate-500">{card.description}</p>
            </article>
          );
        })}
      </section>

      <section className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-600 to-indigo-700 p-7 text-white shadow-lg shadow-blue-100">
        <h2 className="text-xl font-black">Quick Actions</h2>
        <p className="mt-1 text-sm text-blue-100">Continue with the most common administration tasks.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/admin/students/register" className="rounded-xl bg-white px-4 py-2.5 text-sm font-black text-blue-700">Register Student</Link>
          <Link href="/admin/batches/add" className="rounded-xl bg-blue-500/50 px-4 py-2.5 text-sm font-black text-white ring-1 ring-white/30">Add Batch</Link>
          <Link href="/admin/students" className="rounded-xl bg-blue-500/50 px-4 py-2.5 text-sm font-black text-white ring-1 ring-white/30">Manage Students</Link>
          <Link href="/admin/groups" className="rounded-xl bg-blue-500/50 px-4 py-2.5 text-sm font-black text-white ring-1 ring-white/30">Manage Groups</Link>
          <Link href="/admin/leaves" className="rounded-xl bg-blue-500/50 px-4 py-2.5 text-sm font-black text-white ring-1 ring-white/30">Review Leave Requests</Link>
        </div>
      </section>
    </div>
  );
}
