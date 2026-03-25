/**
 * QrArtLandingPageClient.tsx — Locale-aware marketing landing (next-intl)
 *
 * PURPOSE:
 * The full landing experience lives in a client component so we can call
 * useTranslations() for every headline, CTA, and feature card. The API still
 * receives English style prompts from the dashboard presets; only chrome and
 * marketing copy are translated (Builder 25, T13 — matches tattoo/logo pattern).
 *
 * NAVIGATION: All internal links use @/i18n/navigation Link so /es keeps the
 * locale prefix per routing.ts (as-needed: EN unprefixed, ES /es/...).
 */

"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import PricingTierCards from "@/components/PricingTierCards";

type HeroStat = { value: string; label: string };
type StyleExample = { styleLabel: string; gradientColors: string };
type FeatureItem = { title: string; description: string; iconPath: string };
type StepItem = { stepNumber: string; title: string; description: string };
type UseCaseItem = { useCase: string; description: string; icon: string };

export default function QrArtLandingPageClient() {
  const t = useTranslations("Landing");

  const heroStats = t.raw("heroStats") as HeroStat[];
  const styleExamples = t.raw("styleExamples") as StyleExample[];
  const features = t.raw("features") as FeatureItem[];
  const steps = t.raw("steps") as StepItem[];
  const useCases = t.raw("useCases") as UseCaseItem[];

  return (
    <div className="flex flex-col">
      <section className="gradient-hero-background relative overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-1/4 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 mb-8">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-purple-300">{t("heroBadge")}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight max-w-4xl mx-auto leading-tight">
            {t("heroTitleBefore")}{" "}
            <span className="gradient-text-animated">{t("heroTitleAccent")}</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            {t("heroSubtitle")}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-4 rounded-xl font-semibold text-base bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all hover:scale-105"
            >
              {t("tryFree")}
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 rounded-xl font-semibold text-base border border-white/10 text-white hover:bg-white/5 hover:border-white/20 transition-all"
            >
              {t("viewPricing")}
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-8 text-center">
            {heroStats.map((stat, index) => (
              <div key={stat.label} className="flex items-center gap-8">
                {index > 0 && <div className="hidden sm:block h-12 w-px bg-white/10" />}
                <div>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-zinc-400">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {styleExamples.map((example) => (
              <div
                key={example.styleLabel}
                className="aspect-square rounded-2xl border border-white/10 overflow-hidden relative group"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${example.gradientColors} opacity-40 group-hover:opacity-60 transition-opacity`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 18 18"
                    fill="none"
                    className="text-white/30 group-hover:text-white/50 transition-colors"
                  >
                    <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor" />
                    <rect x="11" y="1" width="6" height="6" rx="1" fill="currentColor" />
                    <rect x="1" y="11" width="6" height="6" rx="1" fill="currentColor" />
                    <rect x="11" y="11" width="3" height="3" rx="0.5" fill="currentColor" />
                    <rect x="14" y="14" width="3" height="3" rx="0.5" fill="currentColor" />
                  </svg>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-xs text-white font-medium">{example.styleLabel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              {t("featuresTitleBefore")}{" "}
              <span className="gradient-text-animated">{t("featuresTitleAccent")}</span>
            </h2>
            <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">{t("featuresSubtitle")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] card-glow-on-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center mb-5">
                  <svg
                    className="w-6 h-6 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={feature.iconPath} />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              {t("howTitleBefore")}{" "}
              <span className="gradient-text-animated">{t("howTitleAccent")}</span>
            </h2>
            <p className="mt-4 text-zinc-400">{t("howSubtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step) => (
              <div key={step.stepNumber} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/20 mb-6">
                  <span className="text-2xl font-bold gradient-text-animated">{step.stepNumber}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              {t("useCasesTitleBefore")}{" "}
              <span className="gradient-text-animated">{t("useCasesTitleAccent")}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((item) => (
              <div
                key={item.useCase}
                className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] card-glow-on-hover"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center mb-4">
                  <svg
                    className="w-5 h-5 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-2">{item.useCase}</h3>
                <p className="text-sm text-zinc-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              {t("pricingSectionTitleBefore")}{" "}
              <span className="gradient-text-animated">{t("pricingSectionTitleAccent")}</span>{" "}
              {t("pricingSectionTitleAfter")}
            </h2>
            <p className="mt-4 text-zinc-400">{t("pricingSectionSubtitle")}</p>
          </div>

          <PricingTierCards />
        </div>
      </section>

      <section className="py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {t("finalTitleBefore")}{" "}
            <span className="gradient-text-animated">{t("finalTitleAccent")}</span>
          </h2>
          <p className="text-zinc-400 mb-10 max-w-xl mx-auto">{t("finalBody")}</p>
          <Link
            href="/dashboard"
            className="inline-flex px-10 py-4 rounded-xl font-semibold text-base bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
          >
            {t("finalCta")}
          </Link>
        </div>
      </section>
    </div>
  );
}
