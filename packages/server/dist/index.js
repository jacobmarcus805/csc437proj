// src/index.ts
import express from "express";
import TeamService from "./services/team-svc.js";
const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";
app.use(express.static(staticDir));
// Middleware
app.use(express.json());
app.get("/hello", (_req, res) => {
    res.send("Hello, World");
});
app.get("/api/team", (_req, res) => {
    const data = TeamService.get();
    res.json(data);
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
