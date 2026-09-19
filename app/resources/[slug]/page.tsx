import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedResource } from "@/lib/resources";
import { canonicalUrl, normalizeMetaDescription, normalizeSeoTitle, PUBLIC_SITE_URL } from "@/lib/seo-policy";
import ResourceDetailClient, { ResourceDetail } from "./resource-detail-client";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const resource = await getPublishedResource(slug);

    if (!resource) {
      return {
        title: "Study Resource Not Found",
        description: "The requested educational study resource or board examination solution could not be found.",
        robots: { index: false },
      };
    }

    const title = normalizeSeoTitle(resource.title);
    const description = normalizeMetaDescription(resource.metaDescription);
    const resourceCanonicalUrl = canonicalUrl(`/resources/${slug}`);

    return {
      title: { absolute: title },
      description,
      keywords: resource.keywords || [],
      alternates: {
        canonical: resourceCanonicalUrl,
      },
      openGraph: {
        title,
        description,
        url: resourceCanonicalUrl,
        siteName: "SixBytes Educational Institute",
        type: "article",
        publishedTime: resource.createdAt ? new Date(resource.createdAt).toISOString() : undefined,
        modifiedTime: resource.updatedAt ? new Date(resource.updatedAt).toISOString() : undefined,
        section: resource.subject,
        tags: resource.keywords || [],
        images: [
          {
            url: `${PUBLIC_SITE_URL}/logo.png`,
            width: 800,
            height: 800,
            alt: resource.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [`${PUBLIC_SITE_URL}/logo.png`],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  } catch (error) {
    console.error("Error generating metadata for resource:", error);
    return {
      title: "Educational Study Notes & Board Solutions",
      description: "Free NCERT solutions and CBSE & ICSE board examination notes from SixBytes Institute.",
    };
  }
}

export default async function ResourceDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const rawResource = await getPublishedResource(slug);

  if (!rawResource) {
    notFound();
  }

  // Serialize MongoDB object to plain JSON matching ResourceDetail
  const serialized: ResourceDetail = {
    _id: String(rawResource._id),
    title: rawResource.title,
    slug: rawResource.slug,
    metaDescription: rawResource.metaDescription,
    subject: rawResource.subject,
    targetClass: rawResource.targetClass || "10",
    board: rawResource.board || "CBSE & ICSE",
    resourceType: rawResource.resourceType || "topic_guide",
    chapter: rawResource.chapter || null,
    content: rawResource.content,
    keywords: rawResource.keywords || [],
    viewCount: rawResource.viewCount || 0,
    createdAt: rawResource.createdAt ? new Date(rawResource.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: rawResource.updatedAt ? new Date(rawResource.updatedAt).toISOString() : undefined,
  };

  const baseUrl = PUBLIC_SITE_URL;
  const resourceCanonicalUrl = canonicalUrl(`/resources/${serialized.slug}`);

  // Schema.org LearningResource & Article Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": resourceCanonicalUrl,
    name: serialized.title,
    headline: serialized.title,
    description: serialized.metaDescription,
    educationalLevel: `Class ${serialized.targetClass}`,
    learningResourceType:
      serialized.resourceType === "question_bank"
        ? "Assessment / Solved Board Questions"
        : "Concept Guide / Revision Notes",
    educationalAlignment: {
      "@type": "AlignmentObject",
      alignmentType: "educationalSubject",
      targetName: serialized.subject,
    },
    inLanguage: "en",
    url: resourceCanonicalUrl,
    datePublished: serialized.createdAt,
    dateModified: serialized.updatedAt || serialized.createdAt,
    keywords: (serialized.keywords || []).join(", "),
    author: {
      "@type": "Organization",
      name: "SixBytes Educational Institute Faculty",
      url: baseUrl,
    },
    publisher: {
      "@type": "EducationalOrganization",
      name: "SixBytes Educational Institute",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Opp. Lane No. 3, Sai Vihar, Shyampur",
        addressLocality: "Premnagar, Dehradun",
        addressRegion: "Uttarakhand",
        postalCode: "248007",
        addressCountry: "IN",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ResourceDetailClient initialResource={serialized} />
    </>
  );
}
