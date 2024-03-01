import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./db/index.js";
import { CORS_ORIGIN, NODE_ENV, PORT } from "./constants.js";
import userRouter from "./routes/user.js";
import fileRouter from "./routes/file.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: NODE_ENV === "production" ? CORS_ORIGIN : "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);
app.use(express.static("public"));
app.use(cookieParser());
app.use(helmet()); // Helmet middleware for setting security headers

// Rate limiting middleware
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100,
// });
// app.use(limiter);

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/files", fileRouter);

connectDB()
  .then(() => {
    app.listen(PORT || 8000, () => {
      console.log(`Server is running at Port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGOD Connection Failed !!! ", err);
  });
