import { POST_PHOTOS_MAX_LENGTH } from "@/libs/constants";

export const IMAGE_URL_MAX_LENGTH = 512;
export const PHOTOS_JSON_MAX_BYTES = 4096;

// The frontend stores getImageUrl(id), without a delivery variant suffix.
// Reject URL aliases, escaping, query strings, variants, and other accounts.
export function isCloudflareImageUrl(value: string): boolean {
  if (value.length > IMAGE_URL_MAX_LENGTH) return false;
  const account = process.env.NEXT_PUBLIC_CF_ACCOUNT_HASH;
  if (!account || !/^[A-Za-z0-9_-]{1,128}$/.test(account)) return false;
  const match = /^https:\/\/imagedelivery\.net\/([A-Za-z0-9_-]{1,128})\/([A-Za-z0-9_-]{1,128})$/.exec(value);
  return !!match && match[1] === account && match[2] !== "." && match[2] !== "..";
}

export function parsePostPhotos(raw: FormDataEntryValue | null): string[] | null {
  // Bound bytes before JSON.parse and bound cardinality/types before Zod 3
  // can accumulate one issue per element of an attacker-controlled array.
  if (typeof raw !== "string" || raw.length > PHOTOS_JSON_MAX_BYTES ||
      new TextEncoder().encode(raw).byteLength > PHOTOS_JSON_MAX_BYTES) return null;
  try {
    const photos: unknown = JSON.parse(raw);
    if (!Array.isArray(photos) || photos.length > POST_PHOTOS_MAX_LENGTH) return null;
    if (!photos.every((photo) => typeof photo === "string" &&
        photo.length <= IMAGE_URL_MAX_LENGTH && isCloudflareImageUrl(photo))) return null;
    return photos;
  } catch {
    return null;
  }
}
