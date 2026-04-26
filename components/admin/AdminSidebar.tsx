"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, LayoutDashboard, Package, Store } from 'lucide-react';

export function AdminSidebar({ locale }: { locale: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const NavLinks = () => (
    <>
      <Link 
        href={`/${locale}/admin`} 
        onClick={() => setIsOpen(false)}
        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-lg transition-colors"
      >
        <LayoutDashboard size={20} /> Dashboard
      </Link>
      <Link 
        href={`/${locale}/admin/products`} 
        onClick={() => setIsOpen(false)}
        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-lg transition-colors"
      >
        <Package size={20} /> Products
      </Link>
      <Link 
        href={`/${locale}/`} 
        className="flex items-center gap-3 px-4 py-3 mt-auto bg-slate-800/50 text-sm text-gray-400 rounded-lg"
      >
        <Store size={18} /> Back to Store
      </Link>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button (Visible only on mobile) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-3 left-4 z-[60] p-2 bg-slate-900 text-white rounded-md md:hidden shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 font-bold text-xl border-b border-slate-800 flex items-center justify-between">
          <span>Thai Web 2 <span className="text-blue-400 text-sm font-medium">Admin</span></span>
        </div>
        <nav className="p-4 flex flex-col h-[calc(100%-80px)] space-y-2">
          <NavLinks />
        </nav>
      </aside>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}