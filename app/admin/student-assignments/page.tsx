"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Filter, Search, User, UserRoundCog, X } from "lucide-react";

type Student = {
  id: string;
  fullName: string;
  phone: string;
  courseName?: string;
  profileImage?: string;
  groupId?: string;
  user?: { role: "ADMIN" | "STUDENT" | "TEAMLEAD" };
};

type Group = {
  id: string;
  name: string;
  teamLead?: { id: string; fullName: string };
};

export default function StudentAssignmentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [groupFilter, setGroupFilter] = useState("");

  const load = async () => {
    setLoading(true);
    const response = await fetch("/api/admin/groups", { cache: "no-store" });
    const data = await response.json();
    if (response.ok && data.success) {
      setStudents(data.students);
      setGroups(data.groups);
    } else {
      setMessage(data.error || "Could not load student assignments.");
    }
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const assignGroup = async (studentId: string, groupId: string) => {
    const response = await fetch("/api/admin/groups", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, groupId }),
    });
    const data = await response.json();
    setMessage(data.success ? "Student group updated." : data.error);
    if (data.success) {
      setStudents((current) =>
        current.map((student) => student.id === studentId ? { ...student, groupId: groupId || undefined } : student)
      );
    }
  };

  const assignRole = async (studentId: string, role: "STUDENT" | "TEAMLEAD") => {
    const response = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, role }),
    });
    const data = await response.json();
    setMessage(data.success ? `Student role changed to ${role}.` : data.error);
    if (data.success) {
      setStudents((current) =>
        current.map((student) =>
          student.id === studentId ? { ...student, user: { ...student.user, role } } : student
        )
      );
      if (role === "STUDENT") {
        setGroups((current) =>
          current.map((group) => group.teamLead?.id === studentId ? { ...group, teamLead: undefined } : group)
        );
      }
    }
  };

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return students.filter((student) => {
      const matchesSearch = !query || [student.fullName, student.phone, student.courseName]
        .some((value) => value?.toLowerCase().includes(query));
      const matchesRole = !roleFilter || (student.user?.role || "STUDENT") === roleFilter;
      const matchesGroup = !groupFilter
        || (groupFilter === "UNASSIGNED" ? !student.groupId : student.groupId === groupFilter);
      return matchesSearch && matchesRole && matchesGroup;
    });
  }, [groupFilter, roleFilter, search, students]);

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("");
    setGroupFilter("");
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-black uppercase tracking-wider text-blue-600">Administration</p>
        <h1 className="mt-1 flex items-center gap-3 text-3xl font-black"><UserRoundCog className="text-blue-600" /> Student Assignments</h1>
        <p className="mt-2 text-slate-500">Assign students to groups and change student or team lead roles.</p>
      </div>

      {message && <p className="rounded-2xl bg-blue-50 p-4 text-sm font-bold text-blue-800">{message}</p>}

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-black"><Filter size={18} className="text-blue-600" /> Filter Students</h2>
          <p className="text-sm font-bold text-slate-500">{filteredStudents.length} of {students.length} students</p>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          <label className="relative md:col-span-2">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, phone, or course" className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 pl-10 text-sm font-semibold text-slate-900" />
          </label>
          <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700">
            <option value="">All roles</option>
            <option value="STUDENT">Students</option>
            <option value="TEAMLEAD">Team Leads</option>
          </select>
          <select value={groupFilter} onChange={(event) => setGroupFilter(event.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-700">
            <option value="">All groups</option>
            <option value="UNASSIGNED">Unassigned</option>
            {groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}
          </select>
        </div>
        {(search || roleFilter || groupFilter) && (
          <button type="button" onClick={clearFilters} className="mt-3 inline-flex items-center gap-1 text-sm font-black text-blue-600">
            <X size={15} /> Clear filters
          </button>
        )}
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>{["Student", "Course", "Role", "Group"].map((heading) => <th key={heading} className="px-5 py-4 text-left text-xs font-black uppercase text-slate-500">{heading}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && <tr><td colSpan={4} className="px-5 py-10 text-center text-sm font-bold text-slate-500">Loading student assignments...</td></tr>}
              {!loading && filteredStudents.length === 0 && <tr><td colSpan={4} className="px-5 py-10 text-center text-sm font-bold text-slate-500">No students match these filters.</td></tr>}
              {!loading && filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-100 text-blue-600">
                        {student.profileImage ? <img src={student.profileImage} alt={student.fullName} className="h-full w-full object-cover" /> : <User size={19} />}
                      </div>
                      <div>
                        <p className="font-black">{student.fullName}</p>
                        <p className="text-xs text-slate-500">{student.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-bold text-slate-600">{student.courseName || "Not added"}</td>
                  <td className="px-5 py-4">
                    <select value={student.user?.role || "STUDENT"} onChange={(event) => assignRole(student.id, event.target.value as "STUDENT" | "TEAMLEAD")} className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm font-bold">
                      <option value="STUDENT">Student</option>
                      <option value="TEAMLEAD">Team Lead</option>
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <select value={student.groupId || ""} onChange={(event) => assignGroup(student.id, event.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm font-bold">
                      <option value="">Unassigned</option>
                      {groups.map((group) => <option key={group.id} value={group.id}>{group.name} - {group.teamLead?.fullName || "No team lead"}</option>)}
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
