"use client";

/**
 * error.tsx — App Router error boundary for QRArtify / ai-qr-art-generator.
 *
 * WHY: Subscription CTAs and dashboard navigation can throw; users should see branded
 * recovery UI instead of an empty document (common “blank site” report).
 */

import { useEffect } from "react";

export default function QrArtAppErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[ai-qr-art-generator] route error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-2xl font-semibold mb-2">Something went wrong</h1>
      <p className="text-zinc-400 text-center max-w-md mb-6">
        Retry below. Billing uses Stripe — ensure{" "}
        <code className="text-purple-400">STRIPE_SECRET_KEY</code> and price IDs or
        Payment Links are set on Vercel.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 font-semibold"
      >
        Try again
      </button>
    </div>
  );
}
