import e from "express";

import cookieParser from "cookie-parser";

import cors from "cors";

import { errorHandler } from "./middleware/error.middleware.js";

const app = e();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(e.json());
app.use(e.urlencoded({ extended: true }));
app.use(e.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js";

app.use("/user", userRouter);
app.use(errorHandler)

export { app };
