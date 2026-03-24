/**
 * DASHBOARD / GENERATE PAGE — QR Art Studio
 *
 * This is the core product page where users actually generate QR art.
 * It needs to be dead simple: enter URL → pick style → click generate → see result.
 *
 * DESIGN DECISIONS:
 * - Two-column layout: left panel for controls, right panel for preview
 * - Style selector uses a grid of style presets (not a dropdown) because
 *   visual selection is critical for a creative tool — users need to SEE
 *   the style before they pick it
 * - The generate button is large and prominent with a gradient that matches
 *   the brand
 * - Results show in a large preview area with download button
 * - Rate limit display shows remaining free generations (builds urgency to upgrade)
 *
 * TECHNICAL NOTES:
 * - Calls /api/generate which proxies to fal.ai ControlNet QR model
 * - Uses client-side state management (useState) — no need for global state
 *   since this page is self-contained
 * - The style presets are hardcoded strings that map to specific prompts
 *   sent to the diffusion model. We tested these prompts to find the ones
 *   that produce the best-looking results while maintaining QR scannability.
 *
 * Created: 2026-03-24 by Coordinator 26 (BridgeSwarm pane1774)
 */

"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * ART_STYLE_PRESETS — Curated list of style prompts that work well with
 * ControlNet QR Code generation. Each style has been tested to produce
 * visually appealing results while maintaining QR code scannability.
 *
 * WHY THESE SPECIFIC STYLES:
 * - Watercolor: Soft, organic feel — popular for wedding/event QR codes
 * - Cyberpunk: Neon colors pop and are eye-catching for tech/gaming
 * - Japanese: Wave/cherry blossom aesthetic — strong demand in Asian markets
 * - Minimal: Clean, professional — best for business cards
 * - Steampunk: Unique mechanical aesthetic — differentiator from competitors
 * - Galaxy: Space theme — popular for social media sharing (viral potential)
 */
const ART_STYLE_PRESETS = [
  { styleId: "watercolor", styleLabel: "Watercolor", stylePromptSuffix: "watercolor painting, soft brushstrokes, flowing colors, artistic" },
  { styleId: "cyberpunk", styleLabel: "Cyberpunk", stylePromptSuffix: "cyberpunk neon city, glowing lights, futuristic, dark background with neon colors" },
  { styleId: "japanese", styleLabel: "Japanese Art", stylePromptSuffix: "japanese ukiyo-e style, great wave, cherry blossoms, traditional japanese art" },
  { styleId: "minimal", styleLabel: "Minimal", stylePromptSuffix: "minimalist geometric design, clean lines, monochrome with accent color" },
  { styleId: "steampunk", styleLabel: "Steampunk", stylePromptSuffix: "steampunk mechanical gears, brass and copper, victorian industrial" },
  { styleId: "galaxy", styleLabel: "Galaxy", stylePromptSuffix: "cosmic galaxy nebula, stars, deep space, purple and blue cosmic clouds" },
  { styleId: "forest", styleLabel: "Enchanted Forest", stylePromptSuffix: "enchanted forest, magical trees, fireflies, mystical atmosphere, green" },
  { styleId: "ocean", styleLabel: "Ocean Waves", stylePromptSuffix: "ocean waves crashing, deep blue sea, foam, dynamic water movement" },
  { styleId: "abstract", styleLabel: "Abstract", stylePromptSuffix: "abstract art, bold geometric shapes, vibrant colors, modern art museum" },
  { styleId: "retro", styleLabel: "Retro 80s", stylePromptSuffix: "retro 80s synthwave, sunset gradient, palm trees, vaporwave aesthetic" },
  { styleId: "floral", styleLabel: "Floral", stylePromptSuffix: "beautiful flowers, roses, botanical illustration, garden, colorful petals" },
  { styleId: "fire", styleLabel: "Fire & Flame", stylePromptSuffix: "flames and fire, ember particles, warm orange and red, dynamic energy" },
];

/**
 * QrArtGenerationDashboardPage — Main generation interface.
 *
 * This is a client component because it manages interactive state:
 * - URL input
 * - Selected style
 * - Custom prompt (optional override)
 * - Generation loading state
 * - Generated image result
 *
 * The component does NOT handle auth or billing — that's handled by
 * the /api/generate endpoint which checks rate limits server-side.
 */
