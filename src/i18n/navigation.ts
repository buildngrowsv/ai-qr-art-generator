/**
 * navigation.ts — next-intl locale-aware navigation utilities
 *
 * PURPOSE:
 * Re-exports locale-aware versions of Next.js navigation primitives.
 * Components should import Link, redirect, usePathname, and useRouter
 * from HERE (not from "next/link" or "next/navigation") so that locale
 * prefixes are automatically handled in all navigation actions.
 *
 * For example, when locale is "es":
 *   <Link href="/dashboard"> renders as <a href="/es/dashboard">
 *   useRouter().push("/pricing") navigates to /es/pricing
 *
 * WHY THIS MATTERS: Using Next.js primitives directly bypasses the
 * locale prefix logic and creates broken links in the ES locale.
 *
 * ADDED: 2026-03-24 as part of EN+ES i18n rollout.
 */

import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
