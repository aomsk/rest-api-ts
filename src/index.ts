import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import router from "./router";

// create express instance
const app = express();

// use cors
app.use(
  cors({
    credentials: true,
  })
);

// use compression, cookieParser, bodyParser
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

// connect database (mongodb)
const MONGO_URL = process.env.MONGO_URL;
mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on("error", (err: any) => {
  console.log(`MongoDB connection error: ${err}`);
});
mongoose.connection.once("connected", () => {
  console.log("MongoDB connected");
});

// helper check
app.get("/hello", (req: express.Request, res: express.Response) => {
  res.status(200).json({ message: "Help Check", status: "OK" });
});

// router
app.use("/", router());

// create server
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
