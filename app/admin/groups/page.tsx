"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { ChevronDown, Pencil, User, UserPlus, Users, X } from "lucide-react";

type Person = { id: string; fullName: string; phone: string; courseName?: string; groupId?: string; profileImage?: string };
type Group = { id: string; name: string; description?: string; teamLead?: Person; students: Person[] };

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [teamLeads, setTeamLeads] = useState<Person[]>([]);
  const [account, setAccount] = useState({ fullName: "", phone: "", email: "", password: "", role: "ADMIN" });
  const [group, setGroup] = useState({ name: "", description: "", teamLeadId: "" });
  const [message, setMessage] = useState("");
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editGroup, setEditGroup] = useState({ name: "", description: "", teamLeadId: "" });

  const load = async () => {
    const res = await fetch("/api/admin/groups");
    const data = await res.json();
    if (data.success) {
      setGroups(data.groups);
      setTeamLeads(data.teamLeads);
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

  const startEditing = (item: Group) => {
    setOpenGroupId(item.id);
    setEditingGroupId(item.id);
    setEditGroup({ name: item.name, description: item.description || "", teamLeadId: item.teamLead?.id || "" });
  };

  const updateGroup = async (event: FormEvent) => {
    event.preventDefault();
    if (!editingGroupId) return;
    const res = await fetch("/api/admin/groups", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "editGroup", groupId: editingGroupId, ...editGroup }),
    });
    const data = await res.json();
    setMessage(data.success ? "Group updated." : data.error);
    if (data.success) {
      setEditingGroupId(null);
      await load();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-black uppercase tracking-wider text-blue-600">Administration</p>
        <h1 className="text-3xl font-black">Groups & Team Leads</h1>
        <p className="mt-1 text-slate-500">Create groups, select team leads, and view group members.</p>
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
            <select value={group.teamLeadId} onChange={(e) => setGroup({ ...group, teamLeadId: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm normal-case text-slate-900">
              <option value="">No team lead</option>
              {teamLeads.map((lead) => <option key={lead.id} value={lead.id}>{lead.fullName} - {lead.phone}</option>)}
            </select>
          </label>
          <button className="w-full rounded-xl bg-blue-600 py-3 font-black text-white">Create Group</button>
        </form>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-black">Added Groups</h2>
          <p className="text-sm text-slate-500">Click a group to view its students.</p>
        </div>
        {groups.length === 0 && <p className="rounded-3xl border border-slate-200 bg-white p-6 text-center font-bold text-slate-500">No groups added yet.</p>}
        <div className="grid gap-4 lg:grid-cols-2">
          {groups.map((item) => {
            const isOpen = openGroupId === item.id;
            return (
              <article key={item.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <button type="button" onClick={() => setOpenGroupId(isOpen ? null : item.id)} className="flex w-full items-center justify-between gap-4 p-5 text-left hover:bg-slate-50">
                  <div>
                    <h3 className="text-lg font-black">{item.name}</h3>
                    <p className="text-sm font-semibold text-slate-500">{item.students.length} student{item.students.length === 1 ? "" : "s"} · {item.teamLead?.fullName || "No team lead"}</p>
                    {item.description && <p className="mt-1 text-xs text-slate-400">{item.description}</p>}
                  </div>
                  <ChevronDown size={20} className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="space-y-4 border-t border-slate-100 p-5">
                    {editingGroupId === item.id ? (
                      <form onSubmit={updateGroup} className="space-y-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                        <Input label="Group Name" value={editGroup.name} onChange={(value) => setEditGroup({ ...editGroup, name: value })} required />
                        <Input label="Description" value={editGroup.description} onChange={(value) => setEditGroup({ ...editGroup, description: value })} />
                        <label className="block text-xs font-black uppercase tracking-wide text-slate-500">
                          Team Lead
                          <select value={editGroup.teamLeadId} onChange={(event) => setEditGroup({ ...editGroup, teamLeadId: event.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm normal-case text-slate-900">
                            <option value="">No team lead</option>
                            {teamLeads.map((lead) => <option key={lead.id} value={lead.id}>{lead.fullName} - {lead.phone}</option>)}
                          </select>
                        </label>
                        <div className="flex gap-2">
                          <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-black text-white"><Pencil size={15} /> Save Group</button>
                          <button type="button" onClick={() => setEditingGroupId(null)} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-black text-slate-600"><X size={15} /> Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <button type="button" onClick={() => startEditing(item)} className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-black text-blue-700 hover:bg-blue-100">
                        <Pencil size={15} /> Edit Group
                      </button>
                    )}
                    <div className="grid gap-3 sm:grid-cols-2">
                      {item.students.map((student) => (
                        <div key={student.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-100 text-blue-600">
                            {student.profileImage ? <img src={student.profileImage} alt={student.fullName} className="h-full w-full object-cover" /> : <User size={20} />}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-black">{student.fullName}</p>
                            <p className="truncate text-xs text-slate-500">{student.courseName || student.phone}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {item.students.length === 0 && <p className="rounded-2xl bg-slate-50 p-4 text-center text-sm font-bold text-slate-500">No students assigned to this group.</p>}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

    </div>
  );
}

function Input({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return <label className="block text-xs font-black uppercase tracking-wide text-slate-500">{label}<input required={required} type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm normal-case text-slate-900" /></label>;
}
