import { expect, it, vi } from "vitest";
const state = vi.hoisted(() => ({ deleted: true }));
vi.mock("@/libs/db", () => ({ default: { post: { findUnique: async () => ({ id: 10, userId: 2, isDeleted: state.deleted, photos: [], comments: [], createdAt: new Date(), _count: { comments: 0, reposts: 0 }, content: "deleted text", tags: "" }) }, repost: { findFirst: async () => null } } }));
vi.mock("@/libs/session", () => ({ default: async () => ({ id: 1 }) }));
vi.mock("next/navigation", () => ({ notFound: () => { throw Error("404"); } }));
vi.mock("@/components/domains/comment", () => ({ default: () => null }));
vi.mock("@/components/domains/comment/form", () => ({ default: () => null }));
vi.mock("@/components/domains/post/repost-form", () => ({ default: () => null }));
const { default: PostDetail } = await import("@/app/posts/[id]/page");
it("renders a live post with the same fixture", async () => {
  state.deleted = false;
  expect(await PostDetail({ params: Promise.resolve({ id: "10" }) })).toBeDefined();
  state.deleted = true;
});
it("returns notFound for a soft-deleted post before rendering its contents", async () => {
  await expect(PostDetail({ params: Promise.resolve({ id: "10" }) })).rejects.toThrow("404");
});
