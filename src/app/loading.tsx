/**
 * loading.tsx — Initial route loading state for QR Art AI.
 */

export default function QrArtAppLoading() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
      <div className="h-12 w-12 rounded-full border-2 border-purple-500/30 border-t-purple-400 animate-spin" />
      <p className="text-zinc-400 text-sm">Loading QR Art AI…</p>
    </div>
  );
}
