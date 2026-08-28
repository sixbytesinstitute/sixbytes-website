"use client"

import { extractDriveFileId, getDriveEmbedUrl, getDriveDownloadUrl } from "@/lib/gdrive"

interface GDriveViewerProps {
  url: string
  title?: string
  className?: string
  showDownload?: boolean
}

/**
 * Google Drive PDF/Document Viewer
 *
 * Renders an embedded preview of a Google Drive file with a download button.
 * Expects a Google Drive shareable link as the `url` prop.
 */
export default function GDriveViewer({
  url,
  title = "Document",
  className = "",
  showDownload = true,
}: GDriveViewerProps) {
  const fileId = extractDriveFileId(url)

  if (!fileId) {
    return (
      <div className={`flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-8 ${className}`}>
        <p className="text-sm text-white/40">
          Invalid Google Drive link. Please check the URL.
        </p>
      </div>
    )
  }

  const embedUrl = getDriveEmbedUrl(fileId)
  const downloadUrl = getDriveDownloadUrl(fileId)

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Embedded PDF/Doc Preview */}
      <div className="overflow-hidden rounded-xl border border-white/10">
        <iframe
          src={embedUrl}
          width="100%"
          height="500"
          allow="autoplay"
          title={title}
          className="border-0"
          style={{ minHeight: "500px" }}
        />
      </div>

      {/* Download Button */}
      {showDownload && (
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-amber-500/25"
        >
          {/* Download icon */}
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download {title}
        </a>
      )}
    </div>
  )
}
