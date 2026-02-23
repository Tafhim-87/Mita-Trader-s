// components/Navbar.jsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectCartCount } from '@/store/cartSlice';
import { FaSearch, FaShoppingCart, FaBars, FaTimes, FaHome, FaBook, FaInfoCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import mitaLogo from '../../../public/mitalogo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const cartItemsCount = useSelector(selectCartCount);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40); // slightly later trigger
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Prevent body scroll when mobile menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    router.push(`/books?search=${encodeURIComponent(query)}`);
    setSearchQuery('');
    setIsOpen(false);
  };

  const navLinks = useMemo(
    () => [
      { name: 'Home', href: '/', icon: <FaHome /> },
      { name: 'Books', href: '/books', icon: <FaBook /> },
      { name: 'About Us', href: '/about', icon: <FaInfoCircle /> },
    ],
    []
  );

  const navbarVariants = {
    hidden: { y: -100 },
    visible: {
      y: 0,
      transition: { type: 'spring', stiffness: 120, damping: 18 },
    },
  };

  return (
    <>
      <motion.nav
        variants={navbarVariants}
        initial="hidden"
        animate="visible"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
            : 'bg-linear-to-r from-indigo-600 via-purple-600 to-blue-600'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
                <Image src={mitaLogo} alt="Mita Logo" width={32} height={32} className="w-[clamp(1.5rem,4vw,2rem)] h-[clamp(1.5rem,4vw,2rem)]" />
              </div>
              <span
                className={`text-[clamp(1rem,3vw,1.25rem)] font-bold tracking-tight logoFont ${
                  scrolled ? 'text-gray-900' : 'text-white'
                } hidden sm:block`}
              >
                MitaStore
              </span>
            </Link>

            {/* Desktop Nav + Search + Cart */}
            <div className="hidden md:flex items-center gap-10">
              {/* Links */}
              <div className="flex gap-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`group relative flex items-center gap-2 px-4 py-2 text-[clamp(0.75rem,1.5vw,0.875rem)] font-medium rounded-lg transition-colors ${
                        isActive
                          ? scrolled
                            ? 'text-indigo-600'
                            : 'text-white'
                          : scrolled
                          ? 'text-gray-700 hover:text-indigo-600'
                          : 'text-white/90 hover:text-white'
                      }`}
                    >
                      <span className="text-[clamp(0.875rem,1.5vw,1rem)]">{link.icon}</span>
                      <span>{link.name}</span>
                      {isActive && (
                        <span
                          className={`absolute inset-x-0 -bottom-1 h-0.5 rounded-full ${
                            scrolled ? 'bg-indigo-600' : 'bg-white'
                          }`}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Search */}
              <form onSubmit={handleSearch} className="relative w-[clamp(12rem,25vw,18rem)]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books…"
                  className={`w-full rounded-full border py-[clamp(0.5rem,1.2vw,0.625rem)] pl-11 pr-12 text-[clamp(0.75rem,1.2vw,0.875rem)] transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                    scrolled
                      ? 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                      : 'border-white/30 bg-white/15 text-white placeholder-white/60'
                  }`}
                />
                <FaSearch
                  className={`absolute left-4 top-1/2 -translate-y-1/2 text-[clamp(0.875rem,1.2vw,1rem)] ${
                    scrolled ? 'text-gray-500' : 'text-white/70'
                  }`}
                />
                <button
                  type="submit"
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-[clamp(1rem,1.5vw,1.125rem)] font-bold ${
                    scrolled ? 'text-indigo-600 hover:text-indigo-700' : 'text-white hover:text-white/80'
                  }`}
                >
                  →
                </button>
              </form>

              {/* Cart */}
              <Link
                href="/cart"
                className={`relative flex items-center rounded-full p-3 transition-colors ${
                  scrolled
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <FaShoppingCart className="text-[clamp(1rem,2vw,1.25rem)]" />
                {cartItemsCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[clamp(0.625rem,1.5vw,0.75rem)] font-bold text-white shadow-md">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`rounded-lg p-2.5 md:hidden ${
                scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu - Fixed for better mobile experience */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 250 }}
              className="fixed right-0 top-0 h-full w-[clamp(16rem,75vw,22rem)] max-w-[90vw] bg-white shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex h-full flex-col p-6">
                {/* Header with close button */}
                <div className="mb-8 flex items-center justify-between">
                  <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
                      <Image src={mitaLogo} alt="Mita Logo" width={28} height={28} className="w-7 h-7" />
                    </div>
                    <span className="text-[clamp(1.25rem,5vw,1.5rem)] font-bold text-gray-900">
                      MitaStore
                    </span>
                  </Link>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
                    aria-label="Close menu"
                  >
                    <FaTimes size={24} className="text-gray-600" />
                  </button>
                </div>

                {/* Search - Improved for mobile */}
                <form onSubmit={handleSearch} className="mb-8">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search books…"
                      className="w-full rounded-xl border border-gray-300 bg-gray-50 px-12 py-4 text-[clamp(0.875rem,4vw,1rem)] focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      autoFocus
                    />
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-[clamp(0.875rem,4vw,1rem)]" />
                    <button
                      type="submit"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600 font-bold text-[clamp(1rem,4vw,1.125rem)] hover:text-indigo-700"
                    >
                      Go
                    </button>
                  </div>
                </form>

                {/* Navigation Links - Improved touch targets */}
                <nav className="flex-1 space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-4 rounded-xl px-5 py-4 text-[clamp(1rem,4vw,1.125rem)] font-medium transition-all active:scale-[0.98] ${
                        pathname === link.href
                          ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500'
                          : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                      }`}
                    >
                      <span className="text-[clamp(1.125rem,4.5vw,1.25rem)]">{link.icon}</span>
                      {link.name}
                    </Link>
                  ))}
                </nav>

                {/* Cart with improved touch target */}
                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="mt-6 flex items-center justify-between rounded-xl bg-gray-100 px-5 py-4 hover:bg-gray-200 active:bg-gray-300 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <FaShoppingCart className="text-[clamp(1.125rem,4.5vw,1.25rem)] text-gray-700" />
                    <span className="font-medium text-gray-800 text-[clamp(1rem,4vw,1.125rem)]">Cart</span>
                  </div>
                  {cartItemsCount > 0 && (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-[clamp(0.875rem,3.5vw,1rem)] font-bold text-white shadow-md">
                      {cartItemsCount > 99 ? '99+' : cartItemsCount}
                    </span>
                  )}
                </Link>

                {/* Optional: Add footer with user info/actions */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-center text-gray-500 text-[clamp(0.75rem,3vw,0.875rem)]">
                    © 2024 MitaStore. All rights reserved.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer - same height as navbar */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;