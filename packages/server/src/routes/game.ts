// src/routes/game.ts
import express, { Request, Response } from "express";
import { Game } from "../models/index.ts";
import GameService from "../services/game-svc.ts";

const router = express.Router();

router.get("/", (_, res: Response) => {
    GameService.index()
        .then((list: Game[]) => res.json(list))
        .catch((err) => res.status(500).send(err));
});

router.get("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    GameService.get(id)
        .then((game: Game | null) => {
            if (!game) res.status(404).send();
            else res.json(game);
        })
        .catch((err) => res.status(404).send(err));
});

router.post("/", (req: Request, res: Response) => {
    const newGame = req.body;
    GameService.create(newGame)
        .then((game: Game) => res.status(201).json(game))
        .catch((err) => res.status(500).send(err));
});

router.put("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const updated = req.body;
    GameService.update(id, updated)
        .then((game: Game | undefined) => res.json(game))
        .catch((err) => res.status(404).send(err));
});

router.delete("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    GameService.remove(id)
        .then(() => res.status(204).end())
        .catch((err) => res.status(404).send(err));
});

export default router;
