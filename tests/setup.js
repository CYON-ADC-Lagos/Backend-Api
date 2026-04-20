// Force sqlite in-memory and strict env before any module is loaded.
process.env.NODE_ENV = "test";
process.env.DB_NAME = "cyon_test";
process.env.DB_USER = "test";
process.env.DB_PASSWORD = "test";
process.env.DB_HOST = "localhost";
process.env.DB_DIALECT = "sqlite";
process.env.DB_SYNC = "force";
process.env.JWT_SECRET = "test-secret-not-for-production";
process.env.JWT_EXPIRES_IN = "1h";
process.env.CORS_ORIGINS = "";
process.env.BCRYPT_SALT_ROUNDS = "4";
process.env.LOG_LEVEL = "silent";
