import { MetadataRoute } from "next";
import connectDB from "@/lib/mongodb";
import Resource from "@/models/Resource";
import { canonicalUrl } from "@/lib/seo-policy";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static marketing & public pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: canonicalUrl("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: canonicalUrl("/about"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: canonicalUrl("/courses"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: canonicalUrl("/results"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: canonicalUrl("/resources"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: canonicalUrl("/contact"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic educational resource pages from MongoDB
  try {
    await connectDB();
    const resources = await Resource.find({ published: true })
      .select("slug updatedAt createdAt")
      .lean();

    const resourcePages: MetadataRoute.Sitemap = resources.map((r) => ({
      url: canonicalUrl(`/resources/${r.slug}`),
      lastModified: r.updatedAt || r.createdAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticPages, ...resourcePages];
  } catch (error) {
    console.error("Error generating dynamic sitemap resources:", error);
    return staticPages;
  }
}
