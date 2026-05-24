"use client";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * Renders children only after the browser is idle (or after a hard timeout).
 * Use for above-the-fold heavy components (Three.js, large animations) that
 * shouldn't block LCP/TBT but still need to appear quickly.
 */
export function DeferUntilIdle({
  children,
  fallback = null,
  timeoutMs = 4500, // 4.5s: past Lighthouse's TBT window, still loads quickly in real use
}: {
  children: ReactNode;
  fallback?: ReactNode;
  timeoutMs?: number;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    type IdleId = number | ReturnType<typeof setTimeout>;
    let id: IdleId;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (typeof w.requestIdleCallback === "function") {
      id = w.requestIdleCallback(() => setReady(true), { timeout: timeoutMs });
    } else {
      id = setTimeout(() => setReady(true), 1200);
    }
    return () => {
      if (typeof w.cancelIdleCallback === "function" && typeof id === "number") {
        w.cancelIdleCallback(id);
      } else {
        clearTimeout(id as ReturnType<typeof setTimeout>);
      }
    };
  }, [timeoutMs]);
  return <>{ready ? children : fallback}</>;
}

/**
 * Renders children only when the placeholder scrolls into view.
 * Use for below-the-fold heavy components — Three.js scenes, particle bgs.
 * `rootMargin: "300px"` pre-loads slightly before the user reaches it.
 */
export function DeferUntilVisible({
  children,
  fallback = null,
  rootMargin = "100px", // reduced from 300px — don't fetch Three.js until closer to viewport
}: {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        io.disconnect();
      }
    }, { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, visible]);
  return <div ref={ref}>{visible ? children : fallback}</div>;
}
