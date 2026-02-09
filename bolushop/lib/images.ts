/**
 * Utility functions for handling images in the application.
 */

/**
 * Transforms an image URL to be displayable in an <img> tag.
 * Specifically handles Google Drive sharing links.
 * 
 * @param url The original image URL
 * @returns The transformed URL suitable for src attribute
 */
export function transformImageUrl(url: string | undefined | null): string {
    if (!url) return '/placeholder.png'; // Return a placeholder if URL is missing

    // Check if it's a Google Drive link
    // Pattern: https://drive.google.com/file/d/FILE_ID/view...
    const driveRegex = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view/;
    const match = url.match(driveRegex);

    if (match && match[1]) {
        // Convert to a direct view link
        // Option 1: drive.google.com/uc?export=view&id=... (Can be slow/rate limited)
        // Option 2: lh3.googleusercontent.com/d/... (Faster, acts as CDN)

        // We will use the 'thumbnail' generated link which is very reliable for images
        // or the 'uc' export view link. The 'lh3' link is best but sometimes changes.
        // Let's use the standard 'uc' export view which is most commonly used for this.
        return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
    }

    return url;
}
