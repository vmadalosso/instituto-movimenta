import { describe, expect, it } from "vitest";
import { POST } from "./route";

describe("API /api/contato", () => {
  it("returns 201 for valid contact data", async () => {
    const request = new Request("http://localhost/api/contato", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Maria",
        email: "maria@example.com",
        subject: "Parceria",
        message: "Quero saber como apoiar o movimento.",
      }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.message).toContain("Mensagem recebida");
  });

  it("returns 422 for invalid contact data", async () => {
    const request = new Request("http://localhost/api/contato", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "M",
        email: "invalid-email",
        subject: "Oi",
        message: "Curto.",
      }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(422);
    expect(json.success).toBe(false);
    expect(json.errors).toBeDefined();
  });
});
