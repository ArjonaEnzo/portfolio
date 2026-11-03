"use server";
import React from "react";
import { headers } from "next/headers";
import { Resend } from "resend";
import { validateString } from "@/lib/utils";
import ContactFormEmail from "@/email/contact-form-email";

// Anti-spam for a public form without a database: a honeypot field, a minimum
// fill time and a per-IP limit. The limit lives in memory, so it is per
// serverless instance (best effort), but it stops a script hammering the
// action and burning the Resend quota.
const MIN_FILL_MS = 3_000;
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 10 * 60_000;
const sentByIp = new Map<string, number[]>();

const EMAIL_RE = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]{2,}$/;

// Error codes, not text: the form shows them in the visitor's language.
export type SendEmailError = "invalid" | "rate_limited" | "failed";

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (sentByIp.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (sentByIp.size > 1_000) sentByIp.clear();
  if (recent.length >= RATE_LIMIT) {
    sentByIp.set(ip, recent);
    return true;
  }
  recent.push(now);
  sentByIp.set(ip, recent);
  return false;
}

export const sendEmail = async (formData: FormData) => {
  const rawMessage = formData.get("message");
  const rawEmail = formData.get("senderEmail");

  // Bots fill every field and submit instantly: pretend it worked.
  const honeypot = formData.get("company");
  const startedAt = Number(formData.get("startedAt"));
  if (
    (typeof honeypot === "string" && honeypot !== "") ||
    !Number.isFinite(startedAt) ||
    Date.now() - startedAt < MIN_FILL_MS
  ) {
    return { data: null };
  }

  if (!validateString(rawEmail, 254) || !validateString(rawMessage, 5000)) {
    return { error: "invalid" as SendEmailError };
  }
  const senderEmail = (rawEmail as string).trim();
  const message = (rawMessage as string).trim();
  if (!EMAIL_RE.test(senderEmail)) {
    return { error: "invalid" as SendEmailError };
  }
  if (message.length < 10) {
    return { error: "invalid" as SendEmailError };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return { error: "rate_limited" as SendEmailError };
  }

  try {
    // Created per call: Resend throws without a key, and a throw at module
    // load would crash the whole page instead of showing an error toast.
    const resend = new Resend(process.env.RESEND_API_KEY ?? process.env.RESENT_API_KEY);
    // Resend >= 1 returns API errors instead of throwing them.
    const { data, error } = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: "enzoarjona30@gmail.com",
      subject: "Message from contact form (Portfolio)",
      replyTo: senderEmail,
      react: React.createElement(ContactFormEmail, { message, senderEmail }),
    });
    if (error) {
      // Log the kind of failure only: no message body or sender address.
      console.error("sendEmail: Resend error", error.name);
      return { error: "failed" as SendEmailError };
    }
    return { data };
  } catch (error) {
    console.error("sendEmail: unexpected error", error instanceof Error ? error.name : typeof error);
    return { error: "failed" as SendEmailError };
  }
};
