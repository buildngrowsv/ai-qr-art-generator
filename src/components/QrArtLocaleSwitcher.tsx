/**
 * QrArtLocaleSwitcher.tsx — EN/ES toggle for QR Art AI (next-intl navigation)
 *
 * Styled to match the dark glass header (zinc borders, compact pills) so it
 * feels native beside the gradient CTA. Uses router.replace with the current
 * pathname so /pricing ↔ /es/pricing without losing the segment.
 */

"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function QrArtLocaleSwitcher() {
  const activeLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-1 py-0.5 text-xs font-medium text-zinc-400">
      <button
        type="button"
        onClick={() => router.replace(pathname, { locale: "en" })}
        className={`rounded-md px-2 py-0.5 transition-colors ${
          activeLocale === "en" ? "bg-white/10 text-white" : "hover:text-zinc-200"
        }`}
      >
        EN
      </button>
      <span className="text-white/20">|</span>
      <button
        type="button"
        onClick={() => router.replace(pathname, { locale: "es" })}
        className={`rounded-md px-2 py-0.5 transition-colors ${
          activeLocale === "es" ? "bg-white/10 text-white" : "hover:text-zinc-200"
        }`}
      >
        ES
      </button>
    </div>
  );
}
