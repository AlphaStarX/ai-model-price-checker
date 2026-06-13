// ─── Client-side Search Utilities ───────────────────────────

/**
 * Simple client-side fuzzy search for when the API is unavailable.
 * Uses substring matching with case-insensitive comparison.
 */
export function fuzzySearch<T extends Record<string, string>>(
  query: string,
  items: T[],
  keys: (keyof T)[],
  maxResults: number = 10,
): T[] {
  if (!query.trim()) return items.slice(0, maxResults);

  const q = query.toLowerCase();
  const scored = items
    .map((item) => {
      let score = 0;
      for (const key of keys) {
        const value = String(item[key] ?? "").toLowerCase();
        if (value === q) score += 100;
        if (value.startsWith(q)) score += 50;
        if (value.includes(q)) score += 10;
      }
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);

  return scored.slice(0, maxResults);
}

/**
 * Highlight matching text in a search result.
 * Returns an array of segments with `highlight: true` for matches.
 */
export function highlightMatch(
  text: string,
  query: string,
): { text: string; highlight: boolean }[] {
  if (!query.trim()) return [{ text, highlight: false }];

  const regex = new RegExp(`(${escapeRegExp(query)})`, "gi");
  const parts = text.split(regex);

  return parts.map((part) => ({
    text: part,
    highlight: regex.test(part),
  }));
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
