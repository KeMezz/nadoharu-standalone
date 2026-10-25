import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  sessionId: undefined as number | undefined,
  fetchCalls: 0,
}));

vi.mock("@/libs/session", () => ({
  default: async () => ({ id: state.sessionId }),
}));
vi.mock("@/libs/db", () => ({ default: {} }));

const { getUploadUrl } = await import("@/app/(common)/action");

beforeEach(() => {
  state.sessionId = undefined;
  state.fetchCalls = 0;
  vi.stubGlobal("fetch", async () => {
    state.fetchCalls += 1;
    return { json: async () => ({ success: true, result: { id: "i" } }) };
  });
});

describe("getUploadUrl", () => {
  it("does not mint a Cloudflare upload URL without a session", async () => {
    const result = await getUploadUrl();
    expect(result.success).toBe(false);
    expect(state.fetchCalls).toBe(0);
  });

  it("mints an upload URL for a logged-in user", async () => {
    state.sessionId = 1;
    const result = await getUploadUrl();
    expect(result.success).toBe(true);
    expect(state.fetchCalls).toBe(1);
  });
});
