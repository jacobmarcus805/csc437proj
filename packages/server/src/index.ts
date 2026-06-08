// src/index.ts
import express, { Request, Response } from "express";
import fs from "node:fs/promises";
import path from "path";
import { connect } from "./services/mongo.ts";
import teamRouter from "./routes/team.ts";
import playerRouter from "./routes/player.ts";
import gameRouter from "./routes/game.ts";
import auth, { authenticateUser } from "./routes/auth.ts";

connect("proj");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));

// Middleware
app.use(express.json());

app.get("/hello", (_req: Request, res: Response) => {
    res.send("Hello, World");
});

app.use("/auth", auth);

app.use("/api/team", authenticateUser, teamRouter);

app.use("/api/players", authenticateUser, playerRouter);

app.use("/api/games", authenticateUser, gameRouter);

// SPA Routes: /app/...
app.use("/app", (_req: Request, res: Response) => {
    const indexHtml = path.resolve(staticDir, "index.html");
    fs.readFile(indexHtml, { encoding: "utf8" }).then((html) =>
        res.send(html)
    );
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
