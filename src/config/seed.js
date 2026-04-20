const bcrypt = require("bcryptjs");
const Role = require("../models/role.model");
const User = require("../models/user.model");
const logger = require("../utils/logger");

const DEFAULT_ROLES = [
  { name: "Admin", description: "Full system access" },
  { name: "Executive", description: "Archdiocesan executive" },
  { name: "Chaplain", description: "Parish/deanery chaplain" },
  { name: "Member", description: "Standard member" },
];

const seedRoles = async () => {
  for (const r of DEFAULT_ROLES) {
    const [role, created] = await Role.findOrCreate({
      where: { name: r.name },
      defaults: r,
    });
    if (created) logger.info({ role: role.name }, "Seeded role");
  }
};

const seedAdmin = async () => {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) return;

  const existing = await User.findOne({ where: { email } });
  if (existing) return;

  const adminRole = await Role.findOne({ where: { name: "Admin" } });
  if (!adminRole) return;

  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;
  await User.create({
    firstName: process.env.SEED_ADMIN_FIRST_NAME || "System",
    lastName: process.env.SEED_ADMIN_LAST_NAME || "Admin",
    email,
    password: await bcrypt.hash(password, saltRounds),
    phoneNumber: process.env.SEED_ADMIN_PHONE || "0000000000",
    roleId: adminRole.id,
    isActive: true,
  });
  logger.info({ email }, "Seeded admin user");
};

const seed = async () => {
  await seedRoles();
  await seedAdmin();
};

module.exports = { seed, seedRoles, seedAdmin };
