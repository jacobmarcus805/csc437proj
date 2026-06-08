import { TeamRoster, Player, Game, Coach } from "server/models";

export interface Model {
    roster?: TeamRoster;
    players?: Player[];
    player?: Player;
    games?: Game[];
    game?: Game;
    coaches?: Coach[];
    coach?: Coach;
}

export const init: Model = {};
