import { Resend } from "resend";

export function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY!);
}

// Resend's shared sandbox address. Works with no domain setup, but until
// a real sending domain is verified, Resend will only deliver to the
// email address on the Resend account itself — not to arbitrary
// restaurant owners. Swap this once a domain is verified.
export const EMAIL_FROM = "Cassa Margin <onboarding@resend.dev>";
