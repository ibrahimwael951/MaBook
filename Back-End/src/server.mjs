import "dotenv/config";
import express from "express";
import passport from "passport";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import Router from "./routes/server.mjs";
import "./strategies/local-strategy.mjs";
// import Routes from
const Port = process.env.PORT || 4000;
const app = express();

mongoose
  .connect("mongodb://localhost/MaBook")
  .then(console.log("connected to DataBase"))
  .catch((err)=>{
    console.log(`Error : ${err}`)
  })
app.use(express.json());
app.use(
  session({
    secret: "01550522800",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 7, // exp after one week
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(Router);
app.listen(Port, () => {
  console.log(`app is ready now ${Port}`);
});
