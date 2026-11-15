"use client";

import { useEffect, useState } from "react";

const format = () =>
  new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit" });

/** The current time in Chennai (IST), updated every 30 s. Blank until mounted, so server and client markup match. */
export function LocalTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    setTime(format());
    const id = window.setInterval(() => setTime(format()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  return <time suppressHydrationWarning>{time ?? "--:--"}</time>;
}
