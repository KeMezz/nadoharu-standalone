import { beforeEach, describe, expect, it, vi } from "vitest";
import { createTable } from "./fake-db";

const state = vi.hoisted(() => ({
  sessionId: undefined as number | undefined,
  revalidated: [] as string[],
}));

const posts = createTable([]);
const comments = createTable([]);

vi.mock("@/libs/db", () => ({
  default: { post: posts, comment: comments },
}));
vi.mock("@/libs/session", () => ({
  default: async () => ({ id: state.sessionId }),
}));
vi.mock("next/cache", () => ({
  revalidatePath: (path: string) => state.revalidated.push(path),
}));

const { deletePost, deleteComment } = await import("@/app/posts/[id]/action");

const ALICE = 1;
const BOB = 2;

beforeEach(() => {
  state.sessionId = undefined;
  state.revalidated = [];
  posts.rows.splice(
    0,
    posts.rows.length,
    { id: 10, userId: ALICE, isDeleted: false },
    { id: 11, userId: BOB, isDeleted: false }
  );
  comments.rows.splice(
    0,
    comments.rows.length,
    { id: 100, userId: ALICE, postId: 11 },
    { id: 101, userId: BOB, postId: 11 }
  );
});

describe("deletePost", () => {
  it("rejects requests without a session and changes nothing", async () => {
    const result = await deletePost(10);
    expect(result.success).toBe(false);
    expect(posts.rows.every((row) => row.isDeleted === false)).toBe(true);
  });

  it("does not let another user delete someone else's post", async () => {
    state.sessionId = BOB;
    const result = await deletePost(10);
    expect(result.success).toBe(false);
    expect(posts.rows.find((row) => row.id === 10)?.isDeleted).toBe(false);
    expect(state.revalidated).toEqual([]);
  });

  it("soft-deletes the owner's own post", async () => {
    state.sessionId = ALICE;
    const result = await deletePost(10);
    expect(result.success).toBe(true);
    expect(posts.rows.find((row) => row.id === 10)?.isDeleted).toBe(true);
    expect(posts.rows.find((row) => row.id === 11)?.isDeleted).toBe(false);
    expect(state.revalidated).toContain("/posts/10");
  });

  it("reports failure for a post that does not exist", async () => {
    state.sessionId = ALICE;
    expect((await deletePost(999)).success).toBe(false);
  });
});

describe("deleteComment", () => {
  it("rejects requests without a session and changes nothing", async () => {
    const result = await deleteComment(100, 11);
    expect(result.success).toBe(false);
    expect(comments.rows).toHaveLength(2);
  });

  it("does not let another user delete someone else's comment", async () => {
    state.sessionId = BOB;
    const result = await deleteComment(100, 11);
    expect(result.success).toBe(false);
    expect(comments.rows.map((row) => row.id)).toEqual([100, 101]);
  });

  it("does not delete when the postId does not match the comment", async () => {
    state.sessionId = ALICE;
    const result = await deleteComment(100, 10);
    expect(result.success).toBe(false);
    expect(comments.rows).toHaveLength(2);
  });

  it("deletes only the author's own comment", async () => {
    state.sessionId = ALICE;
    const result = await deleteComment(100, 11);
    expect(result.success).toBe(true);
    expect(comments.rows.map((row) => row.id)).toEqual([101]);
    expect(state.revalidated).toEqual(["/posts/11"]);
  });
});
