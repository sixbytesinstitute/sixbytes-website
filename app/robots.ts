import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://sixbytes.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/courses", "/results", "/resources", "/resources/*", "/contact"],
        disallow: ["/admin", "/admin/*", "/faculty", "/faculty/*", "/dashboard", "/dashboard/*", "/api/*", "/settings"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
