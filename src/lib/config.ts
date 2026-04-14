/**
 * Product Configuration — single source of truth for this clone.
 */

export interface ProductPricingTier {
  readonly price: number;
  readonly limit: number;
  readonly period: "day" | "month";
}

export interface ProductConfiguration {
  readonly name: string;
  readonly tagline: string;
  readonly description: string;
  readonly falModelIdentifier: string;
  readonly inputType: "image" | "text" | "both";
  readonly pricing: {
    readonly free: ProductPricingTier;
    readonly basic: ProductPricingTier;
    readonly pro: ProductPricingTier;
  };
}

export const PRODUCT_CONFIG: ProductConfiguration = {
  name: "QRArtAI",
  tagline: "QRArtAI — AI-powered tool",
  description: "Create professional results in seconds using AI.",
  falModelIdentifier: "fal-ai/flux/dev/image-to-image",
  inputType: "image",
  pricing: {
    free: { price: 0, limit: 3, period: "day" },
    basic: { price: 4.99, limit: 50, period: "month" },
    pro: { price: 9.99, limit: -1, period: "month" },
  },
};
