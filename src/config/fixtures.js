// Comprehensive example data for every domain. Idempotent: re-running the
// script will no-op if the database already has records for a given table.
// Invoke via `node scripts/seed-fixtures.js`.

const bcrypt = require("bcryptjs");

const Role = require("../models/role.model");
const User = require("../models/user.model");
const Deanery = require("../models/deanery.model");
const Parish = require("../models/parish.model");
const Event = require("../models/event.model");
const Executive = require("../models/executive.model");
const Chaplain = require("../models/chaplain.model");
const Ayd = require("../models/ayd.model");
const Delegate = require("../models/delegate.model");
const News = require("../models/news.model");
const GalleryItem = require("../models/gallery.model");
const Feedback = require("../models/feedback.model");
const Policy = require("../models/policy.model");
const Payment = require("../models/payment.model");
const logger = require("../utils/logger");

const SALT_ROUNDS = 10;

const DEANERIES = [
  {
    name: "Badagry",
    meetingDay: "Second Saturday",
    time: "10:00:00",
    email: "badagry@cyonadclagos.org",
    phoneNumber: "08011111001",
    youtube: "https://youtube.com/@cyon-badagry",
    facebook: "https://facebook.com/cyon.badagry",
  },
  {
    name: "Epe",
    meetingDay: "First Sunday",
    time: "13:00:00",
    email: "epe@cyonadclagos.org",
    phoneNumber: "08011111002",
  },
  {
    name: "Festac",
    meetingDay: "Last Sunday",
    time: "14:00:00",
    email: "festac@cyonadclagos.org",
    phoneNumber: "08011111003",
    instagram: "https://instagram.com/cyonfestac",
  },
  {
    name: "Isolo",
    meetingDay: "First Sunday",
    time: "13:30:00",
    email: "isolo@cyonadclagos.org",
    phoneNumber: "08011111004",
  },
  {
    name: "Lekki",
    meetingDay: "Second Sunday",
    time: "14:00:00",
    email: "lekki@cyonadclagos.org",
    phoneNumber: "08011111005",
    twitter: "https://twitter.com/cyon_lekki",
  },
  {
    name: "Ikeja",
    meetingDay: "Last Sunday",
    time: "13:00:00",
    email: "ikeja@cyonadclagos.org",
    phoneNumber: "08011111006",
  },
];

// Parishes keyed by deanery name.
const PARISHES_BY_DEANERY = {
  Badagry: [
    { name: "St. Thomas More Parish, Topo", location: "Topo, Badagry", meetingDay: "Second Sunday", email: "stthomasmore@cyonadclagos.org" },
    { name: "Sacred Heart Parish, Ajara", location: "Ajara, Badagry", meetingDay: "First Sunday", email: "sacredheart.ajara@cyonadclagos.org" },
  ],
  Epe: [
    { name: "St. Michael Parish, Epe", location: "Epe Town", meetingDay: "Last Sunday", email: "stmichael.epe@cyonadclagos.org" },
    { name: "Our Lady of Fatima, Poka", location: "Poka, Epe", meetingDay: "Second Sunday", email: "olfatima.poka@cyonadclagos.org" },
  ],
  Festac: [
    { name: "Assumption Parish, Festac", location: "Festac Town", meetingDay: "Last Sunday", email: "assumption.festac@cyonadclagos.org" },
    { name: "St. Leo Parish, Festac", location: "Festac Town", meetingDay: "Second Sunday", email: "stleo.festac@cyonadclagos.org" },
    { name: "St. Michael Parish, Mile 2", location: "Mile 2", meetingDay: "Last Sunday", email: "stmichael.mile2@cyonadclagos.org" },
  ],
  Isolo: [
    { name: "St. Agnes Parish, Maryland", location: "Maryland", meetingDay: "First Sunday", email: "stagnes.maryland@cyonadclagos.org" },
    { name: "St. Anthony's Parish, Isolo", location: "Isolo", meetingDay: "Second Sunday", email: "stanthony.isolo@cyonadclagos.org" },
  ],
  Lekki: [
    { name: "Our Lady Queen of Nigeria, Lekki", location: "Lekki Phase 1", meetingDay: "Second Sunday", email: "olqn.lekki@cyonadclagos.org" },
    { name: "St. James Parish, Ikota", location: "Ikota, Lekki", meetingDay: "First Sunday", email: "stjames.ikota@cyonadclagos.org" },
  ],
  Ikeja: [
    { name: "St. Leo's Parish, Ikeja", location: "Ikeja GRA", meetingDay: "Last Sunday", email: "stleo.ikeja@cyonadclagos.org" },
    { name: "St. Dominic's Parish, Yaba", location: "Yaba", meetingDay: "Second Sunday", email: "stdominic.yaba@cyonadclagos.org" },
  ],
};

