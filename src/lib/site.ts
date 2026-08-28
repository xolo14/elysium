/** Canonical public origin for SEO, sitemaps and absolute OG images. */
export const SITE_URL = "https://elysiumhotel.grootdigitals.com";

export const SITE_EMAIL = "elysium.hyd@gmail.com";
export const SITE_NAME = "Elysium Hotels";

/** Primary WhatsApp desk (Madhapur). Digits only for wa.me. */
export const WHATSAPP_NUMBER = "919888765776";

export function absoluteUrl(path: string) {
  if (path.startsWith("http")) return path;
  const base = SITE_URL.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export function whatsappUrl(message?: string) {
  const text = message
    ? `?text=${encodeURIComponent(message)}`
    : "";
  return `https://wa.me/${WHATSAPP_NUMBER}${text}`;
}

export function pageMeta({
  title,
  description,
  path,
  image = "/images/hero-suite-living.png",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}) {
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(image);
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: ogImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
