require("./setup");
const request = require("supertest");
const app = require("../server");
const sequelize = require("../src/config/db.config");
const Role = require("../src/models/role.model");

let adminToken;
let deaneryId;
let parishId;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await Role.bulkCreate([{ name: "Admin" }, { name: "Executive" }, { name: "Member" }]);
  const adminRole = await Role.findOne({ where: { name: "Admin" } });

  const reg = await request(app).post("/api/v1/user/register").send({
    firstName: "Pay",
    lastName: "Admin",
    email: "pay-admin@example.com",
    password: "admin-password",
    phoneNumber: "08099999999",
    roleId: adminRole.id,
  });
  adminToken = reg.body.data.token;

  const d = await request(app)
    .post("/api/v1/deanery")
    .set("Authorization", `Bearer ${adminToken}`)
    .field("name", "Payment Deanery")
    .field("email", "pay-deanery@example.com");
  deaneryId = d.body.data.id;

  const p = await request(app)
    .post("/api/v1/parish")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      name: "Payment Parish",
      email: "pay-parish@example.com",
      location: "X",
      deaneryId,
    });
  parishId = p.body.data.id;
});

afterAll(async () => {
  await sequelize.close();
});

describe("Parish payment ledger", () => {
  test("Parish starts unpaid", async () => {
    const res = await request(app).get(`/api/v1/parish/${parishId}`);
    expect(res.body.data.hasPaid).toBe(false);
  });

  test("Recording a confirmed payment flips hasPaid", async () => {
    const res = await request(app)
      .post(`/api/v1/parish/${parishId}/payments`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        amount: 25000,
        reference: "REF-001",
        method: "transfer",
        status: "confirmed",
      });
    expect(res.status).toBe(201);

    const fresh = await request(app).get(`/api/v1/parish/${parishId}`);
    expect(fresh.body.data.hasPaid).toBe(true);
  });

  test("Duplicate reference is rejected", async () => {
    const dup = await request(app)
      .post(`/api/v1/parish/${parishId}/payments`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ amount: 1, reference: "REF-001" });
    expect(dup.status).toBe(409);
  });

  test("Reversing the only confirmed payment flips hasPaid back", async () => {
    const list = await request(app)
      .get(`/api/v1/parish/${parishId}/payments`)
      .set("Authorization", `Bearer ${adminToken}`);
    const paymentId = list.body.data.items[0].id;

    const upd = await request(app)
      .patch(`/api/v1/payment/${paymentId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "reversed" });
    expect(upd.status).toBe(200);

    const fresh = await request(app).get(`/api/v1/parish/${parishId}`);
    expect(fresh.body.data.hasPaid).toBe(false);
  });
});
