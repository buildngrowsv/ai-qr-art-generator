/**
 * QrArtPreviewDisplay.tsx — Shows the generated QR art image with download button
 *
 * PRODUCT CONTEXT: This is the "payoff" component — the moment the user sees their
 * generated QR art. The experience here directly impacts satisfaction and virality.
 * A beautiful preview encourages users to:
 *   1. Download and share the QR art (organic marketing)
 *   2. Generate more (increasing engagement and hitting rate limits → upgrade)
 *   3. Share screenshots on social media (more organic marketing)
 *
 * DESIGN DECISIONS:
 *   - Large preview area with rounded corners and subtle border
 *   - Download button prominently placed below the image
 *   - Loading state uses the shimmer animation (defined in globals.css)
 *   - Error state shows a clear message with retry suggestion
 *
 * CALLED BY: src/app/dashboard/page.tsx (the generate page)
 */

"use client";

/**
 * Props for the QR art preview component.
 * These are controlled by the parent dashboard page based on generation state.
 */
interface QrArtPreviewDisplayProps {
  /** URL of the generated image from fal.ai CDN, or null if no image generated yet */
  readonly generatedImageUrl: string | null;
  /** Whether a generation is currently in progress (shows loading state) */
  readonly isCurrentlyGenerating: boolean;
  /** Error message from a failed generation, or null if no error */
  readonly generationErrorMessage: string | null;
}

/**
 * Triggers a browser download of the generated QR art image.
 *
 * WHY fetch + blob: We can't just use <a download> with a cross-origin URL (fal.ai CDN)
 * because browsers block the download attribute on cross-origin links. Instead, we
 * fetch the image, create a local blob URL, and trigger download from that.
 *
 * @param imageUrl - The fal.ai CDN URL of the generated image
 */
async function downloadGeneratedQrArtImage(imageUrl: string): Promise<void> {
  try {
    const imageResponse = await fetch(imageUrl);
    const imageBlob = await imageResponse.blob();
    const localBlobUrl = URL.createObjectURL(imageBlob);

    const downloadAnchorElement = document.createElement("a");
    downloadAnchorElement.href = localBlobUrl;
    downloadAnchorElement.download = `qr-art-${Date.now()}.png`;
    document.body.appendChild(downloadAnchorElement);
    downloadAnchorElement.click();
    document.body.removeChild(downloadAnchorElement);

    /*
     * Clean up the blob URL after download to free memory.
     * We delay cleanup slightly to ensure the browser has started the download.
     */
    setTimeout(() => URL.revokeObjectURL(localBlobUrl), 1000);
  } catch (error) {
    console.error("Failed to download QR art image:", error);
    /*
     * Fallback: open the image in a new tab so the user can right-click save.
     * This handles cases where fetch fails due to CORS or network issues.
     */
    window.open(imageUrl, "_blank");
  }
}

export default function QrArtPreviewDisplay({
  generatedImageUrl,
  isCurrentlyGenerating,
  generationErrorMessage,
}: QrArtPreviewDisplayProps) {
  return (
    <div className="w-full">
      {/*
       * Preview container — maintains a square aspect ratio to match the
       * QR art output format. The aspect-square class ensures consistent
       * sizing regardless of content.
       */}
      <div className="relative aspect-square w-full max-w-md mx-auto rounded-2xl border border-white/10 overflow-hidden bg-white/[0.02]">
        {/*
         * STATE: Loading — show shimmer animation while fal.ai generates the image.
         * Generation typically takes 10-30 seconds, so we need an engaging loading state.
         */}
        {isCurrentlyGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="w-full h-full shimmer-loading-effect" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
              <p className="text-sm text-zinc-400 mt-4">
                Generating your QR art...
              </p>
              <p className="text-xs text-zinc-600 mt-1">
                This usually takes 10-20 seconds
              </p>
            </div>
          </div>
        )}

        {/*
         * STATE: Error — show error message with guidance.
         * We don't show raw error messages to users (they're often technical).
         * Instead, we show a user-friendly message.
         */}
        {generationErrorMessage && !isCurrentlyGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <p className="text-sm text-red-300">{generationErrorMessage}</p>
            <p className="text-xs text-zinc-500">
              Try again or use a different style prompt
            </p>
          </div>
        )}

        {/*
         * STATE: Success — show the generated QR art image.
         * Uses Next.js Image would be ideal, but since the URL is from fal.ai CDN
         * (external domain), we use a standard img tag to avoid image optimization
         * complexity in v1. We can add next/image with remotePatterns config later.
         */}
        {generatedImageUrl && !isCurrentlyGenerating && !generationErrorMessage && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={generatedImageUrl}
            alt="Generated QR code art — scan with your phone camera to visit the encoded URL"
            className="w-full h-full object-cover"
          />
        )}

        {/*
         * STATE: Empty — no image generated yet, show placeholder.
         * This is the initial state when the user first visits the dashboard.
         * The placeholder text guides the user to take action.
         */}
        {!generatedImageUrl && !isCurrentlyGenerating && !generationErrorMessage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-purple-400"
              >
                <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="11" y="1" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="1" y="11" width="6" height="6" rx="1" fill="currentColor" />
                <rect x="11" y="11" width="3" height="3" rx="0.5" fill="currentColor" />
                <rect x="14" y="14" width="3" height="3" rx="0.5" fill="currentColor" />
              </svg>
            </div>
            <p className="text-sm text-zinc-400">
              Your QR art will appear here
            </p>
            <p className="text-xs text-zinc-600">
              Enter a URL and style, then click Generate
            </p>
          </div>
        )}
      </div>

      {/*
       * Download button — only shown when there's a generated image to download.
       * Placed below the preview for clear visual hierarchy.
       */}
      {generatedImageUrl && !isCurrentlyGenerating && !generationErrorMessage && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => downloadGeneratedQrArtImage(generatedImageUrl)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-white/10 text-sm text-white hover:bg-white/5 hover:border-white/20 transition-all"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download QR Art
          </button>
        </div>
      )}
    </div>
  );
}
