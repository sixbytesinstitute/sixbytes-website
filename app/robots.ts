import { MetadataRoute } from "next";
import { PUBLIC_SITE_URL } from "@/lib/seo-policy";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = PUBLIC_SITE_URL;

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/courses", "/results", "/resources", "/resources/*", "/contact"],
        disallow: [
          "/admin",
          "/admin/*",
          "/faculty",
          "/faculty/*",
          "/dashboard",
          "/dashboard/*",
          "/api/*",
          "/settings",
          "/login",
          "/student-login",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
