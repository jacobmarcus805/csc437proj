import { TeamRoster, Player, Game } from "server/models";

export interface Model {
    roster?: TeamRoster;
    players?: Player[];
    player?: Player;
    games?: Game[];
    game?: Game;
}

export const init: Model = {};
