'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard,
  BookOpen,
  Tag,
  ShoppingCart,
  BarChart3,
  Settings,
  Menu,
  X
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Books', href: '/dashboard/books', icon: BookOpen },
    { name: 'Categories', href: '/dashboard/categories', icon: Tag },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* SIDEBAR */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r
        transform transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
      >

        {/* Logo */}
        <div className="h-16 px-6 border-b flex items-center">
          <h1 className="text-lg font-bold text-gray-900">
            📚 BookStore Admin
          </h1>
        </div>

        {/* Nav */}
        <nav className="px-3 py-4 space-y-1">

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`
                flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium
                transition
                ${active
                  ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 pl-3'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}

        </nav>

      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">

          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>

            <h2 className="font-semibold text-gray-800">
              {navItems.find(i => i.href === pathname)?.name || 'Dashboard'}
            </h2>
          </div>

        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto">

          {children}

        </main>

      </div>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

    </div>
  );
}
