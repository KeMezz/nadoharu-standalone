import { beforeEach, expect, it, vi } from "vitest";
import { createTable } from "./fake-db";
const state = vi.hoisted(() => ({ sessionId: undefined as number | undefined }));
const friendship = createTable([]), notifications = createTable([]), user = createTable([]);
const post = createTable([]), comment = createTable([]), reposts = createTable([]);
vi.mock("@/libs/db", () => ({ default: { friendship, notifications, user, post, comment, repost: reposts } }));
vi.mock("@/libs/session", () => ({ default: async () => ({ id: state.sessionId }) }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: (s: string) => { throw Error(s); }, notFound: () => { throw Error("404"); } }));
const { acceptRequest, deleteRequest } = await import("@/app/me/requested/action");
const { sendFriendRequest } = await import("@/app/users/[id]/send-request/action");
const { createComment, repost } = await import("@/app/posts/[id]/action");
beforeEach(() => {
  state.sessionId = undefined;
  friendship.rows.splice(0, friendship.rows.length, { id: 1, initiatorId: 1, recipientId: 2, status: 2 });
  notifications.rows.splice(0, notifications.rows.length, { id: 1, friendshipId: 1, isRead: false });
  user.rows.splice(0, user.rows.length, { id: 1, loginId: "alice" }, { id: 2, loginId: "bob" });
  post.rows.splice(0, post.rows.length, { id: 10, userId: 2, isDeleted: true });
  comment.rows.splice(0); reposts.rows.splice(0);
});
for (const [name, action, status] of [["acceptRequest", acceptRequest, 1], ["deleteRequest", deleteRequest, 0]] as const) {
  it.each([undefined, 1, 3])(`${name} rejects anonymous, initiator, and unrelated users (%s)`, async (id) => {
    state.sessionId = id;
    expect((await action(1)).success).toBe(false);
    expect(friendship.rows[0].status).toBe(2); expect(notifications.rows[0].isRead).toBe(false);
  });
  it(`${name} lets only the recipient change a pending request`, async () => {
    state.sessionId = 2;
    expect((await action(1)).success).toBe(true);
    expect(friendship.rows[0].status).toBe(status); expect(notifications.rows[0].isRead).toBe(true);
    expect((await action(1)).success).toBe(false);
  });
}
it.each([undefined, 1])("sendFriendRequest blocks anonymous/self (%s)", async (id) => {
  state.sessionId = id; const form = new FormData(); form.set("text", "hello");
  expect((await sendFriendRequest(null, form, "alice"))?.success).toBe(false);
  expect(friendship.rows).toHaveLength(1); expect(notifications.rows).toHaveLength(1);
});
it("sendFriendRequest permits a distinct authenticated recipient", async () => {
  friendship.rows.splice(0); state.sessionId = 1;
  const form = new FormData(); form.set("text", "hello");
  expect((await sendFriendRequest(null, form, "bob"))?.success).toBe(true);
  expect(friendship.rows).toHaveLength(1); expect(notifications.rows).toHaveLength(2);
});
it.each([undefined, 1])("deleted posts reject comments and reposts (%s)", async (id) => {
  state.sessionId = id; const form = new FormData(); form.set("content", "hello");
  await createComment(null, form, 10); await repost(10);
  expect(comment.rows).toHaveLength(0); expect(reposts.rows).toHaveLength(0); expect(notifications.rows).toHaveLength(1);
});
it("live posts still accept authenticated comments and reposts", async () => {
  state.sessionId = 1; post.rows[0].isDeleted = false;
  const form = new FormData(); form.set("content", "hello");
  await createComment(null, form, 10); expect((await repost(10))?.success).toBe(true);
  expect(comment.rows).toHaveLength(1); expect(reposts.rows).toHaveLength(1);
});
