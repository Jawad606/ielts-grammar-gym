"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const I = {
  home: <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  learn: <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5M8 7h7M8 11h7" />,
  practice: <path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" />,
  type: <path d="M3 7h18v10H3zM6 10h1M9 10h1M12 10h1M15 10h1M18 10h0M7 14h10" />,
  fix: <path d="M5 13l4 4L19 7" />,
  check: <path d="M4 4h16v12H8l-4 4zM8 9h8M8 12h5" />,
  vocab: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
  progress: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
};

const LINKS: [string, string, keyof typeof I][] = [
  ["/", "Home", "home"],
  ["/learn", "Learn", "learn"],
  ["/practice", "Practise", "practice"],
  ["/type", "Type", "type"],
  ["/fix", "Fix it", "fix"],
  ["/check", "Check", "check"],
  ["/vocab", "Words", "vocab"],
  ["/progress", "Stats", "progress"],
];

export default function Nav() {
  const path = usePathname();
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return (
    <nav className="nav" aria-label="Main">
      {LINKS.map(([href, label, icon]) => {
        const on = href === "/" ? path === "/" : path?.startsWith(href);
        return (
          <Link key={href} href={href} className={on ? "on" : ""} aria-current={on ? "page" : undefined}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              {I[icon]}
            </svg>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
