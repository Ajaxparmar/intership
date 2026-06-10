"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CalendarCheck, GraduationCap, LayoutDashboard, LogOut, PlusCircle, UserRoundCog, Users } from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/students/register", label: "Register Student", icon: PlusCircle },
  { href: "/admin/groups", label: "Groups & Team Leads", icon: UserRoundCog },
  { href: "/admin/leaves", label: "Leave Requests", icon: CalendarCheck },
  { href: "/admin/batches/add", label: "Add Batch", icon: PlusCircle },
  { href: "/admin/batches/manage", label: "Manage Batches", icon: BookOpen },
  { href: "/", label: "Public Site", icon: GraduationCap },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-100 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white">
                <LayoutDashboard size={22} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-blue-600">CodeScaler</p>
                <h1 className="text-xl font-black">Admin Panel</h1>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-2 p-4">
            {links.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${
                    active ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-slate-100 p-4">
            <Link
              href="/login"
              className="flex items-center gap-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-600 transition hover:bg-red-100"
            >
              <LogOut size={18} />
              Logout
            </Link>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
          <p className="text-xs font-black uppercase tracking-widest text-blue-600">CodeScaler Admin</p>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-black ${
                    active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link href="/login" className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-50 px-4 py-2 text-xs font-black text-red-600">
              <LogOut size={13} />
              Logout
            </Link>
          </div>
        </div>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