const PAID_PARISH_NAMES = new Set([
  "St. Thomas More Parish, Topo",
  "Assumption Parish, Festac",
  "St. Leo Parish, Festac",
  "St. Agnes Parish, Maryland",
  "Our Lady Queen of Nigeria, Lekki",
  "St. Leo's Parish, Ikeja",
]);

const ADC_EXECUTIVES = [
  { title: "Very Rev. Fr. Dr.", firstName: "Gabriel", lastName: "Okafor", position: "Chaplain, CYON Lagos ADC", order: 1 },
  { title: "Mr.", firstName: "Chukwuemeka", lastName: "Obi", position: "President, CYON Lagos ADC", order: 2, email: "president@cyonadclagos.org" },
  { title: "Ms.", firstName: "Vivian Ozioma", lastName: "Eze", position: "Vice President, CYON Lagos ADC", order: 3 },
  { title: "Ms.", firstName: "Marysandra", lastName: "Ikenna", position: "Asst. General Secretary", order: 4 },
  { title: "Mr.", firstName: "Augustine", lastName: "Ajayi", position: "Public Relations Officer 1", order: 5 },
  { title: "Mr.", firstName: "John Ebuke", lastName: "Nnamdi", position: "Director of Socials", order: 6 },
  { title: "Mr.", firstName: "Princewill Ebuka", lastName: "Okoro", position: "Provost", order: 7 },
  { title: "Ms.", firstName: "Elizabeth", lastName: "Udoh", position: "Admin. Secretary / LEP Welfare 2", order: 8 },
  { title: "Mr.", firstName: "Christopher", lastName: "Umeh", position: "LEP President", order: 9 },
  { title: "Ms.", firstName: "Karen", lastName: "Nwosu", position: "LEP Secretary", order: 10 },
  { title: "Mr.", firstName: "Chijoke", lastName: "Eke", position: "Ex-official I", order: 11 },
  { title: "Mr.", firstName: "Pius", lastName: "Adelekan", position: "Ex-official II", order: 12 },
];

const DEANERY_EXECUTIVES_TEMPLATE = [
  { position: "Deanery President", order: 1 },
  { position: "Deanery Vice President", order: 2 },
  { position: "Deanery Secretary", order: 3 },
  { position: "Deanery Treasurer", order: 4 },
  { position: "Deanery PRO", order: 5 },
];

const MOCK_FIRST_NAMES = ["Obi", "Amaka", "Tunde", "Chiamaka", "Emeka", "Funke", "Seyi", "Ngozi", "Ifeoma", "Bola"];
const MOCK_LAST_NAMES = ["Balogun", "Okeke", "Ajayi", "Udofia", "Ojo", "Nwosu", "Eze", "Umeh", "Lawal", "Ibeh"];

const CHAPLAIN_TEMPLATE = [
  { title: "Very Rev. Fr.", firstName: "Michael", lastName: "Obi" },
  { title: "Rev. Fr.", firstName: "Paul", lastName: "Ekanem" },
  { title: "Rev. Fr.", firstName: "Andrew", lastName: "Onyema" },
];

const ADC_EVENTS = [
  {
    name: "Archdiocesan Youth Day 2026",
    description: "Annual gathering of CYON delegates across the Archdiocese of Lagos.",
    date: new Date("2026-08-15T09:00:00Z"),
    time: "09:00:00",
    venue: "Archbishop's Hall, Ikeja",
  },
  {
    name: "Archdiocesan Youth Seminar",
    description: "Quarterly youth seminar on faith, leadership and social justice.",
    date: new Date("2026-05-18T10:00:00Z"),
    time: "10:00:00",
    venue: "Catholic Secretariat, Lagos",
  },
  {
    name: "Lenten Youth Retreat",
    description: "Three-day retreat during Lent for all CYON members.",
    date: new Date("2026-03-20T08:00:00Z"),
    time: "08:00:00",
    venue: "Our Lady of Apostles Retreat Centre",
  },
];

const DEANERY_EVENT_TEMPLATES = [
  { name: "Deanery General Meeting", description: "Monthly deanery-wide general meeting.", venue: "Host parish" },
  { name: "Deanery Prayer Walk", description: "Youth evangelism via a prayer walk.", venue: "TBA" },
];

