"use client";

import { usePathname } from "next/navigation";
import { Globe, User } from "lucide-react";

export function AdminHeader({ locale }: { locale: string }) {
  const pathname = usePathname();

  // Simple breadcrumb logic: converts "/he/admin/products" to "Products"
  const segments = pathname.split("/").filter(Boolean);
  const currentPage = segments[segments.length - 1];
  const formattedPageName = 
    currentPage === "admin" 
      ? "Dashboard" 
      : currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 flex items-center justify-between">
      {/* Left side: Page Title (Visible mainly on Desktop, or push right on mobile) */}
      <div className="flex items-center gap-4">
        {/* We leave a 10-unit gap on mobile to account for the Absolute-positioned Menu toggle in the Sidebar */}
        <div className="w-10 md:hidden" /> 
        <h2 className="hidden sm:block text-sm font-bold text-slate-500 uppercase tracking-wider">
          {formattedPageName}
        </h2>
      </div>

      {/* Right side: Status and Profile */}
      <div className="flex items-center gap-3 md:gap-6">
        {/* Locale Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
          <Globe size={14} className="text-slate-400" />
          <span className="text-xs font-black text-slate-600 uppercase">
            {locale}
          </span>
        </div>

        {/* User Profile (Placeholder for now) */}
        <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-white">
          <User size={16} />
        </div>
      </div>
    </header>
  );
}