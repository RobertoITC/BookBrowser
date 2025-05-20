// src/services/googleBooks.ts

const API_BASE = 'https://www.googleapis.com/books/v1';
const API_KEY='AIzaSyAQNAFrIYE58G15RJfHdogaVLrANrKAIlA';
// A helper to build query strings
function buildQuery(params: Record<string, string | number>) {
    const q = new URLSearchParams({
        key: API_KEY!,
        ...Object.fromEntries(
            Object.entries(params).map(([k, v]) => [k, String(v)])
        )
    });
    return `${API_BASE}/volumes?${q.toString()}`;
}

/**
 * Search for books matching the given term.
 * @param query free‐text search (title, author, ISBN…)
 * @param maxResults how many results to return (default 20)
 */
export async function searchBooks(
    query: string,
    maxResults: number = 20
) {
    const url = buildQuery({ q: query, maxResults });
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Google Books API error: ${res.status}`);
    }
    const data = await res.json();
    return data.items ?? [];
}

/**
 * Get detailed info for a single book by its volume ID.
 * @param id the Google Books volume ID
 */
export async function getBookById(id: string) {
    const url = `${API_BASE}/volumes/${id}?key=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Google Books API error: ${res.status}`);
    }
    return res.json();
}