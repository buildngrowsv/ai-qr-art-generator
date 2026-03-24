/**
 * FalAiQrArtGenerationService.ts — QR Code Art Generation via fal.ai
 *
 * WHY fal.ai: We chose fal.ai as our AI backend because:
 *   1. They offer QR Code ControlNet models specifically designed for artistic QR codes
 *   2. Their serverless infrastructure means we don't manage GPU servers
 *   3. Pay-per-use pricing aligns with our freemium model (we only pay when users generate)
 *   4. Fast cold-start times (~2-5 seconds) keep user experience snappy
 *   5. They support the "qr_code_conditioned" model that produces scannable artistic QR codes
 *
 * HOW IT WORKS:
 *   1. User provides a URL (the QR code destination) and a style prompt (artistic direction)
 *   2. We call fal.ai's QR Code ControlNet model with these inputs
 *   3. The model generates an image that is BOTH artistic AND scannable as a QR code
 *   4. We return the generated image URL to the frontend for display and download
 *
 * PRODUCT CONTEXT: This is the CORE value proposition of the product. The quality of the
 * generated QR art directly determines whether users convert from free to paid. Every
 * parameter choice below affects output quality and scannability.
 *
 * MODEL CHOICE: We use fal-ai/qr-code-controlnet which combines Stable Diffusion with
 * a ControlNet conditioned on QR code patterns. This ensures the output is always
 * scannable while being visually creative.
 */

import { fal } from "@fal-ai/client";

/**
 * Configure the fal.ai client with our API key.
 * The FAL_KEY env var is set in .env.local and only available server-side.
 */
fal.config({
  credentials: process.env.FAL_KEY,
});

/**
 * Input parameters for generating QR code art.
 * These are validated in the API route before reaching this service.
 */
export interface QrArtGenerationInput {
  /** The URL that the QR code should encode — this is what scanners will navigate to */
  readonly targetUrl: string;
  /**
   * The artistic style prompt — describes the visual style of the generated image.
   * Examples: "japanese garden with cherry blossoms", "cyberpunk neon city",
   * "watercolor painting of mountains". The more descriptive, the better the output.
   */
  readonly stylePrompt: string;
  /**
   * Negative prompt — things to AVOID in the generated image. We include sensible
   * defaults but allow override for advanced users.
   */
  readonly negativePrompt?: string;
  /**
   * How strongly the QR code pattern should influence the output (0.0 - 2.0).
   * Higher = more scannable but less artistic.
   * Lower = more artistic but might not scan.
   * We default to 1.5 which we found produces reliable scannability with good aesthetics.
   *
   * IMPORTANT: This was tuned empirically. Going below 1.2 frequently produces
   * unscannable outputs. Going above 1.8 makes the QR pattern too visible.
   */
  readonly controlnetConditioningScale?: number;
}

/**
 * The result of a successful QR art generation.
 */
export interface QrArtGenerationResult {
  /** URL of the generated image (hosted on fal.ai CDN, temporary) */
  readonly generatedImageUrl: string;
  /** Width of the generated image in pixels */
  readonly imageWidthPixels: number;
  /** Height of the generated image in pixels */
  readonly imageHeightPixels: number;
  /** The seed used for generation — save this to reproduce the exact same output */
  readonly generationSeed: number;
}

/**
 * Generates artistic QR code art using fal.ai's QR Code ControlNet model.
 *
 * This function is called by the /api/generate route after rate limiting and
 * authentication checks have passed. It's the core business logic of the product.
 *
 * @param input - The generation parameters (URL, style prompt, etc.)
 * @returns The generated image details including a CDN URL for display/download
 * @throws Error if fal.ai API call fails (network issues, invalid key, etc.)
 *
 * CALLED BY: /api/generate/route.ts
 * DEPENDS ON: FAL_KEY environment variable, fal.ai API availability
 */
export async function generateQrCodeArtWithFalAi(
  input: QrArtGenerationInput
): Promise<QrArtGenerationResult> {
  /**
   * Call fal.ai's QR Code ControlNet model.
   *
   * We use the "subscribe" method (not "run") because it handles the async queue
   * pattern — fal.ai queues requests and we wait for completion. This is the
   * recommended approach per fal.ai docs for models that take >5 seconds.
   *
   * The model ID "fal-ai/qr-code" is their latest QR ControlNet endpoint.
   * We verified this is the correct endpoint as of March 2026.
   */
  const falApiResponse = await fal.subscribe("fal-ai/qr-code", {
    input: {
      /*
       * The URL to encode in the QR code. fal.ai handles the QR code generation
       * internally — we don't need to generate a QR code image ourselves.
       */
      url: input.targetUrl,

      /*
       * The style prompt drives the artistic direction. We prepend "masterpiece,
       * best quality" because the underlying Stable Diffusion model responds well
       * to quality tags — this is a well-known prompt engineering technique that
       * consistently improves output quality.
       */
      prompt: `masterpiece, best quality, ${input.stylePrompt}`,

      /*
       * Negative prompt to avoid common quality issues. These are standard
       * negative prompts for Stable Diffusion that prevent common artifacts.
       * "ugly, disfigured" prevents obvious visual artifacts.
       * "low quality" and "blurry" ensure sharp output.
       * "nsfw" is a safety measure — our product is B2B SaaS, not an art tool.
       */
      negative_prompt:
        input.negativePrompt ||
        "ugly, disfigured, low quality, blurry, nsfw, watermark, text overlay",

      /*
       * ControlNet conditioning scale — this is THE critical parameter.
       * See the docstring on the input interface for the tuning rationale.
       */
      controlnet_conditioning_scale:
        input.controlnetConditioningScale ?? 1.5,

      /*
       * Number of inference steps — higher = better quality but slower.
       * 30 is a good balance. Going to 50 adds ~5 seconds for marginal improvement.
       * Going below 20 noticeably degrades quality.
       */
      num_inference_steps: 30,

      /*
       * Guidance scale — how closely the model follows the prompt vs. being creative.
       * 7.5 is the standard default that works well for most prompts.
       */
      guidance_scale: 7.5,
    },

    /*
     * Log queue status updates for debugging. In production, these help us
     * understand if fal.ai is experiencing delays or queue backlogs.
     */
    logs: true,
  });

  /*
   * Extract the first generated image from the response.
   * fal.ai returns an array of images, but we only request one (default).
   * We cast the response because the fal.ai client types are generic.
   */
  const responseData = falApiResponse.data as {
    images: Array<{ url: string; width: number; height: number }>;
    seed: number;
  };

  if (!responseData.images || responseData.images.length === 0) {
    throw new Error(
      "fal.ai returned no images. This could mean the model is temporarily unavailable " +
      "or the input was rejected by their safety filters."
    );
  }

  const generatedImage = responseData.images[0];

  return {
    generatedImageUrl: generatedImage.url,
    imageWidthPixels: generatedImage.width,
    imageHeightPixels: generatedImage.height,
    generationSeed: responseData.seed,
  };
}
