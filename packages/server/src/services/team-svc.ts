// src/services/team-svc.ts
import { Schema, model } from "mongoose";
import { TeamRoster, TeamCard, TeamCardItem } from "../models/index.ts";

const teamCardItemSchema = new Schema<TeamCardItem>({
    label: String,
    href: String
});

const teamCardSchema = new Schema<TeamCard>({
    heading: String,
    icon: String,
    items: [teamCardItemSchema]
});

const teamRosterSchema = new Schema<TeamRoster>(
    {
        cards: [teamCardSchema]
    },
    { collection: "heat_roster" }
);

const TeamRosterModel = model<TeamRoster>("TeamRoster", teamRosterSchema);

function index(): Promise<TeamRoster[]> {
    return TeamRosterModel.find();
}

function get(id: string): Promise<TeamRoster | null> {
    return TeamRosterModel.findById(id)
        .then((roster) => roster)
        .catch((err) => {
            throw `${id} Not Found`;
        });
}

function create(json: TeamRoster): Promise<TeamRoster> {
  const t = new TeamRosterModel(json);
  return t.save();
}


function update(id: string, roster: TeamRoster): Promise<TeamRoster | undefined> {
    return TeamRosterModel.findByIdAndUpdate(id, roster, { new: true })
        .then((updated) => {
            if (!updated) throw `${id} not updated`;
            return updated as TeamRoster;
        });
}

function remove(id: string): Promise<void> {
    return TeamRosterModel.findByIdAndDelete(id).then((deleted) => {
        if (!deleted) throw `${id} not deleted`;
    });
}

export default { index, get, create, update, remove };
