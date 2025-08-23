import dotenv from "dotenv";
import express from "express";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import Router from "./routes/server.mjs";
import "./strategies/local-strategy.mjs";
import cors from "cors";
dotenv.config();

const Port = process.env.PORT || 4000;
const app = express();

mongoose
  .connect(process.env.MONGOOSE_API_KEY)
  .then(() => {
    console.log("✅ Connected to Database");
  })
  .catch((err) => {
    console.error("❌ Connection error:", err);
  });

app.use(
  cors({
    origin: ["http://localhost:3000", "https://mabook.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    credentials: true,
  })
);

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 7, // exp after one week
      httpOnly: true,
      sameSite: "lax", // or "none" in production with HTTPS
      secure: false, // must be false for localhost
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(Router);
app.get("/", (req, res) => {
  res.send("hello server is ready to work");
});
app.listen(Port, () => {
  console.log(`app is ready now ${Port}`);
});
