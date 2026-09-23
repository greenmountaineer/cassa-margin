import { Resend } from "resend";

export function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY!);
}

// cassamargin.com is verified with Resend (SPF, DKIM, DMARC all in place),
// so sends go out from our own domain instead of the shared resend.dev
// sandbox — the sandbox is what was landing in spam.
export const EMAIL_FROM = "Cassa Margin <digest@cassamargin.com>";
