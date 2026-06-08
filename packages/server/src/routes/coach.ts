// src/routes/coach.ts
import express, { Request, Response } from "express";
import { Coach } from "../models/index.ts";
import CoachService from "../services/coach-svc.ts";

const router = express.Router();

router.get("/", (_, res: Response) => {
    CoachService.index()
        .then((list: Coach[]) => res.json(list))
        .catch((err) => res.status(500).send(err));
});

router.get("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    CoachService.get(id)
        .then((coach: Coach | null) => {
            if (!coach) res.status(404).send();
            else res.json(coach);
        })
        .catch((err) => res.status(404).send(err));
});

router.post("/", (req: Request, res: Response) => {
    const newCoach = req.body;
    CoachService.create(newCoach)
        .then((coach: Coach) => res.status(201).json(coach))
        .catch((err) => res.status(500).send(err));
});

router.put("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const updated = req.body;
    CoachService.update(id, updated)
        .then((coach: Coach | undefined) => res.json(coach))
        .catch((err) => res.status(404).send(err));
});

router.delete("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    CoachService.remove(id)
        .then(() => res.status(204).end())
        .catch((err) => res.status(404).send(err));
});

export default router;
