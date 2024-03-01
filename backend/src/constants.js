const PORT = process.env.PORT;
const MONGODB_URI = String(process.env.MONGODB_URI);
const DB_NAME = String(process.env.DB_NAME);
const CORS_ORIGIN = String(process.env.CORS_ORIGIN);
const ACCESS_TOKEN_SECRET = String(process.env.ACCESS_TOKEN_SECRET);
const REFRESH_TOKEN_SECRET = String(process.env.REFRESH_TOKEN_SECRET);
const ACCESS_TOKEN_EXPIRY = String(process.env.ACCESS_TOKEN_EXPIRY);
const REFRESH_TOKEN_EXPIRY = String(process.env.REFRESH_TOKEN_EXPIRY);
const BASE_URL = String(process.env.BASE_URL);
const FRONTEND_DOMAIN = String(process.env.FRONTEND_DOMAIN);
const NODE_ENV = String(process.env.NODE_ENV);
export {
  PORT,
  MONGODB_URI,
  DB_NAME,
  CORS_ORIGIN,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  BASE_URL,
  FRONTEND_DOMAIN,
  NODE_ENV,
};
