'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User, MapPin, ShoppingBag, Building2, LogOut, Package } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AccountNav() {
  const pathname = usePathname();
  const { user, profile, logout } = useAuth();

  const isBusiness = profile?.customer_type === 'business';
  const isApprovedWholesale = Boolean(
    isBusiness && profile?.wholesale_status === 'approved'
  );

  const links = [
    { href: '/account', label: 'Account Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: '/account/orders', label: 'My Orders & Invoices', icon: <Package className="w-4 h-4" /> },
    {
      href: '/account/profile',
      label: isBusiness ? 'Business Profile' : 'Personal Profile',
      icon: isBusiness ? <Building2 className="w-4 h-4" /> : <User className="w-4 h-4" />,
    },
    { href: '/account/addresses', label: 'Saved Addresses', icon: <MapPin className="w-4 h-4" /> },
    { href: '/products', label: 'Shop Catalogue', icon: <ShoppingBag className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-full lg:w-64 bg-[#FFFFFF] rounded-3xl border border-[#EADBCC] p-5 shadow-sm space-y-6 shrink-0">
      {/* User Mini Profile Header */}
      <div className="pb-5 border-b border-[#F7EFE6] flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#351C18] text-[#FFF9F1] font-display font-black text-xl flex items-center justify-center shadow-sm">
          {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="overflow-hidden">
          <h4 className="font-display font-black text-[#281411] text-sm truncate">
            {user?.full_name || 'Customer'}
          </h4>
          <p className="text-[11px] text-[#735C57] truncate">{user?.email}</p>
          <div className="mt-1">
            {isBusiness ? (
              isApprovedWholesale ? (
                <span className="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E8F4EE] text-[#287B52] border border-[#287B52]/30">
                  Approved Wholesale
                </span>
              ) : (
                <span className="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFF9DC] text-[#281411] border border-[#FFD83D]">
                  Wholesale (Pending)
                </span>
              )
            ) : (
              <span className="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F7EFE6] text-[#735C57] border border-[#EADBCC]">
                Retail Customer
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1.5">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-[#351C18] text-[#FFF9F1] shadow-xs'
                  : 'text-[#281411] hover:bg-[#F7EFE6]'
              }`}
            >
              <span className={isActive ? 'text-[#FFD83D]' : 'text-[#A89088]'}>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sign Out Action */}
      <div className="pt-4 border-t border-[#F7EFE6]">
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
