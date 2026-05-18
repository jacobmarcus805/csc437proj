// src/routes/team.ts
import express, { Request, Response } from "express";
import { TeamRoster } from "../models/index.ts";
import TeamService from "../services/team-svc.ts";

const router = express.Router();

router.get("/", (_, res: Response) => {
    TeamService.index()
        .then((list: TeamRoster[]) => res.json(list))
        .catch((err) => res.status(500).send(err));
});

router.get("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    TeamService.get(id)
        .then((roster: TeamRoster | null) => {
            if (!roster) res.status(404).send();
            else res.json(roster);
        })
        .catch((err) => res.status(404).send(err));
});

router.post("/", (req: Request, res: Response) => {
    const newRoster = req.body;

    TeamService.create(newRoster)
        .then((roster: TeamRoster) => res.status(201).json(roster))
        .catch((err) => res.status(500).send(err));
});

router.put("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const updated = req.body;

    TeamService.update(id, updated)
        .then((roster: TeamRoster | undefined) => res.json(roster))
        .catch((err) => res.status(404).send(err));
});

router.delete("/:id", (req: Request, res: Response) => {
    const { id } = req.params;

    TeamService.remove(id)
        .then(() => res.status(204).end())
        .catch((err) => res.status(404).send(err));
});

export default router;
