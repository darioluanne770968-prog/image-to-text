import { MetadataRoute } from "next";

const BASE_URL = "https://imagetotext-orcin-seven.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/pricing",
    "/batch",
    "/jpg-to-word",
    "/jpg-to-excel",
    "/pdf-to-word",
    "/pdf-to-excel",
    "/pdf-to-text",
    "/pdf-to-jpg",
    "/text-to-pdf",
    "/text-to-image",
    "/image-to-pdf",
    "/image-translator",
    "/qr-scanner",
    "/faq",
    "/contact",
    "/terms",
    "/privacy",
    "/refund",
    "/api-docs",
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : route === "/pricing" ? 0.9 : 0.8,
  }));
}
