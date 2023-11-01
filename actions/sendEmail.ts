"use server";
import React from "react";
import { Resend } from "resend";
import { getErrorMessage, validateString } from "@/lib/utils";
import ContactFormEmail from "@/email/contact-form-email";

const resend = new Resend(process.env.RESENT_API_KEY);

export const sendEmail = async (formData: FormData) => {
  console.log(formData);
  const message = formData.get("message");
  const senderEmail = formData.get("senderEmail");

  if (!validateString(senderEmail, 500)) {
    return { error: "Invalid sender email" };
  }

  if (!validateString(message, 5000)) {
    return { error: "Invalid message" };
  }
  let data;
  try {
    data = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: "enzoarjona30@gmail.com",
      subject: "Message from contact from (Porfolio)",
      reply_to: senderEmail as string,
      react: React.createElement(ContactFormEmail, {
        message: message as string,
        senderEmail: senderEmail as string,
      }),
    });
    console.log(data);
  } catch (error) {
    console.log(error);
    return {
      error: getErrorMessage(error),
    };
  }
  return { data };
};