const AYD_EVENTS = [
  {
    theme: "Arise, Shine — AYD 2026",
    venue: "Archbishop's Hall, Ikeja",
    startDate: new Date("2026-08-15T09:00:00Z"),
    endDate: new Date("2026-08-17T18:00:00Z"),
    description: "The 2026 Archdiocesan Youth Day — three days of worship, workshops and fellowship.",
    isActive: true,
  },
  {
    theme: "Light of the World — AYD 2025",
    venue: "St. Agnes, Maryland",
    startDate: new Date("2025-08-09T09:00:00Z"),
    endDate: new Date("2025-08-11T18:00:00Z"),
    description: "The 2025 edition (archived).",
    isActive: false,
  },
];

const NEWS_ITEMS = [
  {
    title: "CYON Lagos Commissions New Youth Welfare Initiative",
    summary: "A pilot programme to support indigent youth across the archdiocese.",
    body: "The Catholic Youth Organisation of Nigeria (CYON) Archdiocese of Lagos today commissioned a new youth welfare initiative, 'Operation Hope', aimed at providing educational grants and vocational training to underserved youth in our parishes. His Grace, Most Revd. Dr. Alfred Adewale Martins, led the commissioning ceremony at the Catholic Mission, Lagos.",
    source: "CYON Media Desk",
    externalUrl: "https://www.cyonadclagos.org/news/operation-hope",
    publishedAt: new Date("2026-03-05T10:00:00Z"),
  },
  {
    title: "AYD 2026 Registration Now Open",
    summary: "Registration for the 2026 Archdiocesan Youth Day is officially open.",
    body: "Registration for AYD 2026 is officially open. Parishes in good standing with the ADC may register their delegates through their deanery coordinators. Early-bird registration closes 30 June 2026.",
    source: "CYON Secretariat",
    publishedAt: new Date("2026-02-18T09:30:00Z"),
  },
  {
    title: "Deanery Finals of the Catholic Quiz Competition",
    summary: "Festac Deanery hosts this year's Catholic Quiz finals.",
    body: "The 2026 Catholic Quiz Competition reached its deanery-final stage last weekend with Festac Deanery hosting a tightly-contested match-up between St. Leo's Parish and Assumption Parish.",
    source: "CYON Media Desk",
    publishedAt: new Date("2026-01-27T12:00:00Z"),
  },
];

const GALLERY_ITEMS = [
  { title: "AYD 2025 Opening Ceremony", caption: "Delegates during the opening mass.", album: "AYD 2025", image: "ayd2025-opening.jpg" },
  { title: "AYD 2025 Workshops", caption: "Leadership workshop in session.", album: "AYD 2025", image: "ayd2025-workshop.jpg" },
  { title: "Lenten Retreat 2025", caption: "Silent meditation hour.", album: "Lenten Retreat 2025", image: "lent2025-01.jpg" },
  { title: "Catholic Quiz 2025", caption: "Quiz finalists with the Archbishop.", album: "Catholic Quiz 2025", image: "quiz2025-01.jpg" },
  { title: "Festac Deanery Prayer Walk", caption: "Deanery-wide evangelism walk.", album: "Deaneries", image: "festac-prayer-walk.jpg" },
];

const POLICIES = [
  {
    title: "CYON Lagos Code of Conduct",
    slug: "code-of-conduct",
    body: "All members of the Catholic Youth Organisation of Nigeria, Archdiocese of Lagos, are expected to uphold the Catholic faith and comport themselves with dignity...",
    isPublished: true,
  },
  {
    title: "Privacy Policy",
    slug: "privacy-policy",
    body: "This Privacy Policy describes how the CYON Lagos ADC collects, uses and protects the personal information of its members and website visitors...",
    isPublished: true,
  },
  {
    title: "AYD Delegate Guidelines",
    slug: "ayd-delegate-guidelines",
    body: "Every delegate must be registered through a parish in good standing with the Archdiocesan Council. Parishes must have fulfilled their ADC dues for the current year before delegates can be accredited.",
    isPublished: true,
  },
];

const FEEDBACK = [
  {
    name: "Ngozi A.",
    email: "ngozi@example.com",
    subject: "Website feedback",
    message: "Love the new site! Could we get an RSS feed for news?",
    status: "new",
  },
  {
    name: "Tunde B.",
    email: "tunde@example.com",
    phoneNumber: "08098765432",
    subject: "Registration issue",
    message: "I'm having trouble registering for AYD — the parish selector is empty.",
    status: "in_progress",
  },
];

const pick = (arr, i) => arr[i % arr.length];

const seedDeaneries = async () => {
  if ((await Deanery.count()) > 0) return logger.info("Deaneries already present; skipping");
  await Deanery.bulkCreate(DEANERIES);
  logger.info(`Seeded ${DEANERIES.length} deaneries`);
};

