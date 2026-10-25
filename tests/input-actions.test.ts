import { beforeEach, afterEach, expect, it, vi } from "vitest";
import { createTable } from "./fake-db";
const state = vi.hoisted(() => ({ sessionId: 1 as number | undefined }));
const posts = createTable([]);
const users = createTable([]);
vi.mock("@/libs/db", () => ({ default: { post: posts, user: users } }));
vi.mock("@/libs/session", () => ({ default: async () => ({ id: state.sessionId }) }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: (path: string) => { throw new Error(`redirect:${path}`); } }));
const { uploadPost } = await import("@/app/posts/upload/action");
const { updateProfile } = await import("@/app/me/setting/action");
const { getImageUrl } = await import("@/libs/utils");
const { PHOTOS_JSON_MAX_BYTES } = await import("@/libs/image-validation");
const url = () => getImageUrl("278b56b2-2a9e-4e4a-9ae9-ae5311bfa200");
function upload(photos: string | Blob) {
  const form = new FormData(); form.set("content", "hello"); form.set("tags", ""); form.set("photos", photos);
  return uploadPost(null, form);
}
function profile(avatar?: string) {
  const form = new FormData(); form.set("bio", "updated");
  if (avatar !== undefined) form.set("avatar", avatar);
  return updateProfile(null, form);
}
beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_CF_ACCOUNT_HASH", "test_account-hash");
  state.sessionId = 1;
  posts.rows.splice(0);
  users.rows.splice(0, users.rows.length, { id: 1, avatar: url(), bio: "old" });
});
afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });
it("rejects the real 500k numeric-element attack before JSON.parse or Zod", async () => {
  const payload = JSON.stringify(Array(500_000).fill(1));
  expect(payload.length).toBe(1_000_001);
  const parse = vi.spyOn(JSON, "parse");
  expect((await upload(payload))?.fieldErrors.photos).toHaveLength(1);
  expect(parse).not.toHaveBeenCalledWith(payload);
  expect(posts.rows).toHaveLength(0);
});
it.each(["{", "null", "{}", "[1]", '["a",1]', JSON.stringify(Array(5).fill("a")), JSON.stringify(Array(1500).fill(1)), JSON.stringify(["a".repeat(513)]), " ".repeat(PHOTOS_JSON_MAX_BYTES), JSON.stringify(["가".repeat(1500)])])("bounds malformed/type/count/byte/length input", async (raw) => {
  expect((await upload(raw))?.fieldErrors.photos).toHaveLength(1);
  expect(posts.rows).toHaveLength(0);
});
it("rejects missing and file-valued photos without throwing", async () => {
  expect((await uploadPost(null, new FormData()))?.fieldErrors.photos).toHaveLength(1);
  expect((await upload(new Blob(["[]"])))?.fieldErrors.photos).toHaveLength(1);
});
it.each([
  "https://evil.example/image", "https://imagedelivery.net/other/id", "http://imagedelivery.net/test_account-hash/id",
  "https://imagedelivery.net.evil/test_account-hash/id", "https://user@imagedelivery.net/test_account-hash/id",
  "https://imagedelivery.net:443/test_account-hash/id", "https://imagedelivery.net/test_account-hash/../id",
  "https://imagedelivery.net/test_account-hash/%69d", "https://imagedelivery.net/test_account-hash/id?x=1",
  "https://imagedelivery.net/test_account-hash/id#x", "https://imagedelivery.net/test_account-hash/id/avatar",
])("rejects noncanonical photo and avatar %s", async (bad) => {
  expect((await upload(JSON.stringify([bad])))?.fieldErrors.photos).toHaveLength(1);
  expect((await profile(bad))?.fieldErrors.avatar?.length).toBeGreaterThan(0);
  expect(posts.rows).toHaveLength(0); expect(users.rows[0].avatar).toBe(url());
});
it("fails closed if the configured Cloudflare account is absent", async () => {
  vi.stubEnv("NEXT_PUBLIC_CF_ACCOUNT_HASH", "");
  expect((await upload(JSON.stringify([url()])))?.fieldErrors.photos).toHaveLength(1);
});
it("stores the frontend canonical URLs unchanged, and accepts no photos", async () => {
  const photos = Array(4).fill(url());
  await expect(upload(JSON.stringify(photos))).rejects.toThrow("redirect:/posts");
  expect(posts.rows[0].photos).toEqual(photos);
  await expect(upload("[]")).rejects.toThrow("redirect:/posts");
  expect(posts.rows[1].photos).toEqual([]);
});
it("accepts canonical avatars and preserves existing values for empty/omitted input", async () => {
  const next = getImageUrl("new-image_id");
  await expect(profile(next)).rejects.toThrow("redirect:/me"); expect(users.rows[0].avatar).toBe(next);
  await expect(profile("")).rejects.toThrow("redirect:/me"); expect(users.rows[0].avatar).toBe(next);
  await expect(profile()).rejects.toThrow("redirect:/me"); expect(users.rows[0].avatar).toBe(next);
});
it("redirects unauthenticated upload/profile without storing anything", async () => {
  state.sessionId = undefined;
  await expect(upload("[]")).rejects.toThrow("redirect:/login");
  await expect(profile("")).rejects.toThrow("redirect:/login");
  expect(posts.rows).toHaveLength(0); expect(users.rows[0].bio).toBe("old");
});
