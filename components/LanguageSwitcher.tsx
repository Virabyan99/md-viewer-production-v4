"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLocaleStore } from "@/lib/localeStore";

const LOCALES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "zh-Hans", label: "简体中文" },
  { code: "zh-Hant", label: "繁體中文" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "hy", label: "Հայերեն" },
  { code: "ru", label: "Русский" },
  { code: "fa", label: "فارسی" },
  { code: "ar", label: "العربية" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocaleStore();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("ui");

  const handleChange = (value: string) => {
    setLocale(value);
    const [, , ...rest] = pathname.split("/");
    router.push(`/${value}/${rest.join("/")}`);
  };

  return (
    <Select value={locale} onValueChange={handleChange}>
      <SelectTrigger aria-label={t("lang.select")}>
        <SelectValue placeholder={t("lang.select")} />
      </SelectTrigger>
      <SelectContent>
        {LOCALES.map((l) => (
          <SelectItem key={l.code} value={l.code}>
            {l.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}