import { TeamRoster } from "server/models";

export interface Model {
    roster?: TeamRoster;
}

export const init: Model = {};
