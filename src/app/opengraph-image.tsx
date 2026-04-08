/**
 * Dynamically generated Open Graph image for ai-qr-art-generator.
 *
 * WHY THIS APPROACH: A static PNG in /public could get stale; this generates
 * on-demand (and is CDN-cached by Vercel). No external service needed — built
 * into Next.js ImageResponse / edge runtime.
 *
 * Brand colors:
 *   Accent:       #8b5cf6  (purple-500)
 *   Accent light: #a78bfa  (purple-400)
 *   Accent RGB:   139, 92, 246
 *   Domain:       qrart.symplyai.io
 */

import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "edge";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#09090b",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, rgba(139,92,246,0.15) 0%, transparent 55%), radial-gradient(circle at 75% 75%, rgba(139,92,246,0.12) 0%, transparent 55%)",
          padding: "60px 80px",
          position: "relative",
        }}
      >
        <div style={{ fontSize: 72, marginBottom: 24, lineHeight: 1 }}>📱</div>

        <div
          style={{
            display: "flex",
            fontSize: 80,
            fontWeight: 800,
            letterSpacing: "-3px",
            lineHeight: 1.0,
            background:
              "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #8b5cf6 100%)",
            backgroundClip: "text",
            color: "transparent",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          QR Art AI
        </div>

        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.75)",
            textAlign: "center",
            fontWeight: 400,
            maxWidth: 800,
            marginBottom: 40,
          }}
        >
          Turn any link into stunning, scannable QR code art with AI
        </div>

        <div
          style={{
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {["QR Code Art", "Custom Designs", "AI Generated"].map((badge) => (
            <div
              key={badge}
              style={{
                background: "rgba(139,92,246,0.10)",
                border: "1px solid rgba(139,92,246,0.28)",
                borderRadius: 9999,
                padding: "8px 20px",
                fontSize: 17,
                color: "#8b5cf6",
                fontWeight: 500,
              }}
            >
              {badge}
            </div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 20,
            color: "rgba(255,255,255,0.30)",
          }}
        >
          qrart.symplyai.io
        </div>
      </div>
    ),
    { ...size }
  );
}
