import { Player } from "server/models";

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
    ];
