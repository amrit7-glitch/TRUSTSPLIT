import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// import routes here
import userRouter from "./routes/user.route.js";
import webhookRouter from "./routes/webhook.route.js";
import stockRouter from "./routes/stock.route.js";



const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(cookieParser());

// 👇 webhook needs raw body BEFORE express.json() parses it
app.use("/api/v1/payment/webhook", express.raw({ type: "application/json" }));

// 👇 all other routes use normal json parsing
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// declare routes here
app.use("/api/v1/users", userRouter);
app.use("/api/v1/payment", webhookRouter);
app.use("/api/v1/stocks", stockRouter);

// 👇 global error handler - must be last, fixes HTML error responses
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({ success: false, message });
});

export default app;