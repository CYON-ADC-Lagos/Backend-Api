require("./setup");
const crypto = require("crypto");
const request = require("supertest");
const app = require("../server");
const sequelize = require("../src/config/db.config");
const Role = require("../src/models/role.model");
const User = require("../src/models/user.model");

let memberRole;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await Role.bulkCreate([{ name: "Admin" }, { name: "Member" }]);
  memberRole = await Role.findOne({ where: { name: "Member" } });

  await request(app).post("/api/v1/user/register").send({
    firstName: "Pam",
    lastName: "Reset",
    email: "pam@example.com",
    password: "old-password-1",
    phoneNumber: "08000000000",
    roleId: memberRole.id,
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Password reset flow", () => {
  test("forgot-password always returns 200 and populates resetTokenHash", async () => {
    const missing = await request(app)
      .post("/api/v1/user/forgot-password")
      .send({ email: "nobody@example.com" });
    expect(missing.status).toBe(200);

    const real = await request(app)
      .post("/api/v1/user/forgot-password")
      .send({ email: "pam@example.com" });
    expect(real.status).toBe(200);

    const user = await User.findOne({ where: { email: "pam@example.com" } });
    expect(user.resetTokenHash).toBeTruthy();
    expect(user.resetTokenExpiresAt).toBeTruthy();
  });

  test("reset-password rejects invalid tokens", async () => {
    const res = await request(app)
      .post("/api/v1/user/reset-password")
      .send({ token: "not-a-real-token-aaaaaaaaaaaa", password: "brand-new-1" });
    expect(res.status).toBe(400);
  });

  test("reset-password with a matching token updates credentials", async () => {
    // Inject a known raw token for deterministic testing.
    const rawToken = "a".repeat(64);
    const hash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const user = await User.findOne({ where: { email: "pam@example.com" } });
    await user.update({
      resetTokenHash: hash,
      resetTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    const res = await request(app)
      .post("/api/v1/user/reset-password")
      .send({ token: rawToken, password: "brand-new-password" });
    expect(res.status).toBe(200);

    const oldLogin = await request(app)
      .post("/api/v1/user/login")
      .send({ email: "pam@example.com", password: "old-password-1" });
    expect(oldLogin.status).toBe(401);

    const newLogin = await request(app)
      .post("/api/v1/user/login")
      .send({ email: "pam@example.com", password: "brand-new-password" });
    expect(newLogin.status).toBe(200);
  });

  test("reset-password rejects expired tokens", async () => {
    const rawToken = "b".repeat(64);
    const hash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const user = await User.findOne({ where: { email: "pam@example.com" } });
    await user.update({
      resetTokenHash: hash,
      resetTokenExpiresAt: new Date(Date.now() - 1000),
    });
    const res = await request(app)
      .post("/api/v1/user/reset-password")
      .send({ token: rawToken, password: "irrelevant-password" });
    expect(res.status).toBe(400);
  });

  test("change-password requires correct current password", async () => {
    const login = await request(app)
      .post("/api/v1/user/login")
      .send({ email: "pam@example.com", password: "brand-new-password" });
    expect(login.status).toBe(200);
    const token = login.body.data.token;

    const wrong = await request(app)
      .post("/api/v1/user/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({ currentPassword: "nope", newPassword: "another-new-1" });
    expect(wrong.status).toBe(401);

    const right = await request(app)
      .post("/api/v1/user/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({ currentPassword: "brand-new-password", newPassword: "another-new-1" });
    expect(right.status).toBe(200);
  });
});
