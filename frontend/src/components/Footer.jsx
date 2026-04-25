import {  Phone,Mail, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-300 dark:border-white/10 bg-white dark:bg-[#0b0f1e] transition-colors duration-300">
      {/* Main Footer Content */}
      <div className="px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Notes</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Keep your thoughts organized and secure.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <a
                href="/"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Dashboard
              </a>
              <a
                href="/transfers"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Transfer History
              </a>
            </nav>
          </div>

          {/* Connect */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Connect</h4>
            <div className="flex gap-3">
              <a
                
                aria-label="Phone"
                className="w-10 h-10 rounded-lg border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 flex items-center justify-center transition-all"
              >
                <Phone size={18} />
              </a>
              <a
                
                aria-label="Email"
                className="w-10 h-10 rounded-lg border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 flex items-center justify-center transition-all"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-300 dark:border-white/10"></div>

      {/* Bottom Footer */}
      <div className="px-4 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          © {currentYear} Notes. All rights reserved.
        </p>
        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
          Made with
          <Heart size={14} className="text-red-500 fill-red-500" />
          for better note-taking
        </div>
      </div>
    </footer>
  );
}
