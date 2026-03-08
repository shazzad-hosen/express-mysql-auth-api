import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

export default app;
