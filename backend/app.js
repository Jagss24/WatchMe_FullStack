import express from "express";
import dotenv from "dotenv";
dotenv.config();
import conn from "./conn/conn.js";
const mongoURI = process.env.MONGO_URI;
conn(mongoURI);
import auth from "./routes/auth.js";
import pins from "./routes/pins.js";
import save from "./routes/save.js";
import comment from "./routes/comment.js";
import search from "./routes/search.js";
import followers from "./routes/followers.js";
import cors from "cors";
import msg from "./routes/msg.js";
import upload from "./middleware/upload.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 1000;

app.use(express.json());
app.use(cors());
app.use("/public/uploads", express.static(path.join(__dirname, "public", "uploads")));
app.use("/api/v1", auth);
app.use("/api/v2", pins);
app.use("/api/v3", save);
app.use("/api/v4", comment);
app.use("/api/v5", search);
app.use("/api/v6", followers);
app.use("/api/v7", msg);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(port, () => {
  console.log("Server started");
});
