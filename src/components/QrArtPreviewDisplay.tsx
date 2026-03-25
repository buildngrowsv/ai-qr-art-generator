/**
 * QrArtPreviewDisplay.tsx — Generated image preview, loading, errors, download
 *
 * Static UI strings use next-intl (Preview). Server/API error text passed from the
 * parent stays as-is so operators see real failure reasons when we surface them.
 */

"use client";

import { useTranslations } from "next-intl";

interface QrArtPreviewDisplayProps {
  readonly generatedImageUrl: string | null;
  readonly isCurrentlyGenerating: boolean;
  readonly generationErrorMessage: string | null;
}

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

    setTimeout(() => URL.revokeObjectURL(localBlobUrl), 1000);
  } catch (error) {
    console.error("Failed to download QR art image:", error);
    window.open(imageUrl, "_blank");
  }
}

export default function QrArtPreviewDisplay({
  generatedImageUrl,
  isCurrentlyGenerating,
  generationErrorMessage,
}: QrArtPreviewDisplayProps) {
  const t = useTranslations("Preview");

  return (
    <div className="w-full">
      <div className="relative aspect-square w-full max-w-md mx-auto rounded-2xl border border-white/10 overflow-hidden bg-white/[0.02]">
        {isCurrentlyGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="w-full h-full shimmer-loading-effect" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
              <p className="text-sm text-zinc-400 mt-4">{t("loadingTitle")}</p>
              <p className="text-xs text-zinc-600 mt-1">{t("loadingHint")}</p>
            </div>
          </div>
        )}

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
            <p className="text-xs text-zinc-500">{t("tryAgainHint")}</p>
          </div>
        )}

        {generatedImageUrl && !isCurrentlyGenerating && !generationErrorMessage && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={generatedImageUrl}
            alt={t("altGenerated")}
            className="w-full h-full object-cover"
          />
        )}

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
            <p className="text-sm text-zinc-400">{t("emptyTitle")}</p>
            <p className="text-xs text-zinc-600">{t("emptyHint")}</p>
          </div>
        )}
      </div>

      {generatedImageUrl && !isCurrentlyGenerating && !generationErrorMessage && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
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
            {t("download")}
          </button>
        </div>
      )}
    </div>
  );
}
