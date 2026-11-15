"use client";

import { useEffect } from "react";
import { detectLite } from "@/lib/device";

/** Decides light mode once the page has loaded (see lib/device.ts). Renders nothing. */
export function DeviceProbe() {
  useEffect(() => {
    const run = () => void detectLite();
    if (document.readyState === "complete") run();
    else window.addEventListener("load", run, { once: true });
    return () => window.removeEventListener("load", run);
  }, []);
  return null;
}
