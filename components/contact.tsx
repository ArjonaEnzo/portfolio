"use client";
import React from "react";
import { SectionHeading } from "./section-heading";
import { motion } from "framer-motion";
import { useSectioninView } from "@/lib/hooks";
import { sendEmail } from "@/actions/sendEmail";
import { SubmitBtn } from "./submit-btn";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/language-context";

export default function Contact() {
  const { language } = useLanguage();
  const sectionName = language === "ENG" ? "Contact" : "Contacto";
  const { ref } = useSectioninView(sectionName, 0.5);

  return (
    <motion.section
      id="contact"
      ref={ref}
      className="mb-20 sm:mb-28 w-[min(100%,38rem)] text-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <SectionHeading>
        {language === "ENG" ? "Contact me" : "Contáctame"}
      </SectionHeading>
      <p className="text-frieren-950 -mt-6 dark:text-white/70">
        {language === "ENG" ? (
          <>
            You can contact me via email at this address:{" "}
            <a className="underline" href="mailto:enzoarjona30@gmail.com">
              enzoarjona30@gmail.com
            </a>{" "}
            or through the form.
          </>
        ) : (
          <>
            Puedes contactarte conmigo vía email a esta dirección:{" "}
            <a className="underline" href="mailto:enzoarjona30@gmail.com">
              enzoarjona30@gmail.com
            </a>{" "}
            o a través del formulario.
          </>
        )}
      </p>

      <form
        className="mt-10 flex flex-col"
        action={async (formData) => {
          const { error } = await sendEmail(formData);
          if (error) {
            toast.error(error);
            return;
          }
          toast.success(
            language === "ENG" ? "Email sent successfully!" : "¡Email enviado!"
          );
        }}
      >
        <input
          type="email"
          name="senderEmail"
          className="h-14 px-4 rounded-lg border border-frieren-200 dark:border-fern-700 bg-white/10 dark:bg-fern-900/50 backdrop-blur-sm text-frieren-950 dark:text-white placeholder:text-frieren-400 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-frieren-500 dark:focus:ring-fern-500 transition-all"
          placeholder={
            language === "ENG" ? "Your email" : "Tu correo electrónico"
          }
          required
          maxLength={500}
        />
        <textarea
          className="h-52 my-3 rounded-lg p-4 border border-frieren-200 dark:border-fern-700 bg-white/10 dark:bg-fern-900/50 backdrop-blur-sm text-frieren-950 dark:text-white placeholder:text-frieren-400 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-frieren-500 dark:focus:ring-fern-500 transition-all"
          name="message"
          placeholder={language === "ENG" ? "Your message" : "Tu mensaje"}
          required
          maxLength={5000}
        />
        <SubmitBtn />
      </form>
    </motion.section>
  );
}
