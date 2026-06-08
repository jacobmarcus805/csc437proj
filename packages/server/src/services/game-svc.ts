// src/services/game-svc.ts
import { Schema, model } from "mongoose";
import { Game } from "../models/index.ts";

const gameSchema = new Schema<Game>(
    {
        date: { type: String, required: true },
        time: String,
        opponent: { type: String, required: true, trim: true },
        opponentLogo: String,
        isHome: { type: Boolean, required: true, default: true },
        location: String,
        heatScore: Number,
        opponentScore: Number,
        notes: String
    },
    { collection: "games" }
);

const GameModel = model<Game>("Game", gameSchema);

function index(): Promise<Game[]> {
    return GameModel.find().sort({ date: 1 });
}

function get(id: string): Promise<Game | null> {
    return GameModel.findById(id)
        .then((g) => g)
        .catch(() => {
            throw `${id} Not Found`;
        });
}

function create(json: Game): Promise<Game> {
    const g = new GameModel(json);
    return g.save();
}

function update(id: string, game: Game): Promise<Game | undefined> {
    return GameModel.findByIdAndUpdate(id, game, { new: true })
        .then((updated) => {
            if (!updated) throw `${id} not updated`;
            return updated as Game;
        });
}

function remove(id: string): Promise<void> {
    return GameModel.findByIdAndDelete(id).then((deleted) => {
        if (!deleted) throw `${id} not deleted`;
    });
}

export default { index, get, create, update, remove };
