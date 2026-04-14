/**
 * Custom 404 page — shown when a user navigates to a non-existent route.
 *
 * Keeps users on-brand instead of showing the default Next.js 404.
 * Provides clear navigation back to homepage and pricing to prevent bounce.
 * Next.js automatically returns 404 status code for this page.
 */

import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center" style={{ backgroundColor: "#0a0a0a", color: "#fafafa" }}>
      <h1 className="mb-2 text-7xl font-bold tracking-tight">
        404
      </h1>
      <h2 className="mb-4 text-2xl font-semibold" style={{ color: "#a1a1aa" }}>
        Page not found
      </h2>
      <p className="mb-8 max-w-md" style={{ color: "#a1a1aa" }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back on track.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="rounded-lg px-6 py-3 text-sm font-medium transition-colors"
          style={{ backgroundColor: "#7c3aed", color: "#fff" }}
        >
          Back to Home
        </Link>
        <Link
          href="/pricing"
          className="rounded-lg border px-6 py-3 text-sm font-medium transition-colors"
          style={{ borderColor: "#27272a", color: "#fafafa" }}
        >
          View Pricing
        </Link>
      </div>
    </div>
  );
}
