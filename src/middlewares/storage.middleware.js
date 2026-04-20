// const fs = require("fs");
// const path = require("path");
// const crypto = require("crypto");
// const multer = require("multer");
// const ErrorResponse = require("../utils/errorResponse");

// const UPLOAD_ROOT = path.resolve(__dirname, "..", "..", "uploads");
// if (!fs.existsSync(UPLOAD_ROOT)) {
//   fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
// }

// const ALLOWED_MIME = new Set([
//   "image/jpeg",
//   "image/png",
//   "image/webp",
//   "image/gif",
//   "application/pdf",
// ]);
// const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

// const storage = multer.diskStorage({
//   destination: (_req, _file, cb) => cb(null, UPLOAD_ROOT),
//   filename: (_req, file, cb) => {
//     const ext = path.extname(file.originalname).toLowerCase().slice(0, 10);
//     const safeName = crypto.randomBytes(16).toString("hex");
//     cb(null, `${Date.now()}_${safeName}${ext}`);
//   },
// });

// const fileFilter = (_req, file, cb) => {
//   if (!ALLOWED_MIME.has(file.mimetype)) {
//     return cb(new ErrorResponse("Unsupported file type", 415), false);
//   }
//   cb(null, true);
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: MAX_BYTES, files: 1 },
// });

// module.exports = upload;
// module.exports.UPLOAD_ROOT = UPLOAD_ROOT;

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const ErrorResponse = require("../utils/errorResponse");

const UPLOAD_ROOT =
  process.env.NODE_ENV === "production"
    ? "/tmp/uploads"
    : path.resolve(__dirname, "..", "..", "uploads");

if (!fs.existsSync(UPLOAD_ROOT)) {
  fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
}

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]);
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_ROOT),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().slice(0, 10);
    const safeName = crypto.randomBytes(16).toString("hex");
    cb(null, `${Date.now()}_${safeName}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (!ALLOWED_MIME.has(file.mimetype)) {
    return cb(new ErrorResponse("Unsupported file type", 415), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_BYTES, files: 1 },
});

module.exports = upload;
module.exports.UPLOAD_ROOT = UPLOAD_ROOT;
