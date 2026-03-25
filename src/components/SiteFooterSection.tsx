/**
 * SiteFooterSection.tsx — Global footer shown on all pages
 *
 * CALLED BY: src/app/[locale]/layout.tsx. Link targets use i18n navigation
 * so /es users stay under the Spanish prefix.
 */

"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function SiteFooterSection() {
  const t = useTranslations("Footer");

  return (
    <footer className="border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <svg
                  width="14"
                  height="14"
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
                </svg>
              </div>
              <span className="font-bold">QR Art AI</span>
            </div>
            <p className="text-sm text-zinc-500 max-w-xs">{t("tagline")}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-300">{t("product")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {t("generate")}
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {t("pricing")}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-300">{t("legal")}</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-zinc-500">{t("privacy")}</span>
              </li>
              <li>
                <span className="text-sm text-zinc-500">{t("terms")}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5">
          <p className="text-sm text-zinc-600 text-center">
            &copy; {new Date().getFullYear()} {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
