/**
 * SiteHeaderNavigation.tsx — Top navigation bar shown on all pages
 *
 * CALLED BY: src/app/[locale]/layout.tsx (wrapped in NextIntlClientProvider).
 * Uses next-intl Link so locale prefixes stay correct for ES routes.
 * Locale switcher sits beside desktop nav so Spanish users can self-serve.
 */

"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import QrArtLocaleSwitcher from "@/components/QrArtLocaleSwitcher";

export default function SiteHeaderNavigation() {
  const t = useTranslations("Nav");

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/5"
      style={{
        backdropFilter: "blur(12px)",
        backgroundColor: "rgba(10, 10, 15, 0.8)",
      }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center transition-transform group-hover:scale-110">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor" />
              <rect x="11" y="1" width="6" height="6" rx="1" fill="currentColor" />
              <rect x="1" y="11" width="6" height="6" rx="1" fill="currentColor" />
              <rect x="11" y="11" width="3" height="3" rx="0.5" fill="currentColor" />
              <rect x="14" y="14" width="3" height="3" rx="0.5" fill="currentColor" />
              <rect x="11" y="14" width="3" height="1.5" rx="0.5" fill="currentColor" opacity="0.5" />
            </svg>
          </div>
          <span className="text-xl font-bold">
            {t("brandBefore")} <span className="gradient-text-animated">{t("brandAccent")}</span>{" "}
            {t("brandAfter")}
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            {t("dashboard")}
          </Link>
          <Link
            href="/pricing"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            {t("pricing")}
          </Link>
          <QrArtLocaleSwitcher />
          <Link
            href="/dashboard"
            className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white transition-all hover:shadow-lg hover:shadow-purple-500/25"
          >
            {t("startCreating")}
          </Link>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <QrArtLocaleSwitcher />
          <Link
            href="/dashboard"
            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
          >
            {t("create")}
          </Link>
        </div>
      </nav>
    </header>
  );
}