const seedParishes = async () => {
  if ((await Parish.count()) > 0) return logger.info("Parishes already present; skipping");
  const rows = [];
  const deaneries = await Deanery.findAll();
  for (const d of deaneries) {
    const parishes = PARISHES_BY_DEANERY[d.name] || [];
    for (const p of parishes) {
      rows.push({
        ...p,
        deaneryId: d.id,
        hasPaid: PAID_PARISH_NAMES.has(p.name),
      });
    }
  }
  await Parish.bulkCreate(rows);
  logger.info(`Seeded ${rows.length} parishes`);
};

const seedUsers = async () => {
  const existingMembers = await User.count();
  if (existingMembers > 5) return logger.info("Members already present; skipping");

  const roles = await Role.findAll();
  const byName = Object.fromEntries(roles.map((r) => [r.name, r.id]));
  const deaneries = await Deanery.findAll();
  const parishes = await Parish.findAll();
  const hash = await bcrypt.hash("Password!234", SALT_ROUNDS);

  const rows = [];

  // One executive per deanery
  deaneries.forEach((d, i) => {
    rows.push({
      firstName: pick(MOCK_FIRST_NAMES, i),
      lastName: pick(MOCK_LAST_NAMES, i + 2),
      email: `exec.${d.name.toLowerCase()}@cyonadclagos.org`,
      password: hash,
      phoneNumber: `080222000${String(i + 1).padStart(2, "0")}`,
      roleId: byName.Executive,
      deaneryId: d.id,
      isActive: true,
    });
  });

  // One chaplain user per deanery
  deaneries.forEach((d, i) => {
    rows.push({
      firstName: "Fr. " + pick(MOCK_FIRST_NAMES, i + 3),
      lastName: pick(MOCK_LAST_NAMES, i + 1),
      email: `chaplain.${d.name.toLowerCase()}@cyonadclagos.org`,
      password: hash,
      phoneNumber: `080333000${String(i + 1).padStart(2, "0")}`,
      roleId: byName.Chaplain,
      deaneryId: d.id,
      isActive: true,
    });
  });

  // Two members per parish
  parishes.forEach((p, i) => {
    for (let m = 0; m < 2; m++) {
      const idx = i * 2 + m;
      rows.push({
        firstName: pick(MOCK_FIRST_NAMES, idx),
        lastName: pick(MOCK_LAST_NAMES, idx + m),
        email: `member.${p.name.replace(/[^a-z0-9]/gi, "").toLowerCase()}.${m}@example.org`,
        password: hash,
        phoneNumber: `0809${String(1000000 + idx).slice(-7)}`,
        roleId: byName.Member,
        deaneryId: p.deaneryId,
        parishId: p.id,
        isActive: true,
      });
    }
  });

  await User.bulkCreate(rows);
  logger.info(`Seeded ${rows.length} users (password: Password!234)`);
};

const seedExecutives = async () => {
  if ((await Executive.count()) > 0) return logger.info("Executives already present; skipping");

  const adcRows = ADC_EXECUTIVES.map((e) => ({ ...e, adcId: "Lagos" }));
  const deaneries = await Deanery.findAll();
  const deaneryRows = [];
  deaneries.forEach((d, di) => {
    DEANERY_EXECUTIVES_TEMPLATE.forEach((role, ri) => {
      deaneryRows.push({
        firstName: pick(MOCK_FIRST_NAMES, di + ri),
        lastName: pick(MOCK_LAST_NAMES, di * 2 + ri),
        title: ri === 0 ? "Mr." : "Ms.",
        position: `${d.name} ${role.position}`,
        deaneryId: d.id,
        order: role.order,
      });
    });
  });

  await Executive.bulkCreate([...adcRows, ...deaneryRows]);
  logger.info(`Seeded ${adcRows.length} ADC + ${deaneryRows.length} deanery executives`);
};

const seedChaplains = async () => {
  if ((await Chaplain.count()) > 0) return logger.info("Chaplains already present; skipping");
  const deaneries = await Deanery.findAll();
  const rows = deaneries.map((d, i) => {
    const t = CHAPLAIN_TEMPLATE[i % CHAPLAIN_TEMPLATE.length];
    return {
      ...t,
      email: `chaplain.${d.name.toLowerCase()}@cyonadclagos.org`,
      phoneNumber: `080444000${String(i + 1).padStart(2, "0")}`,
      deaneryId: d.id,
    };
  });
  await Chaplain.bulkCreate(rows);
  logger.info(`Seeded ${rows.length} chaplains`);
};

