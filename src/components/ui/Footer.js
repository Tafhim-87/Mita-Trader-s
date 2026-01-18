import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* About */}
        <div>
          <h2 className="text-white text-xl font-semibold mb-4">About Us</h2>
          <p className="text-sm leading-relaxed">
            We provide all kinds of books including academic, competitive exams,
            fiction, non-fiction, and Islamic publications. Quality books at
            affordable prices.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-white text-xl font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/books" className="hover:text-white">Books</Link></li>
            <li><Link href="/categories" className="hover:text-white">Categories</Link></li>
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-white text-xl font-semibold mb-4">Contact</h2>
          <ul className="space-y-3 text-sm">
            <li>📍 38/6, Bock & Computer Complex, Dhaka-1100, Bangladesh</li>
            <li>📞 01906-884840</li>
            <li>
              📧
              <a
                href="mailto:mitatradersbd@gmail.com"
                className="hover:text-white ml-1"
              >
                mitatradersbd@gmail.com
              </a>
            </li>
            <li>
              🌐
              <a
                href="https://www.rokomari.com/book/author/74060/niyog-publication"
                target="_blank"
                className="hover:text-white ml-1"
              >
                Rokomari Author Page
              </a>
            </li>
          </ul>
        </div>

        {/* Business Info */}
        <div>
          <h2 className="text-white text-xl font-semibold mb-4">Business Info</h2>
          <ul className="space-y-2 text-sm">
            <li>🕒 Always Open</li>
            <li>⭐ 100% Recommended</li>
            <li>💰 Price Range: ৳</li>
            <li>📦 E-commerce Website</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} Your Book Store. All rights reserved.
      </div>
    </footer>
  );
}
