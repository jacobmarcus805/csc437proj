import { Player, Game, Coach } from "server/models";

export type Msg =
    | ["team/request", {}]
    | ["players/request", {}]
    | ["player/request", { id: string }]
    | [
        "player/save",
        { id: string; player: Player },
        {
            onSuccess?: () => void;
            onFailure?: (err: Error) => void;
        }
    ]
    | [
        "player/create",
        { player: Player },
        {
            onSuccess?: (id: string) => void;
            onFailure?: (err: Error) => void;
        }
    ]
    | ["games/request", {}]
    | ["game/request", { id: string }]
    | ["coaches/request", {}]
    | ["coach/request", { id: string }];
