export const pageMeta = (title: string, description: string) => ({
  meta: [
    { title: `${title} — HealthLink Privacy` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} — HealthLink Privacy` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});
