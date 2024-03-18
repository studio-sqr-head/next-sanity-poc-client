"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { i18n, Locales } from "@/i18n.config";

export default function LocaleSwitcher() {
  const pathName = usePathname();
  const redirectedPathName = (locale: Locales) => {
    if (!pathName) return "/";
    const segments = pathName.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  return (
    <div>
      <ul className="flex space-x-4">
        {i18n.languages.map(({ locale }) => {
          return (
            <li key={locale} className="text-blue-500">
              <Link href={redirectedPathName(locale)}>{locale}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
