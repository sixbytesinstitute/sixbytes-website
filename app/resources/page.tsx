import { getPublishedResources } from "@/lib/resources"
import ResourcesClient, { type Resource as ResourceListItem } from "./resources-client"

export const revalidate = 300

async function getInitialResources(): Promise<ResourceListItem[]> {
  try {
    const resources = await getPublishedResources()

    return resources.map((resource) => ({
      _id: String(resource._id),
      slug: resource.slug,
      title: resource.title,
      metaDescription: resource.metaDescription,
      subject: resource.subject,
      targetClass: resource.targetClass || "10",
      board: resource.board || "CBSE & ICSE",
      resourceType: resource.resourceType || "topic_guide",
      chapter: resource.chapter || null,
      keywords: resource.keywords || [],
      viewCount: resource.viewCount || 0,
      createdAt: resource.createdAt ? new Date(resource.createdAt).toISOString() : new Date().toISOString(),
    }))
  } catch (error) {
    console.error("INITIAL RESOURCES ERROR:", error)
    return []
  }
}

export default async function ResourcesPage() {
  const initialResources = await getInitialResources()
  return <ResourcesClient initialResources={initialResources} />
}
