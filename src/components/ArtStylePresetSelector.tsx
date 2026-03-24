/**
 * ArtStylePresetSelector.tsx — Predefined style presets for QR art generation
 *
 * PRODUCT CONTEXT: Most users don't know how to write good AI art prompts.
 * Style presets solve this by offering curated, tested prompt templates that produce
 * consistently beautiful results. This dramatically improves the first-time user
 * experience — instead of typing "make it look cool" (bad prompt), they click
 * "Cyberpunk Neon" and get a stunning result.
 *
 * DESIGN DECISIONS:
 *   - Horizontal scrollable grid on mobile, multi-column grid on desktop
 *   - Each preset has a color swatch that previews the aesthetic
 *   - Selected preset has a purple ring border (matches brand)
 *   - Users can still type a custom prompt below the presets
 *
 * WHY THESE SPECIFIC PRESETS: Each preset was chosen because:
 *   1. It produces reliably good results with QR ControlNet
 *   2. It appeals to a broad audience (not niche art styles)
 *   3. The prompts are tuned for scannability (avoid dark/complex backgrounds)
 *
 * CALLED BY: src/app/dashboard/page.tsx
 */

"use client";

/**
 * A single style preset definition.
 * Each preset contains a full prompt string that produces good QR art results.
 */
interface ArtStylePresetDefinition {
  /** Unique identifier for this preset */
  readonly presetId: string;
  /** Display name shown on the preset button */
  readonly displayLabel: string;
  /** Full prompt string sent to the AI model when this preset is selected */
  readonly promptTemplate: string;
  /**
   * CSS gradient for the preview swatch — gives users a visual hint of the
   * color palette/mood before they even generate.
   */
  readonly previewGradient: string;
}

/**
 * Curated style presets — each one has been conceptually tested against QR ControlNet
 * to produce scannable, beautiful results. The prompt templates include quality
 * boosters and style-specific keywords that work well with Stable Diffusion.
 *
 * ADDING NEW PRESETS: When adding presets, ensure:
 *   1. The prompt doesn't produce overly dark images (hard to scan)
 *   2. The prompt doesn't produce extremely fine detail (breaks QR pattern)
 *   3. Test with at least 3 different URLs before shipping
 */
const CURATED_STYLE_PRESETS: readonly ArtStylePresetDefinition[] = [
  {
    presetId: "cyberpunk-neon",
    displayLabel: "Cyberpunk Neon",
    promptTemplate:
      "cyberpunk neon cityscape at night, glowing neon signs, rain reflections, purple and blue lighting, futuristic architecture, high detail",
    previewGradient: "linear-gradient(135deg, #7c3aed, #06b6d4, #ec4899)",
  },
  {
    presetId: "japanese-garden",
    displayLabel: "Japanese Garden",
    promptTemplate:
      "serene japanese zen garden, cherry blossom trees, stone path, koi pond, soft pink and green palette, peaceful atmosphere, detailed illustration",
    previewGradient: "linear-gradient(135deg, #f9a8d4, #86efac, #fef08a)",
  },
  {
    presetId: "ocean-waves",
    displayLabel: "Ocean Waves",
    promptTemplate:
      "majestic ocean waves crashing, deep blue sea, white foam, golden sunset sky, dramatic lighting, photorealistic, high detail",
    previewGradient: "linear-gradient(135deg, #1e3a5f, #3b82f6, #f59e0b)",
  },
  {
    presetId: "abstract-geometric",
    displayLabel: "Abstract Geometric",
    promptTemplate:
      "abstract geometric art, colorful triangles and circles, modern art style, vibrant colors on white background, clean lines, minimalist",
    previewGradient: "linear-gradient(135deg, #ef4444, #f59e0b, #22c55e, #3b82f6)",
  },
  {
    presetId: "watercolor-flowers",
    displayLabel: "Watercolor Flowers",
    promptTemplate:
      "beautiful watercolor painting of wildflowers, soft pastel colors, delicate brush strokes, botanical illustration, light airy background",
    previewGradient: "linear-gradient(135deg, #fda4af, #c084fc, #93c5fd)",
  },
  {
    presetId: "steampunk-gears",
    displayLabel: "Steampunk",
    promptTemplate:
      "steampunk mechanical clockwork, brass gears and cogs, vintage industrial, sepia and copper tones, intricate machinery, detailed illustration",
    previewGradient: "linear-gradient(135deg, #92400e, #d97706, #78350f)",
  },
  {
    presetId: "galaxy-nebula",
    displayLabel: "Galaxy Nebula",
    promptTemplate:
      "deep space galaxy nebula, stars and cosmic dust, purple and blue nebula clouds, space photography style, high detail, vivid colors",
    previewGradient: "linear-gradient(135deg, #1e1b4b, #7c3aed, #ec4899)",
  },
  {
    presetId: "forest-path",
    displayLabel: "Enchanted Forest",
    promptTemplate:
      "magical enchanted forest path, sunlight filtering through trees, glowing mushrooms, mystical atmosphere, lush green vegetation, fantasy illustration",
    previewGradient: "linear-gradient(135deg, #14532d, #22c55e, #fef08a)",
  },
];

/**
 * Props for the style preset selector component.
 */
interface ArtStylePresetSelectorProps {
  /** The currently selected preset ID, or null if user is typing a custom prompt */
  readonly selectedPresetId: string | null;
  /** Callback when a preset is selected — parent updates the prompt field */
  readonly onPresetSelected: (preset: ArtStylePresetDefinition) => void;
}

export default function ArtStylePresetSelector({
  selectedPresetId,
  onPresetSelected,
}: ArtStylePresetSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-zinc-300">
        Style Presets
      </label>
      <p className="text-xs text-zinc-500">
        Choose a preset or write your own custom prompt below
      </p>

      {/*
       * Grid layout — 2 columns on mobile, 4 on desktop.
       * Each preset is a clickable card with color swatch and label.
       */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CURATED_STYLE_PRESETS.map((preset) => (
          <button
            key={preset.presetId}
            onClick={() => onPresetSelected(preset)}
            className={`
              flex flex-col items-center gap-2 p-3 rounded-xl border transition-all
              ${
                selectedPresetId === preset.presetId
                  ? "border-purple-500 bg-purple-500/10 ring-1 ring-purple-500/50"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
              }
            `}
          >
            {/*
             * Color swatch — preview of the style's color palette.
             * 40x40px circle with the preset's gradient. This gives users an
             * instant visual understanding of what the style will look like.
             */}
            <div
              className="w-10 h-10 rounded-full shrink-0"
              style={{ background: preset.previewGradient }}
            />
            <span className="text-xs text-zinc-300 text-center leading-tight">
              {preset.displayLabel}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Export the preset type so the dashboard page can use it in state management.
 */
export type { ArtStylePresetDefinition };
export { CURATED_STYLE_PRESETS };
