// components/Navbar.jsx
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectCartCount } from '@/store/cartSlice';
import { FaSearch, FaShoppingCart, FaBars, FaTimes, FaHome, FaBook, FaInfoCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
                <span className="text-2xl font-extrabold text-indigo-600">B</span>
              </div>
              <span
                className={`text-xl font-bold tracking-tight ${
                  scrolled ? 'text-gray-900' : 'text-white'
                } hidden sm:block`}
              >
                BookStore
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
                      className={`group relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? scrolled
                            ? 'text-indigo-600'
                            : 'text-white'
                          : scrolled
                          ? 'text-gray-700 hover:text-indigo-600'
                          : 'text-white/90 hover:text-white'
                      }`}
                    >
                      {link.icon}
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
              <form onSubmit={handleSearch} className="relative w-72">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books…"
                  className={`w-full rounded-full border py-2.5 pl-11 pr-12 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                    scrolled
                      ? 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                      : 'border-white/30 bg-white/15 text-white placeholder-white/60'
                  }`}
                />
                <FaSearch
                  className={`absolute left-4 top-1/2 -translate-y-1/2 text-base ${
                    scrolled ? 'text-gray-500' : 'text-white/70'
                  }`}
                />
                <button
                  type="submit"
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-lg font-bold ${
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
                <FaShoppingCart className="text-xl" />
                {cartItemsCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-md">
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex h-full flex-col p-6">
                {/* Header */}
                <div className="mb-10 flex items-center justify-between">
                  <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-600">
                      <span className="text-2xl font-bold text-white">B</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">BookStore</span>
                  </Link>
                  <button onClick={() => setIsOpen(false)}>
                    <FaTimes size={28} className="text-gray-600" />
                  </button>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="mb-8">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search books…"
                      className="w-full rounded-xl border border-gray-300 bg-gray-50 px-12 py-3.5 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    />
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  </div>
                </form>

                {/* Links */}
                <nav className="mb-auto space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-4 rounded-xl px-5 py-4 text-lg font-medium transition-colors ${
                        pathname === link.href
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-xl">{link.icon}</span>
                      {link.name}
                    </Link>
                  ))}
                </nav>

                {/* Cart */}
                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="mt-6 flex items-center justify-between rounded-xl bg-gray-100 px-5 py-4 hover:bg-gray-200"
                >
                  <div className="flex items-center gap-4">
                    <FaShoppingCart className="text-xl text-gray-700" />
                    <span className="font-medium text-gray-800">Cart</span>
                  </div>
                  {cartItemsCount > 0 && (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;