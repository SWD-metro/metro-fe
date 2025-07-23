import i18n from "i18next";
import { initReactI18next } from "react-i18next";
//EN
import HOME_EN from "src/locales/en/home.json";
import AUTH_EN from "src/locales/en/auth.json";
import MAP_EN from "src/locales/en/map.json";

//VI
import HOME_VI from "src/locales/vi/home.json";
import AUTH_VI from "src/locales/vi/auth.json";
import MAP_VI from "src/locales/vi/map.json";

export const locales = {
  en: "English",
  vi: "Tiếng Việt",
} as const;
export const resources = {
  en: {
    home: HOME_EN,
    auth: AUTH_EN,
    map: MAP_EN,
  },
  vi: {
    home: HOME_VI,
    auth: AUTH_VI,
    map: MAP_VI,
  },
} as const;
export const defaultNS = "home";
i18n.use(initReactI18next).init({
  resources,
  lng: "vi",
  ns: ["home"],
  fallbackLng: "vi",
  defaultNS,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
