'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard,
  BookOpen,
  Tag,
  Menu,
  X,
  LogIn,
  Eye,
  EyeOff
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Login form state
  const [loginForm, setLoginForm] = useState({
    id: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Check if user is already authorized (check localStorage on mount)
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('dashboardAuth');
      if (authStatus === 'true') {
        setIsAuthorized(true);
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Books', href: '/dashboard/books', icon: BookOpen },
    { name: 'Categories', href: '/dashboard/categories', icon: Tag },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Get credentials from environment variables
    const validId = process.env.NEXT_PUBLIC_ID;
    const validPassword = process.env.NEXT_PUBLIC_PASSWORD;

    // Check if credentials are set in env
    if (!validId || !validPassword) {
      setError('Admin credentials not configured. Please check environment variables.');
      return;
    }

    // Validate credentials
    if (loginForm.id === validId && loginForm.password === validPassword) {
      setIsAuthorized(true);
      localStorage.setItem('dashboardAuth', 'true');
    } else {
      setError('Invalid ID or password');
    }
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    localStorage.removeItem('dashboardAuth');
    router.push('/dashboard');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authorized
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LayoutDashboard className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Enter your credentials to access the dashboard</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* ID Field */}
            <div>
              <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-2">
                Admin ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="id"
                  name="id"
                  value={loginForm.id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your admin ID"
                  required
                />
                <LogIn className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pl-11 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <LogIn className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Show dashboard if authorized
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
        <div className="h-16 px-6 border-b flex items-center justify-between">
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

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            Logout
          </button>
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