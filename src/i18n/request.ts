import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

const NAMESPACES = [
  "home",
  "auth",
  "product",
  "catalog",
  "collection",
  "cart",
  "profile",
  "checkout",
  "news",
  "wishlist",
  "filters",
  "partners",
  "seller",
  "shops",
];

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Import each namespace JSON and merge
  const messages = {};
  for (const ns of NAMESPACES) {
    try {
      // dynamic import per namespace file: messages/<locale>/<ns>.json
      // adjust the relative path to match your file location
      const mod = await import(`../../messages/${locale}/${ns}.json`);
      Object.assign(messages, mod.default ?? mod);
    } catch (err) {
      // If a namespace file is missing, we continue but log
      // (on server) so you can see what's wrong.
      // You can remove console.log in production.
      console.warn(
        `i18n: missing namespace "${ns}" for locale "${locale}"`,
        err
      );
    }
  }

  return {
    locale,
    messages,
  };
});
