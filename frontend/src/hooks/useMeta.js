import { useEffect } from "react";

export function useMeta({ title, description }) {
  useEffect(() => {
    // Basic title update
    if (title) {
      document.title = title;
      updateMetaTag({ name: "og:title", content: title });
    }

    // Normalize and set description if available
    if (description) {
      const cleanDescription = description.trim().replace(/\s+/g, " ");
      updateMetaTag({ name: "description", content: cleanDescription });
      updateMetaTag({ name: "og:description", content: cleanDescription });
    }
  }, [title, description]);
}

// Helper for meta tag creation/updating
function updateMetaTag({ name, content }) {
  if (!content) return;

  // Check by property first (for Og tags)
  let selector =
    name.startsWith("og:") || name.startsWith("twitter:")
      ? `meta[property="${name}"]`
      : `meta[name="${name}"]`;

  let meta = document.querySelector(selector);

  if (!meta) {
    meta = document.createElement("meta");
    if (selector.includes("property")) {
      meta.setAttribute("property", name);
    } else {
      meta.setAttribute("name", name);
    }
    document.head.appendChild(meta);
  }

  meta.setAttribute("content", content);
}
