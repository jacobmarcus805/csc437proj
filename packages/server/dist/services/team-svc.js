// src/services/team-svc.ts
import { Schema, model } from "mongoose";
const teamCardItemSchema = new Schema({
    label: String,
    href: String
});
const teamCardSchema = new Schema({
    heading: String,
    icon: String,
    items: [teamCardItemSchema]
});
const teamRosterSchema = new Schema({
    cards: [teamCardSchema]
}, { collection: "heat_roster" });
const TeamRosterModel = model("TeamRoster", teamRosterSchema);
function index() {
    return TeamRosterModel.find();
}
function get(id) {
    return TeamRosterModel.findById(id)
        .then((roster) => roster)
        .catch((err) => {
        throw `${id} Not Found`;
    });
}
function create(json) {
    const t = new TeamRosterModel(json);
    return t.save();
}
function update(id, roster) {
    return TeamRosterModel.findByIdAndUpdate(id, roster, { new: true })
        .then((updated) => {
        if (!updated)
            throw `${id} not updated`;
        return updated;
    });
}
function remove(id) {
    return TeamRosterModel.findByIdAndDelete(id).then((deleted) => {
        if (!deleted)
            throw `${id} not deleted`;
    });
}
export default { index, get, create, update, remove };
