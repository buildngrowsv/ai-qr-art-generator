/**
 * dashboard/page.tsx — QR Art Generation Dashboard
 *
 * PRODUCT CONTEXT: This is the CORE of the product — where users actually generate
 * QR art. The page is designed as a two-column layout:
 *   - Left column: Input controls (URL, style presets, custom prompt, generate button)
 *   - Right column: Preview area (shows generated image or loading/empty state)
 *
 * USER FLOW:
 *   1. User enters a URL they want to encode
 *   2. User selects a style preset OR types a custom prompt
 *   3. User clicks "Generate QR Art"
 *   4. Loading spinner shows while fal.ai processes (10-30 seconds)
 *   5. Generated image appears in the preview area
 *   6. User can download the image or generate again
 *
 * DESIGN DECISIONS:
 *   - Two-column layout maximizes screen real estate and keeps inputs near the preview
 *   - Style presets are prominently displayed because they produce better results
 *   - The remaining generations counter creates natural upgrade pressure
 *   - Mobile: stacks to single column with inputs on top
 */

"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ArtStylePresetSelector from "@/components/ArtStylePresetSelector";
import type { ArtStylePresetDefinition } from "@/components/ArtStylePresetSelector";
import QrArtPreviewDisplay from "@/components/QrArtPreviewDisplay";
import GenerateQrArtButton from "@/components/GenerateQrArtButton";

export default function QrArtGenerationDashboardPage() {
  const t = useTranslations("Dashboard");
  /**
   * STATE MANAGEMENT — individual useState hooks for independent state pieces.
   * Simpler than useReducer for this level of complexity.
   */
  const [targetUrlInput, setTargetUrlInput] = useState("");
  const [stylePromptInput, setStylePromptInput] = useState("");
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isCurrentlyGenerating, setIsCurrentlyGenerating] = useState(false);
  const [generationErrorMessage, setGenerationErrorMessage] = useState<string | null>(null);
  const [remainingDailyGenerations, setRemainingDailyGenerations] = useState<number | null>(null);

  /**
   * When a style preset is selected, update both the preset highlight and the prompt field.
   */
  const handleStylePresetSelection = useCallback(
    (preset: ArtStylePresetDefinition) => {
      setSelectedPresetId(preset.presetId);
      setStylePromptInput(preset.promptTemplate);
    },
    []
  );

  /**
   * When user manually edits the prompt, deselect any preset since
   * the prompt no longer matches a preset exactly.
   */
  const handleStylePromptManualEdit = useCallback(
    (newPromptValue: string) => {
      setStylePromptInput(newPromptValue);
      setSelectedPresetId(null);
    },
    []
  );

  /**
   * Main generation handler — calls /api/generate which handles rate limiting + fal.ai.
   *
   * We call our API route (not fal.ai directly) because:
   *   - FAL_KEY stays server-side (security)
   *   - Server-side rate limiting can't be bypassed by client
   *   - Server-side logging helps debug and track usage
   */
  const handleGenerateQrArtClick = useCallback(async () => {
    if (!targetUrlInput.trim()) {
      setGenerationErrorMessage(t("errorUrlRequired"));
      return;
    }
    if (!stylePromptInput.trim()) {
      setGenerationErrorMessage(t("errorPromptRequired"));
      return;
    }

    setIsCurrentlyGenerating(true);
    setGenerationErrorMessage(null);
    setGeneratedImageUrl(null);

    try {
      const generateApiResponse = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUrl: targetUrlInput.trim(),
          stylePrompt: stylePromptInput.trim(),
        }),
      });

      const generateApiData = await generateApiResponse.json();

      if (!generateApiResponse.ok) {
        if (generateApiResponse.status === 429) {
          setGenerationErrorMessage(t("errorRateLimit"));
          setRemainingDailyGenerations(0);
        } else {
          setGenerationErrorMessage(generateApiData.error || t("errorGeneric"));
        }
        return;
      }

      setGeneratedImageUrl(generateApiData.generatedImageUrl);
      setRemainingDailyGenerations(generateApiData.remainingGenerations);
    } catch (networkError) {
      console.error("Network error during QR art generation:", networkError);
      setGenerationErrorMessage(t("errorNetwork"));
    } finally {
      setIsCurrentlyGenerating(false);
    }
  }, [targetUrlInput, stylePromptInput, t]);

  const isGenerateButtonEnabled =
    targetUrlInput.trim().length > 0 && stylePromptInput.trim().length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">
          {t("titleBefore")}{" "}
          <span className="gradient-text-animated">{t("titleAccent")}</span>
        </h1>
        <p className="mt-2 text-zinc-400">{t("subtitle")}</p>
      </div>

      {/*
       * Two-column layout — inputs on left, preview on right.
       * Stacks on mobile with inputs on top.
       */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* LEFT COLUMN: Input controls */}
        <div className="space-y-6">
          {/* URL Input */}
          <div className="space-y-2">
            <label
              htmlFor="target-url-input"
              className="block text-sm font-medium text-zinc-300"
            >
              {t("urlLabel")}
            </label>
            <input
              id="target-url-input"
              type="url"
              value={targetUrlInput}
              onChange={(e) => setTargetUrlInput(e.target.value)}
              placeholder={t("urlPlaceholder")}
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
            />
            <p className="text-xs text-zinc-600">{t("urlHint")}</p>
          </div>

          {/* Style preset selector */}
          <ArtStylePresetSelector
            selectedPresetId={selectedPresetId}
            onPresetSelected={handleStylePresetSelection}
          />

          {/* Custom prompt textarea */}
          <div className="space-y-2">
            <label
              htmlFor="style-prompt-textarea"
              className="block text-sm font-medium text-zinc-300"
            >
              {t("stylePromptLabel")}
            </label>
            <textarea
              id="style-prompt-textarea"
              value={stylePromptInput}
              onChange={(e) => handleStylePromptManualEdit(e.target.value)}
              placeholder={t("stylePromptPlaceholder")}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none"
            />
            <p className="text-xs text-zinc-600">{t("stylePromptHint")}</p>
          </div>

          {/* Generate button */}
          <GenerateQrArtButton
            isEnabled={isGenerateButtonEnabled}
            isCurrentlyGenerating={isCurrentlyGenerating}
            remainingDailyGenerations={remainingDailyGenerations}
            onGenerateClick={handleGenerateQrArtClick}
          />
        </div>

        {/* RIGHT COLUMN: Preview area */}
        <div className="flex items-start justify-center lg:pt-8">
          <QrArtPreviewDisplay
            generatedImageUrl={generatedImageUrl}
            isCurrentlyGenerating={isCurrentlyGenerating}
            generationErrorMessage={generationErrorMessage}
          />
        </div>
      </div>
    </div>
  );
}
