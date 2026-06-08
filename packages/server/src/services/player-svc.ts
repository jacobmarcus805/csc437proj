// src/services/player-svc.ts
import { Schema, model } from "mongoose";
import { Player } from "../models/index.ts";

const playerSchema = new Schema<Player>(
    {
        name: { type: String, required: true, trim: true },
        jersey: { type: Number, required: true },
        position: { type: String, required: true },
        height: { type: String, required: true },
        weight: Number,
        ppg: Number,
        rpg: Number,
        apg: Number,
        photo: String,
        bio: String
    },
    { collection: "players" }
);

const PlayerModel = model<Player>("Player", playerSchema);

function index(): Promise<Player[]> {
    return PlayerModel.find();
}

function get(id: string): Promise<Player | null> {
    return PlayerModel.findById(id)
        .then((player) => player)
        .catch(() => {
            throw `${id} Not Found`;
        });
}

function create(json: Player): Promise<Player> {
    const p = new PlayerModel(json);
    return p.save();
}

function update(id: string, player: Player): Promise<Player | undefined> {
    return PlayerModel.findByIdAndUpdate(id, player, { new: true })
        .then((updated) => {
            if (!updated) throw `${id} not updated`;
            return updated as Player;
        });
}

function remove(id: string): Promise<void> {
    return PlayerModel.findByIdAndDelete(id).then((deleted) => {
        if (!deleted) throw `${id} not deleted`;
    });
}

export default { index, get, create, update, remove };
