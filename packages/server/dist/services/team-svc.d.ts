import { TeamRoster } from "../models/index.ts";
declare function index(): Promise<TeamRoster[]>;
declare function get(id: string): Promise<TeamRoster | null>;
declare function create(json: TeamRoster): Promise<TeamRoster>;
declare function update(id: string, roster: TeamRoster): Promise<TeamRoster | undefined>;
declare function remove(id: string): Promise<void>;
declare const _default: {
    index: typeof index;
    get: typeof get;
    create: typeof create;
    update: typeof update;
    remove: typeof remove;
};
export default _default;
