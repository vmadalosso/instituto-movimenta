import { describe, expect, it } from "vitest";
import { POST } from "./route";

const validPayload = {
  name: "João Silva",
  email: "joao@example.com",
  whatsapp: "51999999999",
  city: "Porto Alegre",
  state: "Rio Grande do Sul",
  neighborhood: "Cidade Baixa",
  school: "Escola Estadual São José",
  shift: "Noite",
};

describe("API /api/cursinho", () => {
  it("returns 201 for valid cursinho registration", async () => {
    const request = new Request("http://localhost/api/cursinho", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json.success).toBe(true);
  });

  it("returns 422 when required cursinho fields are missing", async () => {
    const request = new Request("http://localhost/api/cursinho", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "",
        email: "invalid",
        whatsapp: "",
        city: "",
        state: "",
        neighborhood: "",
        school: "",
        shift: "",
      }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(422);
    expect(json.success).toBe(false);
  });
});