const seedEvents = async () => {
  if ((await Event.count()) > 0) return logger.info("Events already present; skipping");

  const deaneries = await Deanery.findAll();
  const adcRows = ADC_EVENTS.map((e) => ({ ...e, adcId: "Lagos" }));

  const deaneryRows = [];
  deaneries.forEach((d, i) => {
    DEANERY_EVENT_TEMPLATES.forEach((t, ti) => {
      const date = new Date();
      date.setDate(date.getDate() + 14 + i * 7 + ti * 3);
      deaneryRows.push({
        name: `${d.name} — ${t.name}`,
        description: t.description,
        date,
        time: "14:00:00",
        venue: t.venue,
        deaneryId: d.id,
      });
    });
  });

  await Event.bulkCreate([...adcRows, ...deaneryRows]);
  logger.info(`Seeded ${adcRows.length} ADC + ${deaneryRows.length} deanery events`);
};

const seedAyd = async () => {
  if ((await Ayd.count()) > 0) return logger.info("AYD events already present; skipping");
  await Ayd.bulkCreate(AYD_EVENTS);
  logger.info(`Seeded ${AYD_EVENTS.length} AYD events`);
};

const seedDelegates = async () => {
  if ((await Delegate.count()) > 0) return logger.info("Delegates already present; skipping");

  const activeAyd = await Ayd.findOne({ where: { isActive: true } });
  if (!activeAyd) return logger.info("No active AYD; skipping delegate seed");
  const paidParishes = await Parish.findAll({ where: { hasPaid: true } });

  const rows = [];
  paidParishes.forEach((p, pi) => {
    for (let i = 0; i < 3; i++) {
      const idx = pi * 3 + i;
      rows.push({
        firstName: pick(MOCK_FIRST_NAMES, idx),
        lastName: pick(MOCK_LAST_NAMES, idx + 1),
        email: `delegate.${p.name.replace(/[^a-z0-9]/gi, "").toLowerCase()}.${i}@example.org`,
        phoneNumber: `0805${String(1000000 + idx).slice(-7)}`,
        gender: i % 2 === 0 ? "Male" : "Female",
        position: i === 0 ? "Parish President" : "Parish Member",
        aydId: activeAyd.id,
        deaneryId: p.deaneryId,
        parishId: p.id,
      });
    }
  });

  await Delegate.bulkCreate(rows);
  logger.info(`Seeded ${rows.length} delegates`);
};

const seedPayments = async () => {
  if ((await Payment.count()) > 0) return logger.info("Payments already present; skipping");

  const activeAyd = await Ayd.findOne({ where: { isActive: true } });
  const paidParishes = await Parish.findAll({ where: { hasPaid: true } });

  const rows = paidParishes.map((p, i) => ({
    amount: 50000,
    currency: "NGN",
    reference: `AYD26-${String(i + 1).padStart(4, "0")}`,
    method: i % 2 === 0 ? "transfer" : "cash",
    status: "confirmed",
    note: "AYD 2026 parish contribution",
    paidAt: new Date(Date.now() - (paidParishes.length - i) * 24 * 60 * 60 * 1000),
    parishId: p.id,
    aydId: activeAyd ? activeAyd.id : null,
  }));

  await Payment.bulkCreate(rows);
  logger.info(`Seeded ${rows.length} payments`);
};

const seedNews = async () => {
  if ((await News.count()) > 0) return logger.info("News already present; skipping");
  await News.bulkCreate(NEWS_ITEMS);
  logger.info(`Seeded ${NEWS_ITEMS.length} news articles`);
};

const seedGallery = async () => {
  if ((await GalleryItem.count()) > 0) return logger.info("Gallery already present; skipping");
  await GalleryItem.bulkCreate(GALLERY_ITEMS);
  logger.info(`Seeded ${GALLERY_ITEMS.length} gallery items`);
};

const seedPolicies = async () => {
  if ((await Policy.count()) > 0) return logger.info("Policies already present; skipping");
  await Policy.bulkCreate(POLICIES);
  logger.info(`Seeded ${POLICIES.length} policies`);
};

const seedFeedback = async () => {
  if ((await Feedback.count()) > 0) return logger.info("Feedback already present; skipping");
  await Feedback.bulkCreate(FEEDBACK);
  logger.info(`Seeded ${FEEDBACK.length} feedback entries`);
};

const seedAll = async () => {
  // Order matters — parents first.
  await seedDeaneries();
  await seedParishes();
  await seedUsers();
  await seedExecutives();
  await seedChaplains();
  await seedEvents();
  await seedAyd();
  await seedDelegates();
  await seedPayments();
  await seedNews();
  await seedGallery();
  await seedPolicies();
  await seedFeedback();
};

module.exports = { seedAll };
