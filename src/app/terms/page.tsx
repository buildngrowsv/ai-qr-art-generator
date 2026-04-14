/**
 * /terms redirect page.
 * Canonical page lives at /terms-of-service. This redirect keeps old links working.
 */
import { redirect } from "next/navigation";

export default function TermsRedirect() {
  redirect("/terms-of-service");
}
