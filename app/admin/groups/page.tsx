"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { UserPlus, Users } from "lucide-react";

type Person = { id: string; fullName: string; phone: string; courseName?: string; groupId?: string };
type StudentPerson = Person & { user?: { role: "ADMIN" | "STUDENT" | "TEAMLEAD" } };
type Group = { id: string; name: string; description?: string; teamLead: Person; students: Person[] };

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [teamLeads, setTeamLeads] = useState<Person[]>([]);
  const [students, setStudents] = useState<StudentPerson[]>([]);
  const [account, setAccount] = useState({ fullName: "", phone: "", email: "", password: "", role: "ADMIN" });
  const [group, setGroup] = useState({ name: "", description: "", teamLeadId: "" });
  const [message, setMessage] = useState("");

  const load = async () => {
    const res = await fetch("/api/admin/groups");
    const data = await res.json();
    if (data.success) {
      setGroups(data.groups);
      setTeamLeads(data.teamLeads);
      setStudents(data.students);
    }
  };

  useEffect(() => { load(); }, []);

  const createAccount = async (event: FormEvent) => {
    event.preventDefault();
    const res = await fetch("/api/admin/users", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(account),
    });
    const data = await res.json();
    setMessage(data.success ? `${data.user.role} account created.` : data.error);
    if (data.success) {
      setAccount({ fullName: "", phone: "", email: "", password: "", role: "ADMIN" });
      await load();
    }
  };

  const createGroup = async (event: FormEvent) => {
    event.preventDefault();
    const res = await fetch("/api/admin/groups", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(group),
    });
    const data = await res.json();
    setMessage(data.success ? "Group created." : data.error);
    if (data.success) {
      setGroup({ name: "", description: "", teamLeadId: "" });
      await load();
    }
  };

  const assign = async (studentId: string, groupId: string) => {
    await fetch("/api/admin/groups", {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ studentId, groupId }),
    });
    await load();
  };

  const assignRole = async (studentId: string, role: "STUDENT" | "TEAMLEAD") => {
    const res = await fetch("/api/admin/users", {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ studentId, role }),
    });
    const data = await res.json();
    setMessage(data.success ? `Student role changed to ${role}.` : data.error);
    if (data.success) await load();
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-black uppercase tracking-wider text-blue-600">Administration</p>
        <h1 className="text-3xl font-black">Groups & Team Leads</h1>
        <p className="mt-1 text-slate-500">Promote students to team lead, create groups, and assign students.</p>
      </div>

      {message && <p className="rounded-2xl bg-blue-50 p-4 text-sm font-bold text-blue-800">{message}</p>}

      <div className="grid gap-6 xl:grid-cols-2">
        <form onSubmit={createAccount} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-black"><UserPlus size={20} /> Create Admin Account</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Full Name" value={account.fullName} onChange={(v) => setAccount({ ...account, fullName: v })} required />
            <Input label="Phone" value={account.phone} onChange={(v) => setAccount({ ...account, phone: v })} required />
            <Input label="Email" value={account.email} onChange={(v) => setAccount({ ...account, email: v })} />
            <Input label="Password" type="password" value={account.password} onChange={(v) => setAccount({ ...account, password: v })} required />
          </div>
          <button className="w-full rounded-xl bg-slate-900 py-3 font-black text-white">Create Admin Account</button>
        </form>

        <form onSubmit={createGroup} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-black"><Users size={20} /> Create Group</h2>
          <Input label="Group Name" value={group.name} onChange={(v) => setGroup({ ...group, name: v })} required />
          <Input label="Description" value={group.description} onChange={(v) => setGroup({ ...group, description: v })} />
          <label className="block text-xs font-black uppercase tracking-wide text-slate-500">
            Team Lead
            <select required value={group.teamLeadId} onChange={(e) => setGroup({ ...group, teamLeadId: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm normal-case text-slate-900">
              <option value="">Select team lead</option>
              {teamLeads.map((lead) => <option key={lead.id} value={lead.id}>{lead.fullName} - {lead.phone}</option>)}
            </select>
          </label>
          <button className="w-full rounded-xl bg-blue-600 py-3 font-black text-white">Create Group</button>
        </form>
      </div>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5"><h2 className="text-xl font-black">Student Assignments</h2></div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50"><tr>{["Student", "Course", "Role", "Group"].map((h) => <th key={h} className="px-5 py-4 text-left text-xs font-black uppercase text-slate-500">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="px-5 py-4"><p className="font-black">{student.fullName}</p><p className="text-xs text-slate-500">{student.phone}</p></td>
                  <td className="px-5 py-4 text-sm font-bold text-slate-600">{student.courseName}</td>
                  <td className="px-5 py-4">
                    <select value={student.user?.role || "STUDENT"} onChange={(e) => assignRole(student.id, e.target.value as "STUDENT" | "TEAMLEAD")} className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm font-bold">
                      <option value="STUDENT">Student</option>
                      <option value="TEAMLEAD">Team Lead</option>
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <select value={student.groupId || ""} onChange={(e) => assign(student.id, e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm font-bold">
                      <option value="">Unassigned</option>
                      {groups.map((item) => <option key={item.id} value={item.id}>{item.name} - {item.teamLead.fullName}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return <label className="block text-xs font-black uppercase tracking-wide text-slate-500">{label}<input required={required} type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm normal-case text-slate-900" /></label>;
}
