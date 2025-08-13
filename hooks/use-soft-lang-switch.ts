<file name=components/hero-section.tsx>
import React from "react";
import { motion } from "framer-motion";
import { useSoftLangSwitch } from "@/hooks/use-soft-lang-switch";

export default function HeroSection() {
  const softSwitch = useSoftLangSwitch();

  return (
    <div>
      {["de", "uz", "en", "ru"].map((lang, index) => (
        <motion.button
          key={lang}
          onClick={() => softSwitch(lang)}
        >
          {lang.toUpperCase()}
        </motion.button>
      ))}
    </div>
  );
}
</file>

<file name=components/language-switcher.tsx>
import React from "react";
import { useSoftLangSwitch } from "@/hooks/use-soft-lang-switch";

export function LanguageSwitcher() {
  const softSwitch = useSoftLangSwitch();

  return (
    <div>
      {["de", "en", "ru", "uz"].map((code) => (
        <button key={code} onClick={() => softSwitch(code)}>
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
</file>