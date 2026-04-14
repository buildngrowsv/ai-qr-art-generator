/**
 * /privacy-policy redirect page.
 * Canonical page lives at /privacy. This redirect keeps old links working.
 */
import { redirect } from "next/navigation";

export default function PrivacyPolicyRedirect() {
  redirect("/privacy");
}
