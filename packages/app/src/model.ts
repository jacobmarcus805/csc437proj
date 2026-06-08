import { TeamRoster, Player } from "server/models";

export interface Model {
    roster?: TeamRoster;
    players?: Player[];
    player?: Player;
}

export const init: Model = {};
