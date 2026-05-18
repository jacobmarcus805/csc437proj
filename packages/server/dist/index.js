// src/index.ts
import express from "express";
import { connect } from "./services/mongo.js";
import teamRouter from "./routes/team.js";
import auth, { authenticateUser } from "./routes/auth.js";
connect("proj");
const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";
app.use(express.static(staticDir));
// Middleware
app.use(express.json());
app.get("/hello", (_req, res) => {
    res.send("Hello, World");
});
app.use("/auth", auth);
app.use("/api/team", authenticateUser, teamRouter);
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
