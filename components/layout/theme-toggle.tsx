"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_THEME, THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

// The DOM is the source of truth: an inline script applies the stored theme
// before React runs, so the button reads the attribute rather than keeping a
// second copy of the same state.
function getTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => DEFAULT_THEME);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private mode: the theme still applies for this session.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      className="grid size-10 place-items-center rounded-full border border-line-on-field text-current transition-colors hover:border-current"
    >
      <svg
        viewBox="0 0 20 20"
        aria-hidden
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      >
        {theme === "light" ? (
          <>
            <circle cx="10" cy="10" r="3.4" />
            <path d="M10 2.2v2M10 15.8v2M2.2 10h2M15.8 10h2M4.6 4.6l1.4 1.4M14 14l1.4 1.4M15.4 4.6L14 6M6 14l-1.4 1.4" />
          </>
        ) : (
          <path d="M15.5 12.3A6.2 6.2 0 0 1 7.7 4.5a6.2 6.2 0 1 0 7.8 7.8Z" />
        )}
      </svg>
    </button>
  );
}
