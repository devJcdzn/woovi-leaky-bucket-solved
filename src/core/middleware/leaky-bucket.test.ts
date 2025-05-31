import request from "supertest";
import { app } from "../../app";

describe("Leaky Bucket Rate Limiter", () => {
  const token = "token-sibelius";
  const auth = { Authorization: `Bearer ${token}` };

  it("should be able make 10 initial requests", async () => {
    for (let i = 0; i < 10; i++) {
      const res = await request(app.callback())
        .post("/query-pix-key")
        .set(auth)
        .send({ pixKey: `valida@${i}.com` });

      expect(res.status).toBe(200);
    }
  });

  it("11ª request should be blocked", async () => {
    for (let i = 0; i < 10; i++) {
      await request(app.callback())
        .post("/query-pix-key")
        .set(auth)
        .send({ pixKey: `` });
    }

    const res = await request(app.callback())
      .post("/query-pix-key")
      .set(auth)
      .send({ pixKey: `valida@11.com` });

    expect(res.status).toBe(429);
  });
});
