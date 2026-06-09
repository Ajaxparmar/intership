"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const LOGO_URL = "https://www.codescaler.com/logo.png";
const CURRICULUM_URL = "/CodeScaler_Industrial_Training_Curriculum.pdf";

type HeaderKey =
  | "roadmap"
  | "internship"
  | "admission"
  | "batches"
  | "find"
  | "download"
  | "contact"
  | "bookings"
  | "addBatch"
  | "student-login"
  | "role-login";

interface HeaderLink {
  key: HeaderKey | string;
  label: string;
  mobileLabel?: string;
  href?: string;
  download?: string | boolean;
  onClick?: () => void;
  primary?: boolean;
}

interface HeaderProps {
  active?: HeaderKey | string;
  onRoadmapClick?: () => void;
  onInternshipClick?: () => void;
  onContactClick?: () => void;
  extraLinks?: HeaderLink[];
  showDownload?: boolean;
}

export default function Header({
  active,
  onRoadmapClick,
  onInternshipClick,
  onContactClick,
  extraLinks = [],
  showDownload = true,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);
  const withMenuClose = (handler?: () => void) => () => {
    handler?.();
    closeMenu();
  };

  const links: HeaderLink[] = [

    {
      key: "internship",
      label: "Internship",
      mobileLabel: "Application Form",
      href: "/",
      onClick: onInternshipClick,
    },
    // { key: "admission", label: "Admission", href: "/admission" },
    { key: "batches", label: "Batches", href: "/batch" },
    // { key: "find", label: "Find Registration", href: "/find" },
    { key: "role-login", label: "Login", href: "/login" },
    // ...(showDownload
    //   ? [{
    //       key: "download",
    //       label: "Download",
    //       mobileLabel: "Download Curriculum",
    //       href: CURRICULUM_URL,
    //       download: "CodeScaler_Industrial_Training_Curriculum.pdf",
    //     }]
    //   : []),
    // ...extraLinks,
    {
      key: "roadmap",
      label: "Roadmap",
      mobileLabel: "Internship Roadmap",
      href: "/",
      onClick: onRoadmapClick,
    },
    {
      key: "contact",
      label: "Contact Us",
      mobileLabel: "Contact Our Team",
      href: "/",
      onClick: onContactClick,
      primary: true,
    },
    
  ];

  const renderDesktopLink = (link: HeaderLink) => {
    const isActive = active === link.key;
    const className = link.primary
      ? cn(
          "px-5 py-2 rounded-full transition-all font-bold",
          isActive ? "bg-blue-600 text-white" : "bg-neutral-900 text-white hover:bg-neutral-800"
        )
      : cn(
          "hover:text-blue-600 transition-colors cursor-pointer",
          isActive && "text-blue-600 font-semibold border-b-2 border-blue-600 pb-0.5"
        );

    if (link.onClick) {
      return (
        <button key={link.key} type="button" onClick={link.onClick} className={className}>
          {link.label}
        </button>
      );
    }

    return (
      <a key={link.key} href={link.href} download={link.download} className={className}>
        {link.label}
      </a>
    );
  };

  const renderMobileLink = (link: HeaderLink) => {
    const isActive = active === link.key;
    const className = link.primary
      ? "w-full py-4 px-6 bg-neutral-900 text-white rounded-2xl font-bold hover:bg-neutral-800 transition-all text-center"
      : cn(
          "w-full py-4 px-6 rounded-2xl text-left font-bold transition-all",
          isActive ? "bg-blue-50 text-blue-600" : "text-neutral-500 hover:bg-neutral-50 hover:text-blue-600"
        );

    if (link.onClick) {
      return (
        <button key={link.key} type="button" onClick={withMenuClose(link.onClick)} className={className}>
          {link.mobileLabel ?? link.label}
        </button>
      );
    }

    return (
      <a key={link.key} href={link.href} download={link.download} onClick={closeMenu} className={className}>
        {link.mobileLabel ?? link.label}
      </a>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg flex items-center justify-center text-white font-bold text-xl">
            <img
              src={LOGO_URL}
              alt="CodeScaler Logo"
              className="w-20 h-20 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <a href="#">
            <span className="font-bold text-2xl tracking-tight text-neutral-800">CodeScaler</span>
          </a>
        </div>

        <div className="hidden md:flex items-center gap-8 text-neutral-500 font-medium">
          {links.map(renderDesktopLink)}
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="md:hidden p-2 text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors"
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-neutral-100 bg-white overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {links.map(renderMobileLink)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
