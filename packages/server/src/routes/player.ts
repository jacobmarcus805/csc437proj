// src/routes/player.ts
import express, { Request, Response } from "express";
import { Player } from "../models/index.ts";
import PlayerService from "../services/player-svc.ts";

const router = express.Router();

router.get("/", (_, res: Response) => {
    PlayerService.index()
        .then((list: Player[]) => res.json(list))
        .catch((err) => res.status(500).send(err));
});

router.get("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    PlayerService.get(id)
        .then((player: Player | null) => {
            if (!player) res.status(404).send();
            else res.json(player);
        })
        .catch((err) => res.status(404).send(err));
});

router.post("/", (req: Request, res: Response) => {
    const newPlayer = req.body;
    PlayerService.create(newPlayer)
        .then((player: Player) => res.status(201).json(player))
        .catch((err) => res.status(500).send(err));
});

router.put("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const updated = req.body;
    PlayerService.update(id, updated)
        .then((player: Player | undefined) => res.json(player))
        .catch((err) => res.status(404).send(err));
});

router.delete("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    PlayerService.remove(id)
        .then(() => res.status(204).end())
        .catch((err) => res.status(404).send(err));
});

export default router;
