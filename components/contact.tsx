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
  const { language, toggleLanguage } = useLanguage();
  const sectionName = language === "ENG" ? "Contact" : "Contacto";
  const { ref } = useSectioninView(sectionName, 0.5);

  return (
    <motion.section
      id="contact"
      ref={ref}
      className="mb-20 sm:mb-28 w-[min(100%,38rem)] text-center"
      initial={{
        opacity: 0,
      }}
      whileInView={{
        opacity: 1,
      }}
      transition={{
        duration: 1,
      }}
      viewport={{
        once: true,
      }}
    >
      <SectionHeading>
        {language === "ENG" ? "Contact me" : "Contáctame"}
      </SectionHeading>
      {language === "ENG" ? (
        <>
          {" "}
          <p className="text-black -mt-6 dark:text-white/70">
            You can contact me via email at this address:
            <a className="underline" href="mailto:enzoarjona30@gmail.com">
              enzoarjona30@gmail.com
            </a>{" "}
            or through the form.
          </p>
        </>
      ) : (
        <>
          {" "}
          <p className="text-black -mt-6 dark:text-white/70">
            Puedes contactarte conmigo vía email a esta dirección:
            <a className="underline" href="mailto:enzoarjona30@gmail.com">
              enzoarjona30@gmail.com
            </a>{" "}
            o atravez del formulario
          </p>
        </>
      )}

      <form
        className="mt-10 flex flex-col  text-black "
        action={async (formData) => {
          const { data, error } = await sendEmail(formData);
          if (error) {
            toast.error(error);
            return;
          }
          toast.success("Email sent Successfully!");
        }}
      >
        <input
          type="email"
          name="senderEmail"
          className="h-14 px-4 rounded-lg borderBlack bg-violet-900 text-black"
          placeholder={
            language === "ENG" ? "Your email" : "Tu correo electrónico"
          }
          required
          maxLength={500}
        />
        <textarea
          className="h-52 my-3 rounded-lg borderBlack p-4 bg-violet-900 text-black "
          name="message"
          placeholder={language === "ENG" ? "Your message" : "Tú mensaje"}
          required
          maxLength={5000}
        />
        <SubmitBtn />
      </form>
    </motion.section>
  );
}
