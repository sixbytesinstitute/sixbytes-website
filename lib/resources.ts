import { cache } from "react"
import { unstable_cache } from "next/cache"
import connectDB from "@/lib/mongodb"
import Resource from "@/models/Resource"

export const getPublishedResource = cache((slug: string) =>
  unstable_cache(
    async () => {
      await connectDB()
      return Resource.findOne({ slug, published: true }).lean()
    },
    ["published-resource", slug],
    { revalidate: 300, tags: ["published-resources", `published-resource:${slug}`] }
  )()
)

export const getPublishedResources = cache(() =>
  unstable_cache(
    async () => {
      await connectDB()
      return Resource.find({ published: true })
        .select("slug title metaDescription subject targetClass board resourceType chapter keywords viewCount createdAt")
        .sort({ createdAt: -1 })
        .lean()
    },
    ["published-resources"],
    { revalidate: 300, tags: ["published-resources"] }
  )()
)
