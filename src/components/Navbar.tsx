'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Search,
  User,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Building2,
  Phone,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import AnnouncementBar from './ui/AnnouncementBar';
import MegaMenu from './ui/MegaMenu';
import CartDrawer from './ui/CartDrawer';
import SearchOverlay from './ui/SearchOverlay';

export default function Navbar() {
  const pathname = usePathname();
  const { user, profile, logout } = useAuth();
  const { itemsCount } = useCart();

  const [scrolled, setScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isApprovedWholesale =
    profile?.customer_type === 'business' && profile?.wholesale_status === 'approved';
  const isPendingWholesale =
    profile?.customer_type === 'business' && profile?.wholesale_status === 'pending';
  const isStaff = user?.is_staff || false;

  return (
    <>
      {/* 1. Top Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Main Sticky Navigation Bar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#FFF9F1]/95 backdrop-blur-md shadow-md py-3 border-b border-[#EADBCC]'
            : 'bg-[#FFF9F1] py-4 border-b border-[#EADBCC]/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-11 h-11 rounded-2xl bg-[#F47735] text-[#FFFFFF] flex items-center justify-center font-display font-black text-2xl shadow-md group-hover:scale-105 group-hover:rotate-3 transition-transform">
                O
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-black text-2xl lg:text-3xl text-[#281411] tracking-tight leading-none">
                    ON<span className="text-[#F47735]">FRESH</span>
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#FFD83D] text-[#281411] font-bold text-[9px] uppercase tracking-wider">
                    Bakery & Snacks
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-[#735C57] tracking-wider uppercase">
                  Vandiperiyar • Idukki
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              <Link
                href="/"
                className={`px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                  pathname === '/'
                    ? 'bg-[#351C18] text-[#FFF9F1]'
                    : 'text-[#281411] hover:bg-[#F7EFE6]'
                }`}
              >
                Home
              </Link>

              <Link
                href="/products"
                className={`px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                  pathname.startsWith('/products')
                    ? 'bg-[#351C18] text-[#FFF9F1]'
                    : 'text-[#281411] hover:bg-[#F7EFE6]'
                }`}
              >
                Shop All
              </Link>

              {/* MegaMenu Trigger */}
              <div
                className="relative"
                onMouseEnter={() => setMegaMenuOpen(true)}
              >
                <button
                  onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1 ${
                    megaMenuOpen || pathname.startsWith('/categories')
                      ? 'bg-[#F47735] text-[#FFFFFF]'
                      : 'text-[#281411] hover:bg-[#F7EFE6]'
                  }`}
                >
                  <span>Categories</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              <Link
                href="/wholesale"
                className={`px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                  pathname === '/wholesale'
                    ? 'bg-[#287B52] text-[#FFFFFF]'
                    : 'text-[#287B52] bg-[#287B52]/10 hover:bg-[#287B52]/20'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Wholesale B2B</span>
              </Link>

              <Link
                href="/#about"
                className="px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-[#281411] hover:bg-[#F7EFE6] transition-colors"
              >
                About
              </Link>

              <Link
                href="/#contact"
                className="px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-[#281411] hover:bg-[#F7EFE6] transition-colors"
              >
                Contact
              </Link>
            </nav>

            {/* Right Action Icons: Search, Account, Cart */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search snacks"
                className="w-10 h-10 rounded-full bg-[#F7EFE6] hover:bg-[#EADBCC] text-[#281411] flex items-center justify-center transition-colors border border-[#EADBCC]"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* User Account Button & Dropdown */}
              <div className="relative">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F7EFE6] hover:bg-[#EADBCC] border border-[#EADBCC] transition-colors"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#351C18] text-[#FFF9F1] flex items-center justify-center font-bold text-xs">
                        {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="hidden sm:flex flex-col text-left">
                        <span className="text-xs font-bold text-[#281411] truncate max-w-[100px]">
                          {user.full_name || user.email.split('@')[0]}
                        </span>
                        <span className="text-[9px] font-bold text-[#287B52] uppercase">
                          {isStaff ? 'Staff' : isApprovedWholesale ? 'Wholesale' : 'Retail'}
                        </span>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-[#735C57]" />
                    </button>

                    {/* Dropdown Menu */}
                    {userDropdownOpen && (
                      <div
                        onMouseLeave={() => setUserDropdownOpen(false)}
                        className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#FFFFFF] border border-[#EADBCC] shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                      >
                        <div className="p-2 border-b border-[#F7EFE6] mb-1">
                          <p className="text-xs font-bold text-[#281411] truncate">{user.email}</p>
                          <p className="text-[10px] text-[#735C57]">
                            {isApprovedWholesale ? 'Approved Wholesale Customer' : 'Individual Retail Customer'}
                          </p>
                        </div>

                        {isStaff && (
                          <Link
                            href="/admin/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#351C18] bg-[#FFD83D]/20 hover:bg-[#FFD83D]/40 transition-colors mb-1"
                          >
                            <ShieldCheck className="w-4 h-4 text-[#F47735]" />
                            <span>Admin Portal</span>
                          </Link>
                        )}

                        <Link
                          href="/account/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#281411] hover:bg-[#F7EFE6] transition-colors"
                        >
                          <span>My Orders & Invoices</span>
                        </Link>

                        <Link
                          href="/account/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#281411] hover:bg-[#F7EFE6] transition-colors"
                        >
                          <span>Account Profile</span>
                        </Link>

                        <Link
                          href="/account/addresses"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#281411] hover:bg-[#F7EFE6] transition-colors"
                        >
                          <span>Saved Addresses</span>
                        </Link>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors mt-1"
                        >
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#F7EFE6] hover:bg-[#EADBCC] text-[#281411] font-bold text-xs uppercase tracking-wider transition-colors border border-[#EADBCC]"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Link>
                )}
              </div>

              {/* Shopping Cart Pill Button (Triggers Drawer) */}
              <button
                onClick={() => setCartDrawerOpen(true)}
                aria-label="Open Shopping Bag"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F47735] hover:bg-[#E06322] text-[#FFFFFF] shadow-md hover:shadow-lg transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="font-display font-black text-xs">
                  {itemsCount}
                </span>
              </button>

              {/* Mobile Hamburger Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
                className="lg:hidden w-10 h-10 rounded-full bg-[#F7EFE6] text-[#281411] hover:bg-[#EADBCC] flex items-center justify-center transition-colors border border-[#EADBCC]"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* MegaMenu Dropdown */}
        <MegaMenu isOpen={megaMenuOpen} onClose={() => setMegaMenuOpen(false)} />
      </header>

      {/* 3. Mobile Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-[#281411]/60 backdrop-blur-sm"
          />

          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-[#FFF9F1] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#EADBCC] mb-6">
                <span className="font-display font-black text-2xl text-[#281411]">
                  ON<span className="text-[#F47735]">FRESH</span>
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#F7EFE6] text-[#281411] flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-xl font-bold text-sm text-[#281411] hover:bg-[#F7EFE6]"
                >
                  Home
                </Link>

                <Link
                  href="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-xl font-bold text-sm text-[#281411] hover:bg-[#F7EFE6]"
                >
                  Shop All Snacks
                </Link>

                <div className="pt-2 pb-1 px-4 text-xs font-bold uppercase tracking-wider text-[#A89088]">
                  Categories
                </div>

                {[
                  { name: 'Banana Chips', slug: 'banana-chips' },
                  { name: 'Tapioca & Jackfruit Chips', slug: 'tapioca-jackfruit-chips' },
                  { name: 'Murukku & Savouries', slug: 'murukku-traditional-snacks' },
                  { name: 'Mixture & Namkeen', slug: 'mixture-savouries' },
                  { name: 'Bakery Products', slug: 'bakery-products' },
                  { name: 'Biscuits & Cookies', slug: 'biscuits-cookies' },
                ].map((c) => (
                  <Link
                    key={c.slug}
                    href={`/categories/${c.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-6 py-2 rounded-xl text-xs font-bold text-[#735C57] hover:bg-[#F7EFE6]"
                  >
                    {c.name}
                  </Link>
                ))}

                <Link
                  href="/wholesale"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl font-bold text-sm bg-[#287B52] text-[#FFFFFF] shadow-sm mt-4 text-center uppercase tracking-wider"
                >
                  Wholesale Business Portal
                </Link>

                <Link
                  href="/#about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-xl font-bold text-sm text-[#281411] hover:bg-[#F7EFE6]"
                >
                  About Our Bakery
                </Link>

                <Link
                  href="/#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-xl font-bold text-sm text-[#281411] hover:bg-[#F7EFE6]"
                >
                  Contact & Location
                </Link>
              </div>
            </div>

            {/* Bottom info in mobile drawer */}
            <div className="pt-6 border-t border-[#EADBCC] space-y-3">
              {user ? (
                <div className="space-y-2">
                  <div className="text-xs text-[#735C57]">
                    Signed in as <span className="font-bold text-[#281411]">{user.email}</span>
                  </div>
                  <Link
                    href="/account/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-2.5 rounded-xl text-center bg-[#F7EFE6] text-[#281411] font-bold text-xs"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="block w-full py-2 text-center text-xs font-bold text-red-600"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 rounded-full text-center bg-[#F7EFE6] text-[#281411] font-bold text-xs"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 rounded-full text-center bg-[#F47735] text-[#FFFFFF] font-bold text-xs"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Cart Drawer */}
      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />

      {/* 5. Search Overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
