/**
 * GenerateQrArtButton.tsx — Primary generation CTA on the dashboard
 *
 * Copy is translated via next-intl (GenerateButton namespace). Pluralization for
 * remaining counts uses ICU messages in en.json / es.json.
 */

"use client";

import { useTranslations } from "next-intl";

interface GenerateQrArtButtonProps {
  readonly isEnabled: boolean;
  readonly isCurrentlyGenerating: boolean;
  readonly remainingDailyGenerations: number | null;
  readonly onGenerateClick: () => void;
}

export default function GenerateQrArtButton({
  isEnabled,
  isCurrentlyGenerating,
  remainingDailyGenerations,
  onGenerateClick,
}: GenerateQrArtButtonProps) {
  const t = useTranslations("GenerateButton");

  const isButtonDisabled =
    !isEnabled || isCurrentlyGenerating || remainingDailyGenerations === 0;

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onGenerateClick}
        disabled={isButtonDisabled}
        className={`
          w-full py-4 rounded-xl font-semibold text-base transition-all relative overflow-hidden
          ${
            isButtonDisabled
              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 pulse-ring-animation"
          }
        `}
      >
        {isCurrentlyGenerating ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {t("loading")}
          </span>
        ) : remainingDailyGenerations === 0 ? (
          <span>{t("upgrade")}</span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
            {t("cta")}
          </span>
        )}
      </button>

      {remainingDailyGenerations !== null && (
        <p
          className={`text-xs text-center ${
            remainingDailyGenerations > 2
              ? "text-zinc-500"
              : remainingDailyGenerations > 0
                ? "text-amber-400"
                : "text-red-400"
          }`}
        >
          {remainingDailyGenerations > 0
            ? t("remaining", { count: remainingDailyGenerations })
            : t("dailyLimit")}
        </p>
      )}
    </div>
  );
}
