import { describe, expect, it } from "vitest";
import { POST } from "./route";

describe("API /api/doacoes", () => {
  it("returns 201 for a valid donation amount", async () => {
    const request = new Request("http://localhost/api/doacoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 120 }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json.success).toBe(true);
  });

  it("returns 422 for invalid donation amount", async () => {
    const request = new Request("http://localhost/api/doacoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 0 }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(422);
    expect(json.success).toBe(false);
  });
});
