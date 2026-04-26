import express from "express";
import ApiError from "./utils/ApiError.js";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import cors from "cors";

const app = express();

app.use(cookieParser());
app.set("trust proxy", 1);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running successfully" });
});

app.use("/api/auth", authRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res, next) => {
  next(new ApiError(404, "Route not found"));
});

app.use(errorHandler);

export default app;
