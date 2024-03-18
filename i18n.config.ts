export enum Locales {
  en = "en",
  nl = "nl",
}

export interface Translation {
  locale: Locales;
  path: string;
  title: string;
}

const languages = [
  { locale: Locales.en, title: "English" },
  { locale: Locales.nl, title: "Nederlands", isDefault: true },
];

const i18n = {
  languages,
  base: languages.find((item) => item.isDefault)?.locale ?? "en",
};

export { i18n };
