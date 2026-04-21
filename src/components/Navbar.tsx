'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-5xl px-4 md:px-6 h-14 flex items-center justify-between">

        <Link
          href="/"
          className="flex items-center gap-2 font-mono font-semibold text-sm text-zinc-100 hover:text-cyan-400 transition-colors duration-150"
        >
          <span className="text-cyan-400 text-base leading-none select-none">▸</span>
          miggy.log
        </Link>

        <div className="flex items-center gap-5">
          <Link
            href="/posts"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors duration-150"
          >
            Posts
          </Link>

          <span className="w-px h-4 bg-zinc-800" />

          <button
            onClick={() => mounted && setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
            className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 transition-colors duration-150"
          >
            <span className="block w-4 h-4">
              {mounted && (
                theme === 'dark' ? (
                  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )
              )}
            </span>
          </button>
        </div>

      </div>
    </nav>
  );
}
