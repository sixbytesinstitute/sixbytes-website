import { MetadataRoute } from "next";
import connectDB from "@/lib/mongodb";
import Resource from "@/models/Resource";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://sixbytes.in";

  // Static marketing & public pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/results`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic educational resource pages from MongoDB
  try {
    await connectDB();
    const resources = await Resource.find({ published: true })
      .select("slug updatedAt createdAt")
      .lean();

    const resourcePages: MetadataRoute.Sitemap = resources.map((r) => ({
      url: `${baseUrl}/resources/${r.slug}`,
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
