"use client";

import { useEffect } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const PING_INTERVAL_MS = 14 * 60 * 1000; // 14 minutes — just under Render's 15-min sleep threshold

/**
 * useKeepAlive
 *
 * Pings the backend `/ping` endpoint every 14 minutes so Render's free-tier
 * server never crosses the 15-minute inactivity threshold and goes to sleep.
 *
 * Mount this hook once at the root layout level (it fires on the client side).
 */
export function useKeepAlive() {
  useEffect(() => {
    const ping = async () => {
      try {
        await fetch(`${BACKEND_URL}/ping`);
        console.log("[KeepAlive] Server pinged ✅");
      } catch (err) {
        console.warn("[KeepAlive] Ping failed:", err);
      }
    };

    // Ping immediately on mount so the server wakes up as soon as someone
    // opens the site, then continue on the interval.
    ping();

    const intervalId = setInterval(ping, PING_INTERVAL_MS);

    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);
}
