"use client";

import React, { useEffect, useMemo, useState } from "react";
import { CalendarCheck, Check, Clock3, RefreshCw, User, X } from "lucide-react";

type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";
type Leave = {
  id: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: LeaveStatus;
  reviewedAt?: string;
  createdAt: string;
  student: {
    id: string;
    fullName: string;
    phone: string;
    profileImage?: string;
    courseName: string;
    batchName?: string;
  };
};

const filters: Array<"ALL" | LeaveStatus> = ["ALL", "PENDING", "APPROVED", "REJECTED"];

export default function AdminLeavesPage() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [filter, setFilter] = useState<"ALL" | LeaveStatus>("PENDING");
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState("");
  const [message, setMessage] = useState("");

  const loadLeaves = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/leaves", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Could not load leave requests.");
      setLeaves(data.leaves);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load leave requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadLeaves();
  }, []);

  const reviewLeave = async (leaveId: string, status: "APPROVED" | "REJECTED") => {
    setReviewingId(leaveId);
    setMessage("");
    try {
      const response = await fetch("/api/admin/leaves", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leaveId, status }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Could not review leave request.");
      setLeaves((current) => current.map((leave) => (
        leave.id === leaveId ? { ...leave, status, reviewedAt: data.leave.reviewedAt } : leave
      )));
      setMessage(`Leave request ${status.toLowerCase()}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not review leave request.");
    } finally {
      setReviewingId("");
    }
  };

  const visibleLeaves = useMemo(
    () => leaves.filter((leave) => filter === "ALL" || leave.status === filter),
    [filter, leaves]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-wider text-blue-600">Administration</p>
          <h1 className="mt-1 flex items-center gap-3 text-3xl font-black text-slate-900">
            <CalendarCheck className="text-blue-600" /> Leave Requests
          </h1>
          <p className="mt-2 text-slate-500">View all student leave applications and approve or reject pending requests.</p>
        </div>
        <button onClick={loadLeaves} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {message && <p className="rounded-2xl bg-blue-50 p-4 text-sm font-bold text-blue-800">{message}</p>}

      <div className="flex flex-wrap gap-2">
        {filters.map((item) => {
          const count = item === "ALL" ? leaves.length : leaves.filter((leave) => leave.status === item).length;
          return (
            <button key={item} onClick={() => setFilter(item)} className={`rounded-full px-4 py-2 text-xs font-black transition ${filter === item ? "bg-blue-600 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"}`}>
              {item} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <p className="rounded-3xl border border-slate-200 bg-white p-8 text-center font-bold text-slate-500">Loading leave requests...</p>
      ) : visibleLeaves.length === 0 ? (
        <p className="rounded-3xl border border-slate-200 bg-white p-8 text-center font-bold text-slate-500">No {filter.toLowerCase()} leave requests.</p>
      ) : (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  {["Student", "Course / Batch", "Leave Dates", "Reason", "Applied On", "Status", "Actions"].map((heading) => (
                    <th key={heading} className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-500">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleLeaves.map((leave) => (
                  <tr key={leave.id} className="align-top hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-slate-400">
                          {leave.student.profileImage ? <img src={leave.student.profileImage} alt={leave.student.fullName} className="h-full w-full object-cover" /> : <User size={21} />}
                        </div>
                        <div>
                          <p className="font-black text-slate-900">{leave.student.fullName}</p>
                          <p className="text-xs font-semibold text-slate-500">{leave.student.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-slate-700">{leave.student.courseName}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-400">{leave.student.batchName || "No batch"}</p>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm font-bold text-slate-700">
                      <p>{leave.fromDate}</p>
                      <p className="mt-1 text-xs text-slate-400">to {leave.toDate}</p>
                    </td>
                    <td className="max-w-xs px-5 py-4">
                      <p className="text-sm font-semibold leading-6 text-slate-600">{leave.reason}</p>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-xs font-semibold text-slate-500">
                      {new Date(leave.createdAt).toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={leave.status} /></td>
                    <td className="px-5 py-4">
                      {leave.status === "PENDING" ? (
                        <div className="flex gap-2">
                          <button title="Approve leave" disabled={reviewingId === leave.id} onClick={() => reviewLeave(leave.id, "APPROVED")} className="inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white hover:bg-emerald-700 disabled:opacity-50">
                            <Check size={14} /> Approve
                          </button>
                          <button title="Reject leave" disabled={reviewingId === leave.id} onClick={() => reviewLeave(leave.id, "REJECTED")} className="inline-flex items-center justify-center gap-1 rounded-xl bg-red-600 px-3 py-2 text-xs font-black text-white hover:bg-red-700 disabled:opacity-50">
                            <X size={14} /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-slate-400">Reviewed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: LeaveStatus }) {
  const colors = status === "APPROVED" ? "bg-emerald-50 text-emerald-700" : status === "REJECTED" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700";
  return <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-black ${colors}`}><Clock3 size={13} /> {status}</span>;
}
