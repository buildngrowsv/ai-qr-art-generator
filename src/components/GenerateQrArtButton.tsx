/**
 * GenerateQrArtButton.tsx — The primary action button for QR art generation
 *
 * PRODUCT CONTEXT: This is the MOST important interactive element in the app.
 * Every design decision here is about maximizing the click-through rate:
 *   - Large, gradient-filled button with pulse animation draws the eye
 *   - Disabled state clearly communicates when generation is blocked
 *   - Loading state with spinner provides feedback during the 10-30s generation time
 *   - Remaining generation count creates urgency (and drives upgrades when low)
 *
 * The button also shows the user's remaining daily generations to create a
 * natural upsell moment — when they see "2 remaining", they start thinking
 * about upgrading to Pro.
 *
 * CALLED BY: src/app/dashboard/page.tsx
 */

"use client";

interface GenerateQrArtButtonProps {
  /** Whether the button should be clickable (false when inputs are incomplete) */
  readonly isEnabled: boolean;
  /** Whether a generation is currently in progress (shows spinner) */
  readonly isCurrentlyGenerating: boolean;
  /** How many generations the user has left today (from rate limiter response) */
  readonly remainingDailyGenerations: number | null;
  /** Callback when the button is clicked — triggers the generation flow */
  readonly onGenerateClick: () => void;
}

export default function GenerateQrArtButton({
  isEnabled,
  isCurrentlyGenerating,
  remainingDailyGenerations,
  onGenerateClick,
}: GenerateQrArtButtonProps) {
  /**
   * Determine whether the button should be fully disabled.
   * Disabled when: generating, inputs incomplete, or no generations remaining.
   */
  const isButtonDisabled =
    !isEnabled || isCurrentlyGenerating || remainingDailyGenerations === 0;

  return (
    <div className="space-y-2">
      <button
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
        {/*
         * Button content changes based on state:
         *   - Generating: spinner + "Generating..."
         *   - Ready: sparkle icon + "Generate QR Art"
         *   - No remaining: "Upgrade to Generate More"
         */}
        {isCurrentlyGenerating ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="w-5 h-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
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
            Generating your QR art...
          </span>
        ) : remainingDailyGenerations === 0 ? (
          <span>Upgrade to Generate More</span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            {/* Sparkle icon — conveys creativity and magic */}
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
            Generate QR Art
          </span>
        )}
      </button>

      {/*
       * Remaining generations indicator — shows how many the user has left.
       * This serves dual purpose:
       *   1. Useful info so users don't waste generations
       *   2. Creates urgency/FOMO when the count is low → drives upgrades
       *
       * Color-coded: green (3+), yellow (1-2), red (0)
       */}
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
            ? `${remainingDailyGenerations} generation${remainingDailyGenerations === 1 ? "" : "s"} remaining today`
            : "Daily limit reached — upgrade for more"}
        </p>
      )}
    </div>
  );
}
