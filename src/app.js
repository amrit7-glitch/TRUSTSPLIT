import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();

// app.use(cors(
//     {
//         // origin: process.env.CORS_ORIGIN,
//         origin:true,
//         credentials: true
//     }
// ))

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

// 🔥 THIS LINE IS IMPORTANT
app.options("*", cors(corsOptions));

app.use(
  express.json({
    verify: (req, res, buf) => {
      if (req.originalUrl.startsWith("/api/v1/payment/webhook")) {
        req.rawBody = buf;
      }
    },
    limit:"16kb"
  })
);
app.use(express.urlencoded({extended: true, limit:"16kb"}));
app.use(express.static('public'));
app.use(cookieParser());

// import route here
import userRouter from "./routes/user.route.js";
import webhookRouter from "./routes/webhook.route.js"

// declare router here 
app.use("/api/v1/users",userRouter)
app.use("/api/v1/payment",webhookRouter)



// https://localhost:4000/api/v1/users

export default app