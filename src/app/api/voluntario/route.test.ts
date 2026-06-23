import { describe, expect, it } from "vitest";
import { POST } from "./route";

const validPayload = {
  name: "Ana Costa",
  email: "ana@example.com",
  phone: "51988888888",
  city: "Porto Alegre",
  state: "Rio Grande do Sul",
  instagram: "@ana.costa",
  interest: "Educação",
  isStudent: "sim",
  schoolOrUniversity: "UFRGS",
  howFound: "Instagram",
};

describe("API /api/voluntario", () => {
  it("returns 201 for valid volunteer data", async () => {
    const request = new Request("http://localhost/api/voluntario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
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
      body: JSON.stringify({ ...validPayload, interest: "" }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(422);
    expect(json.success).toBe(false);
  });

  it("returns 422 when required fields are missing", async () => {
    const request = new Request("http://localhost/api/voluntario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "",
        email: "invalid",
        phone: "",
        city: "",
        state: "",
        interest: "",
        howFound: "",
      }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(422);
    expect(json.success).toBe(false);
  });
});
