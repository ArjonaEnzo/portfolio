"use server";
import React from "react";
import { Resend } from "resend";
import { getErrorMessage, validateString } from "@/lib/utils";
import ContactFormEmail from "@/email/contact-form-email";

export const sendEmail = async (formData: FormData) => {
  const message = formData.get("message");
  const senderEmail = formData.get("senderEmail");

  if (!validateString(senderEmail, 500)) {
    return { error: "Invalid sender email" };
  }

  if (!validateString(message, 5000)) {
    return { error: "Invalid message" };
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
      replyTo: senderEmail as string,
      react: React.createElement(ContactFormEmail, {
        message: message as string,
        senderEmail: senderEmail as string,
      }),
    });
    if (error) return { error: error.message };
    return { data };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};
