/**
 * StripePricingConfiguration.ts — Centralized pricing tier definitions
 *
 * WHY THIS FILE EXISTS: All pricing-related data (tier names, prices, limits, features,
 * Stripe Price IDs) lives in this single file so that pricing changes only need to
 * happen in one place. The landing page, pricing page, dashboard, and API rate limiter
 * all reference this file.
 *
 * PRODUCT CONTEXT: We offer three tiers designed around a classic freemium funnel:
 *   - Free: Low limit (3/day) to let users try the product and see quality
 *   - Pro ($9/mo): Sweet spot for individual creators, designers, marketers
 *   - Business ($29/mo): Unlimited for agencies, teams, heavy users
 *
 * PRICING RATIONALE (decided by user, March 2026):
 *   - $9/mo Pro is accessible enough that individual freelancers will pay
 *   - $29/mo Business is cheap enough for agencies but 3x Pro to encourage team plans
 *   - Free tier exists to build trust — users need to see the quality before paying
 *   - 3/day free limit is enough to test but not enough to avoid paying for real use
 *   - 50/day Pro limit is generous enough that most individuals never hit it
 *
 * IMPORTANT: The Stripe Price IDs below are PLACEHOLDERS. Before going live,
 * you must create actual products and prices in the Stripe Dashboard and replace
 * these IDs. The format is price_XXXXXXXXX.
 */

/**
 * Represents a single pricing tier with all the data needed to render pricing cards,
 * enforce rate limits, and create Stripe checkout sessions.
 */
export interface PricingTierDefinition {
  /** Machine-readable identifier used in API calls and database records */
  readonly tierId: string;
  /** Human-readable name shown on pricing cards and in the dashboard */
  readonly displayName: string;
  /** Monthly price in USD cents (0 for free tier) */
  readonly monthlyPriceInCents: number;
  /** Formatted price string for display (e.g., "$9", "Free") */
  readonly displayPrice: string;
  /** Maximum number of QR art generations allowed per day */
  readonly dailyGenerationLimit: number;
  /** Human-readable limit description for pricing cards */
  readonly limitDescription: string;
  /** Feature list shown on pricing cards — each string is one bullet point */
  readonly featureList: readonly string[];
  /**
   * Stripe Price ID for this tier's monthly subscription.
   * null for the free tier (no Stripe subscription needed).
   * MUST be replaced with real Stripe Price IDs before launch.
   */
  readonly stripePriceId: string | null;
  /** Whether this tier should be visually highlighted as "recommended" */
  readonly isRecommendedTier: boolean;
  /** Short tagline shown under the tier name on pricing cards */
  readonly tagline: string;
}

/**
 * All pricing tiers in display order (Free, Pro, Business).
 *
 * This array is the single source of truth for pricing across the entire app.
 * When you need to change pricing, limits, or features, change them HERE.
 */
export const ALL_PRICING_TIERS: readonly PricingTierDefinition[] = [
  {
    tierId: "free",
    displayName: "Free",
    monthlyPriceInCents: 0,
    displayPrice: "Free",
    dailyGenerationLimit: 3,
    limitDescription: "3 generations per day",
    featureList: [
      "3 QR art generations per day",
      "Standard quality (512x512)",
      "Basic style presets",
      "PNG download",
      "Community support",
    ],
    stripePriceId: null,
    isRecommendedTier: false,
    tagline: "Try it out",
  },
  {
    tierId: "pro",
    displayName: "Pro",
    monthlyPriceInCents: 900,
    displayPrice: "$9",
    dailyGenerationLimit: 50,
    limitDescription: "50 generations per day",
    featureList: [
      "50 QR art generations per day",
      "HD quality (1024x1024)",
      "All style presets + custom prompts",
      "PNG & SVG download",
      "Priority generation queue",
      "Email support",
    ],
    /*
     * Real Price ID from Stripe Dashboard (recurring monthly "QR Art Pro").
     * Set NEXT_PUBLIC_STRIPE_PRICE_ID_PRO on Vercel so the client can POST it
     * to /api/stripe/checkout. Without it, use NEXT_PUBLIC_STRIPE_PAYMENT_LINK_PRO
     * in PricingTierCards for hosted Payment Links instead.
     */
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO?.trim() || null,
    isRecommendedTier: true,
    tagline: "Most popular",
  },
  {
    tierId: "business",
    displayName: "Business",
    monthlyPriceInCents: 2900,
    displayPrice: "$29",
    dailyGenerationLimit: Infinity,
    limitDescription: "Unlimited generations",
    featureList: [
      "Unlimited QR art generations",
      "Ultra HD quality (2048x2048)",
      "All style presets + custom prompts",
      "PNG, SVG & PDF download",
      "Priority generation queue",
      "API access (coming soon)",
      "Dedicated support",
      "Commercial license",
    ],
    /*
     * Real Price ID for Business tier, or Payment Link env in the UI layer.
     */
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_BUSINESS?.trim() || null,
    isRecommendedTier: false,
    tagline: "For teams & agencies",
  },
] as const;

/**
 * Helper to look up a pricing tier by its machine-readable ID.
 * Used by the rate limiter and dashboard to determine a user's limits.
 *
 * @param tierId - The tier ID to look up (e.g., "free", "pro", "business")
 * @returns The matching PricingTierDefinition or undefined if not found
 */
export function findPricingTierById(
  tierId: string
): PricingTierDefinition | undefined {
  return ALL_PRICING_TIERS.find((tier) => tier.tierId === tierId);
}

/**
 * Helper to find the tier associated with a Stripe Price ID.
 * Used in the webhook handler to determine which tier a new subscriber should get.
 *
 * @param stripePriceId - The Stripe Price ID from a checkout.session.completed event
 * @returns The matching PricingTierDefinition or undefined if not found
 */
export function findPricingTierByStripePriceId(
  stripePriceId: string
): PricingTierDefinition | undefined {
  return ALL_PRICING_TIERS.find((tier) => tier.stripePriceId === stripePriceId);
}
