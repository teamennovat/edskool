import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/api/",
        "/auth/",
        "/profile/",
        "/settings/",
      ],
    },
    sitemap: "https://edskool.com/sitemap.xml", // Replace with your actual domain
  };
}
