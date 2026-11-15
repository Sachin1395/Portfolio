"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/** Light/dark theme: light on first visit, then remembers the visitor's choice. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
}