export default function QrArtGenerationDashboardPage() {
  const [targetUrlInput, setTargetUrlInput] = useState("");
  const [selectedStylePresetId, setSelectedStylePresetId] = useState("watercolor");
  const [customPromptOverride, setCustomPromptOverride] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerationInProgress, setIsGenerationInProgress] = useState(false);
  const [generationErrorMessage, setGenerationErrorMessage] = useState<string | null>(null);
  const [remainingFreeGenerationsCount, setRemainingFreeGenerationsCount] = useState(3);

  /**
   * handleGenerateQrArt — Calls the /api/generate endpoint with the URL
   * and style prompt. The API handles the actual fal.ai call and rate limiting.
   *
   * Error handling: We show user-friendly messages for common errors:
   * - Rate limit exceeded → "Upgrade to Pro" CTA
   * - Invalid URL → "Please enter a valid URL"
   * - API error → generic retry message
   */
  async function handleGenerateQrArt() {
    if (!targetUrlInput.trim()) {
      setGenerationErrorMessage("Please enter a URL to generate a QR code for.");
      return;
    }

    setIsGenerationInProgress(true);
    setGenerationErrorMessage(null);
    setGeneratedImageUrl(null);

    try {
      const selectedPreset = ART_STYLE_PRESETS.find(
        (style) => style.styleId === selectedStylePresetId
      );

      const stylePromptToUse = customPromptOverride.trim()
        ? customPromptOverride
        : selectedPreset?.stylePromptSuffix || "beautiful artistic design";

      const generationResponse = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUrl: targetUrlInput,
          stylePrompt: stylePromptToUse,
        }),
      });

      const generationResult = await generationResponse.json();

      if (!generationResponse.ok) {
        if (generationResponse.status === 429) {
          setGenerationErrorMessage(
            "Daily free limit reached. Upgrade to Pro for 50 generations/day."
          );
        } else {
          setGenerationErrorMessage(
            generationResult.error || "Generation failed. Please try again."
          );
        }
        return;
      }

      setGeneratedImageUrl(generationResult.imageUrl);
      setRemainingFreeGenerationsCount((prev) => Math.max(0, prev - 1));
    } catch (fetchError) {
      setGenerationErrorMessage(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setIsGenerationInProgress(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950">
      {/* Top nav bar — minimal, just logo + back to home + upgrade CTA */}
      <nav className="flex items-center justify-between border-b border-white/5 px-6 py-4">
        <Link
          href="/"
          className="text-lg font-semibold text-white hover:text-purple-300 transition-colors"
        >
          QR Art Studio
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-400">
            {remainingFreeGenerationsCount} free generations left today
          </span>
          <Link
            href="/pricing"
            className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-purple-500/25"
          >
            Upgrade to Pro
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* LEFT PANEL — Controls */}
          <div className="space-y-8">
            {/* URL Input */}
            <div>
              <label
                htmlFor="target-url-input"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Enter URL for QR Code
              </label>
              <input
                id="target-url-input"
                type="url"
                placeholder="https://your-website.com"
                value={targetUrlInput}
                onChange={(e) => setTargetUrlInput(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {/* Style Selector Grid */}
            <div>
              <label className="mb-3 block text-sm font-medium text-zinc-300">
                Choose Art Style
              </label>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {ART_STYLE_PRESETS.map((style) => (
                  <button
                    key={style.styleId}
                    onClick={() => setSelectedStylePresetId(style.styleId)}
                    className={`rounded-xl border p-3 text-center text-sm font-medium transition-all ${
                      selectedStylePresetId === style.styleId
                        ? "border-purple-500 bg-purple-500/20 text-purple-300"
                        : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:bg-white/10"
                    }`}
                  >
                    {style.styleLabel}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Prompt Override — for power users who want fine control */}
            <div>
              <label
                htmlFor="custom-prompt-override"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Custom Prompt (optional — overrides style selection)
              </label>
              <textarea
                id="custom-prompt-override"
                placeholder="Describe your ideal QR art style..."
                value={customPromptOverride}
                onChange={(e) => setCustomPromptOverride(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {/* Generate Button — large and prominent */}
            <button
              onClick={handleGenerateQrArt}
              disabled={isGenerationInProgress}
              className={`w-full rounded-xl py-4 text-lg font-semibold text-white transition-all ${
                isGenerationInProgress
                  ? "cursor-not-allowed bg-zinc-700"
                  : "bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02]"
              }`}
            >
              {isGenerationInProgress ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Generating your QR art...
                </span>
              ) : (
                "Generate QR Art"
              )}
            </button>

            {/* Error Message */}
            {generationErrorMessage && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                {generationErrorMessage}
              </div>
            )}
          </div>

          {/* RIGHT PANEL — Preview / Result */}
          <div className="flex flex-col items-center justify-center">
            {generatedImageUrl ? (
              <div className="space-y-4 text-center">
                <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-purple-500/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={generatedImageUrl}
                    alt="Generated QR Art"
                    className="h-auto w-full max-w-md"
                  />
                </div>
                <a
                  href={generatedImageUrl}
                  download="qr-art-studio.png"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
                >
                  📥 Download QR Art
                </a>
              </div>
            ) : (
              /* Placeholder when no image has been generated yet */
              <div className="flex h-96 w-full max-w-md items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/5">
                <div className="text-center">
                  <p className="text-6xl">🎨</p>
                  <p className="mt-4 text-lg font-medium text-zinc-400">
                    Your QR art will appear here
                  </p>
                  <p className="mt-2 text-sm text-zinc-500">
                    Enter a URL and click Generate
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
