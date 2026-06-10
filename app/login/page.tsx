"use client";

import React, { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import { CalendarCheck, Download, ExternalLink, FileText, GraduationCap, IndianRupee, Lock, LogOut, Phone, ShieldCheck, UserCog, Users } from "lucide-react";

type Attendance = { id: string; date: string; status: "PRESENT" | "ABSENT" | "LEAVE" };
type Leave = { id: string; fromDate: string; toDate: string; reason: string; status: string };
type Student = {
  id: string; fullName: string; phone: string; courseName: string; batchName?: string; totalFee: number; paidFee: number;
  profileImage?: string;
  attendance: Attendance[]; leaveRequests: Leave[];
  feeReceipts: { id: string; receiptNo: string; amount: number; paidOn: string; paymentMode?: string; receiptUrl?: string }[];
  offerLetters: { id: string; title: string; issueDate: string; letterUrl?: string }[];
  group?: { name: string; teamLead: { fullName: string; phone: string } };
};
type Group = { id: string; name: string; students: Student[] };
type Session = { id: string; fullName: string; phone: string; role: "ADMIN" | "STUDENT" | "TEAMLEAD"; student?: Student; leadGroups: Group[] };
type LoginRole = Session["role"];

const ROLE_SESSION_KEY = "codescaler-role-session";
const today = new Date().toISOString().slice(0, 10);
const roles: { value: LoginRole; label: string; description: string; icon: React.ReactNode }[] = [
  { value: "ADMIN", label: "Admin", description: "Manage students, fees, batches, and groups.", icon: <ShieldCheck size={24} /> },
  { value: "TEAMLEAD", label: "Team Lead", description: "Manage attendance and assigned students.", icon: <UserCog size={24} /> },
  { value: "STUDENT", label: "Student", description: "View attendance, fees, and documents.", icon: <GraduationCap size={24} /> },
];

export default function RoleLoginPage() {
  const [role, setRole] = useState<LoginRole | null>(null);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [restoringSession, setRestoringSession] = useState(true);
  const [attendanceDate, setAttendanceDate] = useState(today);
  const [leave, setLeave] = useState({ fromDate: "", toDate: "", reason: "" });
  const [leaveMessage, setLeaveMessage] = useState("");
  const [applyingLeave, setApplyingLeave] = useState(false);

  useEffect(() => {
    try {
      const savedSession = window.localStorage.getItem(ROLE_SESSION_KEY);
      if (savedSession) setSession(JSON.parse(savedSession));
    } catch {
      window.localStorage.removeItem(ROLE_SESSION_KEY);
    } finally {
      setRestoringSession(false);
    }
  }, []);

  const logout = () => {
    window.localStorage.removeItem(ROLE_SESSION_KEY);
    setSession(null);
    setRole(null);
    setPhone("");
    setPassword("");
    setError("");
  };

  const login = async (event?: FormEvent) => {
    event?.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");
      setSession(data.user);
      window.localStorage.setItem(ROLE_SESSION_KEY, JSON.stringify(data.user));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (studentId: string, status: Attendance["status"]) => {
    if (!session) return;
    const res = await fetch("/api/teamlead/attendance", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamLeadId: session.id, studentId, date: attendanceDate, status }),
    });
    if (res.ok) await login();
  };

  const reviewLeave = async (leaveId: string, status: "APPROVED" | "REJECTED") => {
    const res = await fetch("/api/student/leave", {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leaveId, status }),
    });
    if (res.ok) await login();
  };

  const applyLeave = async (event: FormEvent) => {
    event.preventDefault();
    if (!session?.student) return;
    setApplyingLeave(true);
    setLeaveMessage("");
    try {
      const res = await fetch("/api/student/leave", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: session.student.id, ...leave }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not apply for leave.");

      const updatedSession = {
        ...session,
        student: {
          ...session.student,
          leaveRequests: [data.leave, ...session.student.leaveRequests],
        },
      };
      setSession(updatedSession);
      window.localStorage.setItem(ROLE_SESSION_KEY, JSON.stringify(updatedSession));
      setLeave({ fromDate: "", toDate: "", reason: "" });
      setLeaveMessage("Leave request submitted successfully.");
    } catch (error) {
      setLeaveMessage(error instanceof Error ? error.message : "Could not apply for leave.");
    } finally {
      setApplyingLeave(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header active="role-login" />
      <main className="mx-auto max-w-7xl px-4 py-10">
        {restoringSession ? (
          <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center font-bold text-slate-500 shadow-xl shadow-slate-200/70">
            Restoring your session...
          </div>
        ) : !session ? (
          <form onSubmit={login} className="mx-auto max-w-2xl space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><ShieldCheck size={30} /></div>
              <h1 className="text-3xl font-black">Welcome Back</h1>
              <p className="mt-2 text-sm text-slate-500">Select how you want to log in, then enter your account details.</p>
            </div>

            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">Login As</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {roles.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => { setRole(item.value); setError(""); }}
                    className={`rounded-2xl border p-4 text-left transition ${
                      role === item.value
                        ? "border-blue-600 bg-blue-50 text-blue-700 shadow-md shadow-blue-100"
                        : "border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-slate-50"
                    }`}
                  >
                    <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">{item.icon}</span>
                    <span className="block font-black">{item.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">{item.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input icon={<Phone size={16} />} label="Phone Number" value={phone} onChange={setPhone} />
              <Input icon={<Lock size={16} />} label="Password" type="password" value={password} onChange={setPassword} />
            </div>
            {error && <p className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
            <button disabled={loading || !role} className="w-full rounded-2xl bg-blue-600 py-3 font-black text-white disabled:cursor-not-allowed disabled:opacity-50">
              {loading ? "Logging in..." : role ? `Login as ${roles.find((item) => item.value === role)?.label}` : "Select a role to continue"}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <section className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-blue-50 text-blue-600">
                  {session.student?.profileImage ? (
                    <img src={session.student.profileImage} alt={`${session.fullName} profile`} className="h-full w-full object-cover" />
                  ) : (
                    <GraduationCap size={32} />
                  )}
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-blue-600">{session.role}</p>
                  <h1 className="text-3xl font-black">{session.fullName}</h1>
                  <p className="text-sm text-slate-500">{session.phone}</p>
                </div>
              </div>
              <button onClick={logout} className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-5 py-3 font-black text-red-600 transition hover:bg-red-100">
                <LogOut size={17} /> Logout
              </button>
            </section>

            {session.role === "ADMIN" && (
              <section className="rounded-3xl border border-blue-100 bg-blue-50 p-8 text-center">
                <ShieldCheck size={40} className="mx-auto text-blue-600" />
                <h2 className="mt-3 text-2xl font-black">Admin Dashboard</h2>
                <p className="mt-2 text-slate-600">Manage students, role accounts, groups, team leads, and batches.</p>
                <Link href="/admin" className="mt-5 inline-block rounded-2xl bg-blue-600 px-6 py-3 font-black text-white">Open Admin Panel</Link>
              </section>
            )}

            {session.role === "TEAMLEAD" && (
              <>
                <TeamLeadDashboard groups={session.leadGroups} attendanceDate={attendanceDate} setAttendanceDate={setAttendanceDate} markAttendance={markAttendance} reviewLeave={reviewLeave} />
                {session.student && <StudentDashboard student={session.student} leave={leave} setLeave={setLeave} applyLeave={applyLeave} leaveMessage={leaveMessage} applyingLeave={applyingLeave} />}
              </>
            )}

            {session.role === "STUDENT" && session.student && (
              <StudentDashboard student={session.student} leave={leave} setLeave={setLeave} applyLeave={applyLeave} leaveMessage={leaveMessage} applyingLeave={applyingLeave} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function TeamLeadDashboard({ groups, attendanceDate, setAttendanceDate, markAttendance, reviewLeave }: {
  groups: Group[]; attendanceDate: string; setAttendanceDate: (v: string) => void;
  markAttendance: (id: string, status: Attendance["status"]) => void; reviewLeave: (id: string, status: "APPROVED" | "REJECTED") => void;
}) {
  return <div className="space-y-6">
    <label className="flex items-center gap-3 rounded-2xl bg-white p-4 font-black shadow-sm"><CalendarCheck size={18} /> Attendance Date<input type="date" value={attendanceDate} onChange={(e) => setAttendanceDate(e.target.value)} className="rounded-xl border border-slate-200 p-2" /></label>
    {groups.length === 0 && <p className="rounded-2xl bg-white p-6 text-center font-bold text-slate-500">No group assigned.</p>}
    {groups.map((group) => <section key={group.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5"><h2 className="flex items-center gap-2 text-xl font-black"><Users size={20} /> {group.name}</h2></div>
      <div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-100"><tbody className="divide-y divide-slate-100">
        {group.students.map((student) => {
          const current = student.attendance.find((item) => item.date === attendanceDate);
          return <tr key={student.id}><td className="px-5 py-4"><p className="font-black">{student.fullName}</p><p className="text-xs text-slate-500">{student.courseName}</p></td>
            <td className="px-5 py-4"><div className="flex gap-2">{(["PRESENT", "ABSENT", "LEAVE"] as Attendance["status"][]).map((status) => <button key={status} onClick={() => markAttendance(student.id, status)} className={`rounded-xl border px-3 py-2 text-xs font-black ${current?.status === status ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-500"}`}>{status}</button>)}</div></td>
            <td className="px-5 py-4">{student.leaveRequests.map((item) => <div key={item.id} className="mb-2 rounded-xl bg-amber-50 p-3 text-xs"><p className="font-black">{item.fromDate} to {item.toDate}</p><p>{item.reason}</p><div className="mt-2 flex gap-2"><button onClick={() => reviewLeave(item.id, "APPROVED")} className="rounded-lg bg-emerald-600 px-2 py-1 font-black text-white">Approve</button><button onClick={() => reviewLeave(item.id, "REJECTED")} className="rounded-lg bg-red-600 px-2 py-1 font-black text-white">Reject</button></div></div>)}</td>
          </tr>;
        })}
      </tbody></table></div>
    </section>)}
  </div>;
}

function StudentDashboard({ student, leave, setLeave, applyLeave, leaveMessage, applyingLeave }: { student: Student; leave: { fromDate: string; toDate: string; reason: string }; setLeave: (v: { fromDate: string; toDate: string; reason: string }) => void; applyLeave: (e: FormEvent) => void; leaveMessage: string; applyingLeave: boolean }) {
  return <div className="grid gap-6 lg:grid-cols-2">
    <Card title="Course & Group" icon={<Users size={20} />}><Info label="Course" value={student.courseName} /><Info label="Batch" value={student.batchName || "Not assigned"} /><Info label="Group" value={student.group?.name || "Not assigned"} /><Info label="Team Lead" value={student.group?.teamLead.fullName || "Not assigned"} /></Card>
    <Card title="Fee Information" icon={<IndianRupee size={20} />}><Info label="Total Fee" value={`₹${student.totalFee}`} /><Info label="Paid Fee" value={`₹${student.paidFee}`} /><Info label="Due Fee" value={`₹${Math.max(0, student.totalFee - student.paidFee)}`} /></Card>
    <Card title="Apply for Leave" icon={<CalendarCheck size={20} />}><form onSubmit={applyLeave} className="space-y-3"><div className="grid grid-cols-2 gap-3"><Input label="From Date" type="date" value={leave.fromDate} onChange={(v) => setLeave({ ...leave, fromDate: v })} /><Input label="To Date" type="date" value={leave.toDate} onChange={(v) => setLeave({ ...leave, toDate: v })} /></div><Input label="Reason" value={leave.reason} onChange={(v) => setLeave({ ...leave, reason: v })} />{leaveMessage && <p className={`rounded-xl p-3 text-sm font-bold ${leaveMessage.includes("successfully") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{leaveMessage}</p>}<button disabled={applyingLeave} className="w-full rounded-xl bg-blue-600 py-3 font-black text-white disabled:opacity-50">{applyingLeave ? "Applying..." : "Apply Leave"}</button></form><div className="mt-4 space-y-2">{student.leaveRequests.map((item) => <p key={item.id} className="rounded-xl bg-slate-50 p-3 text-sm font-bold">{item.fromDate} to {item.toDate}: {item.status}</p>)}</div></Card>
    <Card title="Attendance" icon={<CalendarCheck size={20} />}><div className="max-h-72 space-y-2 overflow-y-auto">{student.attendance.map((item) => <div key={item.id} className="flex justify-between rounded-xl bg-slate-50 p-3 text-sm font-bold"><span>{item.date}</span><span>{item.status}</span></div>)}</div></Card>
    <Card title="Fee Receipts" icon={<FileText size={20} />}><div className="space-y-2">{student.feeReceipts.map((item) => <div key={item.id} className="rounded-xl border border-slate-200 p-3"><p className="font-black">{item.receiptNo} • ₹{item.amount}</p><p className="text-xs text-slate-500">{item.paidOn} {item.paymentMode ? `• ${item.paymentMode}` : ""}</p><DocumentActions viewUrl={item.receiptUrl || `/documents/fee-receipt/${item.id}`} downloadUrl={`/api/documents/fee-receipt/${item.id}/download`} /></div>)}</div></Card>
    <Card title="Offer Letters" icon={<FileText size={20} />}><div className="space-y-2">{student.offerLetters.map((item) => <div key={item.id} className="rounded-xl border border-slate-200 p-3"><p className="font-black">{item.title}</p><p className="text-xs text-slate-500">{item.issueDate}</p><DocumentActions viewUrl={item.letterUrl || `/documents/offer-letter/${item.id}`} downloadUrl={`/api/documents/offer-letter/${item.id}/download`} /></div>)}</div></Card>
  </div>;
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) { return <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="mb-5 flex items-center gap-2 text-xl font-black">{icon}{title}</h2>{children}</section>; }
function DocumentActions({ viewUrl, downloadUrl }: { viewUrl: string; downloadUrl: string }) { return <div className="mt-2 flex gap-3"><a href={viewUrl} target="_blank" className="inline-flex items-center gap-1 text-sm font-black text-blue-600"><ExternalLink size={14} /> View</a><a href={downloadUrl} className="inline-flex items-center gap-1 text-sm font-black text-blue-600"><Download size={14} /> Download</a></div>; }
function Info({ label, value }: { label: string; value: string }) { return <div className="mb-2 flex justify-between rounded-xl bg-slate-50 p-3 text-sm"><span className="font-bold text-slate-500">{label}</span><span className="font-black">{value}</span></div>; }
function Input({ label, value, onChange, type = "text", icon }: { label: string; value: string; onChange: (v: string) => void; type?: string; icon?: React.ReactNode }) { return <label className="block text-xs font-black uppercase text-slate-500">{label}<div className="relative mt-1.5">{icon && <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>}<input required type={type} value={value} onChange={(e) => onChange(e.target.value)} className={`w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm normal-case text-slate-900 ${icon ? "pl-9" : ""}`} /></div></label>; }
