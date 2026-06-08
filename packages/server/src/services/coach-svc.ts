// src/services/coach-svc.ts
import { Schema, model } from "mongoose";
import { Coach } from "../models/index.ts";

const coachSchema = new Schema<Coach>(
    {
        name: { type: String, required: true, trim: true },
        role: { type: String, required: true },
        yearsActive: Number,
        championships: Number,
        photo: String,
        bio: String
    },
    { collection: "coaches" }
);

const CoachModel = model<Coach>("Coach", coachSchema);

function index(): Promise<Coach[]> {
    return CoachModel.find();
}

function get(id: string): Promise<Coach | null> {
    return CoachModel.findById(id)
        .then((c) => c)
        .catch(() => {
            throw `${id} Not Found`;
        });
}

function create(json: Coach): Promise<Coach> {
    const c = new CoachModel(json);
    return c.save();
}

function update(id: string, coach: Coach): Promise<Coach | undefined> {
    return CoachModel.findByIdAndUpdate(id, coach, { new: true })
        .then((updated) => {
            if (!updated) throw `${id} not updated`;
            return updated as Coach;
        });
}

function remove(id: string): Promise<void> {
    return CoachModel.findByIdAndDelete(id).then((deleted) => {
        if (!deleted) throw `${id} not deleted`;
    });
}

export default { index, get, create, update, remove };
