'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3,
  Package,
  Receipt,
  Users,
  Factory,
  Wheat,
  Handshake,
  ShoppingCart,
  BookOpen,
  Cog,
  Microscope,
  Boxes,
  Layers,
  FileText,
  ShieldCheck,
  Menu,
  X,
  LogOut,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function AdminLayout({
  children,
  title,
  subtitle,
  actions,
}: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const isStaff = Boolean(user?.is_staff || user?.role === 'admin' || user?.role === 'staff');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Grouped Navigation Items matching all manufacturing & operations modules
  const navGroups = [
    {
      group: 'Overview',
      items: [
        { href: '/admin/dashboard', label: 'Executive Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
      ],
    },
    {
      group: 'Commerce & Sales',
      items: [
        { href: '/admin/orders', label: 'Orders & Fulfillment', icon: <Package className="w-4 h-4" /> },
        { href: '/admin/invoices', label: 'Tax Invoices', icon: <Receipt className="w-4 h-4" /> },
        { href: '/admin/customers', label: 'Customer Directory', icon: <Users className="w-4 h-4" /> },
      ],
    },
    {
      group: 'Manufacturing & Production',
      items: [
        { href: '/admin/manufacturing', label: 'Factory Overview', icon: <Factory className="w-4 h-4" /> },
        { href: '/admin/raw-materials', label: 'Raw Materials', icon: <Wheat className="w-4 h-4" /> },
        { href: '/admin/suppliers', label: 'Suppliers Directory', icon: <Handshake className="w-4 h-4" /> },
        { href: '/admin/purchases', label: 'Purchase Orders', icon: <ShoppingCart className="w-4 h-4" /> },
        { href: '/admin/recipes', label: 'Recipes (BOM)', icon: <BookOpen className="w-4 h-4" /> },
        { href: '/admin/production/orders', label: 'Production Runs', icon: <Cog className="w-4 h-4" /> },
        { href: '/admin/production/quality', label: 'Quality Control', icon: <Microscope className="w-4 h-4" /> },
        { href: '/admin/packaging', label: 'Packaging Runs', icon: <Boxes className="w-4 h-4" /> },
      ],
    },
    {
      group: 'Finished Goods Inventory',
      items: [
        { href: '/admin/inventory', label: 'Stock Levels', icon: <Layers className="w-4 h-4" /> },
        { href: '/admin/inventory/stock-in', label: 'Stock In Records', icon: <Package className="w-4 h-4" /> },
        { href: '/admin/inventory/movements', label: 'Movement Logs', icon: <FileText className="w-4 h-4" /> },
        { href: '/admin/production/batches', label: 'Batch Registry', icon: <ShieldCheck className="w-4 h-4" /> },
        { href: '/admin/inventory/expiry', label: 'Expiry & FEFO', icon: <ClockIcon className="w-4 h-4" /> },
      ],
    },
    {
      group: 'Intelligence & Staff',
      items: [
        { href: '/admin/reports', label: 'Reports & Export', icon: <FileText className="w-4 h-4" /> },
        { href: '/admin/staff', label: 'Staff & Roles', icon: <ShieldCheck className="w-4 h-4" /> },
      ],
    },
  ];

  if (!loading && !isStaff) {
    return (
      <div className="min-h-screen bg-[#FFF9F1] flex items-center justify-center p-4 text-[#281411]">
        <div className="bg-[#FFFFFF] p-8 rounded-3xl shadow-lg border border-[#EADBCC] max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
            🔒
          </div>
          <h2 className="font-display font-black text-xl text-[#281411] mb-2">Staff Access Required</h2>
          <p className="text-xs text-[#735C57] mb-6">
            You must be signed in as an authorized OnFresh administrator or staff member to view this portal.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/login?redirect=/admin/dashboard"
              className="px-5 py-2.5 bg-[#F47735] text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#E06322] transition-colors shadow-md"
            >
              Sign In as Staff
            </Link>
            <Link
              href="/"
              className="px-5 py-2.5 bg-[#F7EFE6] text-[#281411] rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#EADBCC] transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7EFE6] flex text-[#281411]">
      {/* 1. Left Sidebar Navigation (Desktop) */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-[#FFFFFF] border-r border-[#EADBCC] shrink-0 select-none">
        {/* Brand Banner */}
        <div className="h-16 px-6 border-b border-[#F7EFE6] flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F47735] flex items-center justify-center text-white font-display font-black text-lg shadow-sm">
              O
            </div>
            <div>
              <span className="font-display font-black text-[#281411] text-base tracking-tight block leading-none">
                OnFresh
              </span>
              <span className="text-[10px] font-bold text-[#F47735] uppercase tracking-wider block mt-0.5">
                Admin ERP
              </span>
            </div>
          </Link>
          <span className="text-[10px] font-bold text-[#287B52] bg-[#E8F4EE] px-2 py-0.5 rounded-full">
            Staff
          </span>
        </div>

        {/* Navigation Group Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {navGroups.map((grp) => (
            <div key={grp.group}>
              <div className="px-3 text-[10px] font-bold text-[#A89088] uppercase tracking-wider mb-1.5">
                {grp.group}
              </div>
              <div className="space-y-0.5">
                {grp.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#351C18] text-[#FFF9F1] shadow-xs'
                          : 'text-[#735C57] hover:text-[#281411] hover:bg-[#F7EFE6]'
                      }`}
                    >
                      <span className={isActive ? 'text-[#FFD83D]' : 'text-[#A89088]'}>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Facility Info Card */}
        <div className="p-4 border-t border-[#F7EFE6] bg-[#FFF9F1]">
          <div className="text-[11px] font-bold text-[#281411]">
            🏭 Vandiperiyar Facility
          </div>
          <div className="text-[10px] text-[#735C57] mt-0.5">
            Idukki District, Kerala - 685533
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-[#FFFFFF] border-b border-[#EADBCC] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#281411] hover:bg-[#F7EFE6] rounded-xl"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <Link href="/" target="_blank" className="text-xs font-bold text-[#F47735] hover:underline flex items-center gap-1">
                <span>View Public Store</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#281411] hidden sm:inline">
              {user?.full_name || user?.email}
            </span>
            <button
              onClick={() => logout()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F7EFE6] hover:bg-red-50 text-xs font-bold text-[#735C57] hover:text-red-600 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {/* Header Title Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-[#281411] tracking-tight">
                {title}
              </h1>
              {subtitle && <p className="text-xs sm:text-sm text-[#735C57] mt-0.5">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}
