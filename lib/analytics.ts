/**
 * Analytics & Conversion Event Tracking Utility
 * Dispatches custom events to Google Analytics 4 (GA4) and Microsoft Clarity.
 */

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "set" | "js",
      action: string,
      params?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
    clarity?: (command: string, ...args: unknown[]) => void;
  }
}

export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  // 1. Google Analytics 4
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }

  // 2. Microsoft Clarity custom tag
  if (typeof window.clarity === "function" && params?.category) {
    window.clarity("set", eventName, String(params.category));
  }
}

/**
 * Track high-intent student/parent conversion events
 */
export function trackWhatsAppClick(source: string, label?: string) {
  trackEvent("whatsapp_inquiry_click", {
    event_category: "Conversion",
    event_label: label || source,
    source,
    timestamp: new Date().toISOString(),
  });
}

export function trackPhoneCallClick(source: string) {
  trackEvent("phone_call_click", {
    event_category: "Conversion",
    source,
    timestamp: new Date().toISOString(),
  });
}

export function trackResourceRead(title: string, subject: string, targetClass: string) {
  trackEvent("resource_read", {
    event_category: "Engagement",
    resource_title: title,
    resource_subject: subject,
    resource_class: targetClass,
  });
}

export type ResourceSearchFilters = {
  subject?: string;
  targetClass?: string;
  board?: string;
  resourceType?: string;
};

export function buildResourceSearchEvent(
  search: string,
  filters: ResourceSearchFilters = {},
) {
  return {
    event_category: "Engagement",
    search_query: search.trim().slice(0, 100),
    subject: filters.subject || "",
    target_class: filters.targetClass || "",
    board: filters.board || "",
    resource_type: filters.resourceType || "",
  };
}

export function trackResourceSearch(search: string, filters: ResourceSearchFilters = {}) {
  const query = search.trim();
  if (!query) return;

  trackEvent("resource_search", buildResourceSearchEvent(query, filters));
}
