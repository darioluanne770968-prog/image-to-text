import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog/posts";

const BASE_URL = "https://imagetotext-orcin-seven.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  // Static routes
  const staticRoutes = [
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
    "/blog",
  ];

  // Blog post routes
  const blogPosts = getAllPosts();
  const blogRoutes = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Static routes with sitemap config
  const staticSitemap: MetadataRoute.Sitemap = staticRoutes.map((route) => {
    let changeFrequency: "daily" | "weekly" | "monthly" | "yearly" | "always" | "never" = "weekly";
    if (route === "" || route === "/blog") {
      changeFrequency = "daily";
    }

    let priority = 0.8;
    if (route === "") priority = 1;
    else if (route === "/pricing" || route === "/blog") priority = 0.9;

    return {
      url: `${BASE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    };
  });

  return [...staticSitemap, ...blogRoutes];
}
