import request from "supertest";
import app from "./app";

describe("App", () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it("should respond with 404 for unknown endpoints", async () => {
    const response = await request(app).get("/unknown-endpoint").expect(404);

    expect(response.body).toEqual({ error: "Endpoint not found" });
  });

  it("should have CORS enabled", async () => {
    const response = await request(app)
      .get("/api")
      .expect("Access-Control-Allow-Origin", "*");
  });

  it("should parse JSON requests", async () => {
    const response = await request(app)
      .post("/api")
      .send({ test: "data" })
      .expect("Content-Type", /json/);
  });
});
