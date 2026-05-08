import { describe, expect, it } from "vitest";
import { POST } from "./route";

describe("API /api/voluntario", () => {
  it("returns 201 for valid volunteer data", async () => {
    const request = new Request("http://localhost/api/voluntario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Ana",
        email: "ana@example.com",
        phone: "51988888888",
        interest: "Educação",
        message: "Tenho disponibilidade nas tardes de terça e quinta.",
      }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json.success).toBe(true);
  });

  it("returns 422 when volunteer interest is missing", async () => {
    const request = new Request("http://localhost/api/voluntario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Ana",
        email: "ana@example.com",
        phone: "51988888888",
        interest: "",
        message: "Disponível para apoiar atividades.",
      }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(422);
    expect(json.success).toBe(false);
  });
});
