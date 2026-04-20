require("./setup");
const request = require("supertest");
const app = require("../server");
const sequelize = require("../src/config/db.config");
const Role = require("../src/models/role.model");
const Deanery = require("../src/models/deanery.model");
const Parish = require("../src/models/parish.model");
const Ayd = require("../src/models/ayd.model");

let adminToken;
let memberToken;
let adminUserId;
let deaneryId;
let parishId;
let aydId;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  // Seed roles manually because server.js seed is only called from listen().
  await Role.bulkCreate([
    { name: "Admin" },
    { name: "Executive" },
    { name: "Chaplain" },
    { name: "Member" },
  ]);
});

afterAll(async () => {
  await sequelize.close();
});

describe("Smoke: core flows", () => {
  test("GET /health", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("GET /api/v1/role returns seeded roles", async () => {
    const res = await request(app).get("/api/v1/role");
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(4);
  });

  test("POST /api/v1/user/register creates admin", async () => {
    const adminRole = await Role.findOne({ where: { name: "Admin" } });
    const res = await request(app)
      .post("/api/v1/user/register")
      .send({
        firstName: "Ada",
        lastName: "Admin",
        email: "ada@example.com",
        password: "s3cret-pass",
        phoneNumber: "08012345678",
        roleId: adminRole.id,
      });
    expect(res.status).toBe(201);
    expect(res.body.data.token).toBeTruthy();
    adminToken = res.body.data.token;
    adminUserId = res.body.data.user.id;
  });

  test("POST /api/v1/user/register creates member", async () => {
    const memberRole = await Role.findOne({ where: { name: "Member" } });
    const res = await request(app)
      .post("/api/v1/user/register")
      .send({
        firstName: "Mike",
        lastName: "Member",
        email: "mike@example.com",
        password: "members-pass",
        phoneNumber: "08087654321",
        roleId: memberRole.id,
      });
    expect(res.status).toBe(201);
    memberToken = res.body.data.token;
  });

  test("POST /api/v1/user/login works and wrong password fails", async () => {
    const ok = await request(app)
      .post("/api/v1/user/login")
      .send({ email: "ada@example.com", password: "s3cret-pass" });
    expect(ok.status).toBe(200);
    expect(ok.body.data.token).toBeTruthy();

    const bad = await request(app)
      .post("/api/v1/user/login")
      .send({ email: "ada@example.com", password: "wrong" });
    expect(bad.status).toBe(401);
  });

  test("Validation rejects short passwords", async () => {
    const role = await Role.findOne({ where: { name: "Member" } });
    const res = await request(app)
      .post("/api/v1/user/register")
      .send({
        firstName: "X",
        lastName: "Y",
        email: "bad@example.com",
        password: "short",
        phoneNumber: "0800000000",
        roleId: role.id,
      });
    expect(res.status).toBe(400);
  });

  test("Protected route requires token", async () => {
    const res = await request(app).get("/api/v1/user");
    expect(res.status).toBe(401);
  });

  test("Admin can list users", async () => {
    const res = await request(app)
      .get("/api/v1/user")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBeGreaterThanOrEqual(2);
  });

  test("Non-admin cannot create deanery", async () => {
    const res = await request(app)
      .post("/api/v1/deanery")
      .set("Authorization", `Bearer ${memberToken}`)
      .send({ name: "Badness" });
    expect(res.status).toBe(403);
  });

  test("Admin creates deanery, parish, ayd; unpaid parish blocks delegate", async () => {
    const d = await request(app)
      .post("/api/v1/deanery")
      .set("Authorization", `Bearer ${adminToken}`)
      .field("name", "Ikeja Deanery")
      .field("email", "ikeja@example.com");
    expect(d.status).toBe(201);
    deaneryId = d.body.data.id;

    const p = await request(app)
      .post("/api/v1/parish")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "St. Mary Parish",
        email: "stmary@example.com",
        location: "Ikeja",
        deaneryId,
      });
    expect(p.status).toBe(201);
    parishId = p.body.data.id;

    const a = await request(app)
      .post("/api/v1/ayd")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ theme: "AYD 2026", venue: "Lagos", isActive: true });
    expect(a.status).toBe(201);
    aydId = a.body.data.id;

    const unpaid = await request(app).post("/api/v1/delegate/new").send({
      firstName: "Joe",
      lastName: "Cheap",
      email: "cheap@example.com",
      phoneNumber: "08011111111",
      deaneryId,
      parishId,
      aydId,
      position: "Member",
      gender: "Male",
    });
    expect(unpaid.status).toBe(402);
  });

  test("Mark parish paid, then register delegate", async () => {
    const upd = await request(app)
      .put(`/api/v1/parish/${parishId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ hasPaid: true });
    expect(upd.status).toBe(200);

    const ok = await request(app).post("/api/v1/delegate/new").send({
      firstName: "Joe",
      lastName: "Paid",
      email: "joe@example.com",
      phoneNumber: "08011111111",
      deaneryId,
      parishId,
      aydId,
      position: "Member",
      gender: "Male",
    });
    expect(ok.status).toBe(201);

    // Duplicate registration blocked.
    const dup = await request(app).post("/api/v1/delegate/new").send({
      firstName: "Joe",
      lastName: "Paid",
      email: "joe@example.com",
      phoneNumber: "08011111111",
      deaneryId,
      parishId,
      aydId,
      position: "Member",
      gender: "Male",
    });
    expect(dup.status).toBe(409);
  });

  test("Paid-parish filters surface the parish", async () => {
    const a = await request(app).get("/api/v1/parish/paid-parishes");
    expect(a.status).toBe(200);
    expect(a.body.data.length).toBe(1);

    const b = await request(app).get(`/api/v1/deanery/${deaneryId}/paid-parishes`);
    expect(b.status).toBe(200);
    expect(b.body.data.length).toBe(1);
  });

  test("Feedback is publicly submittable", async () => {
    const res = await request(app).post("/api/v1/feedback").send({
      email: "visitor@example.com",
      subject: "Hi",
      message: "Love the site",
    });
    expect(res.status).toBe(201);
  });

  test("404 handler", async () => {
    const res = await request(app).get("/api/v1/nope");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
