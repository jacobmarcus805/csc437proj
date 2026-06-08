import { Auth } from "@unbndl/auth";
import { TeamRoster, Player, Game, Coach } from "server/models";
import { Model } from "./model.ts";
import { Msg } from "./messages.ts";

export type Cmd =
    | ["team/load", { roster: TeamRoster }]
    | ["players/load", { players: Player[] }]
    | ["player/load", { player: Player }]
    | ["games/load", { games: Game[] }]
    | ["game/load", { game: Game }]
    | ["coaches/load", { coaches: Coach[] }]
    | ["coach/load", { coach: Coach }];

export default function update(
    model: Readonly<Model>,
    message: Msg | Cmd,
    user: Auth.User
): Model | any {
    switch (message[0]) {
        case "team/request":
            return [model, requestTeam(user)];

        case "team/load": {
            const { roster } = message[1];
            return { ...model, roster };
        }

        case "players/request":
            return [model, requestPlayers(user)];

        case "players/load": {
            const { players } = message[1];
            return { ...model, players };
        }

        case "player/request": {
            const { id } = message[1];
            return [model, requestPlayer(id, user)];
        }

        case "player/load": {
            const { player } = message[1];
            return { ...model, player };
        }

        case "player/save": {
            const { id, player } = message[1];
            const callbacks = message[2];
            return [
                model,
                savePlayer(id, player, user)
                    .then((updated) => {
                        callbacks?.onSuccess?.();
                        return ["player/load", { player: updated }];
                    })
                    .catch((err) => {
                        callbacks?.onFailure?.(err);
                        throw err;
                    })
            ];
        }

        case "player/create": {
            const { player } = message[1];
            const callbacks = message[2];
            return [
                model,
                createPlayer(player, user)
                    .then((created) => {
                        callbacks?.onSuccess?.(created._id || "");
                        return ["player/load", { player: created }];
                    })
                    .catch((err) => {
                        callbacks?.onFailure?.(err);
                        throw err;
                    })
            ];
        }

        case "games/request":
            return [model, requestGames(user)];

        case "games/load": {
            const { games } = message[1];
            return { ...model, games };
        }

        case "game/request": {
            const { id } = message[1];
            return [model, requestGame(id, user)];
        }

        case "game/load": {
            const { game } = message[1];
            return { ...model, game };
        }

        case "coaches/request":
            return [model, requestCoaches(user)];

        case "coaches/load": {
            const { coaches } = message[1];
            return { ...model, coaches };
        }

        case "coach/request": {
            const { id } = message[1];
            return [model, requestCoach(id, user)];
        }

        case "coach/load": {
            const { coach } = message[1];
            return { ...model, coach };
        }

        default: {
            const unhandled: never = message[0] as never;
            throw new Error(`Unhandled message "${unhandled}"`);
        }
    }
}

function requestTeam(user: Auth.User) {
    return fetch("/api/team", {
        headers: Auth.headers(user)
    })
        .then((response: Response) => {
            if (response.status === 200) return response.json();
            throw "No Response from server";
        })
        .then((json: unknown) => {
            if (json) {
                const roster = Array.isArray(json) ? json[0] : json;
                return ["team/load", { roster: roster as TeamRoster }];
            }
            throw "No JSON in response from server";
        });
}

function requestPlayers(user: Auth.User) {
    return fetch("/api/players", {
        headers: Auth.headers(user)
    })
        .then((response: Response) => {
            if (response.status === 200) return response.json();
            throw "No Response from server";
        })
        .then((json: unknown) => {
            if (json) {
                return ["players/load", { players: json as Player[] }];
            }
            throw "No JSON in response from server";
        });
}

function requestPlayer(id: string, user: Auth.User) {
    return fetch(`/api/players/${id}`, {
        headers: Auth.headers(user)
    })
        .then((response: Response) => {
            if (response.status === 200) return response.json();
            throw `${response.status} status fetching player ${id}`;
        })
        .then((json: unknown) => {
            if (json) {
                return ["player/load", { player: json as Player }];
            }
            throw "No JSON in response from server";
        });
}

function savePlayer(
    id: string,
    player: Player,
    user: Auth.User
): Promise<Player> {
    return fetch(`/api/players/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...Auth.headers(user)
        },
        body: JSON.stringify(player)
    })
        .then((res: Response) => {
            if (res.status === 200) return res.json();
            throw new Error(`${res.status} status; saving player ${id}`);
        })
        .then((json: unknown) => {
            if (json) return json as Player;
            throw new Error("No JSON in API response");
        })
        .catch((err) => {
            console.log("Error saving player:", err);
            throw err;
        });
}

function createPlayer(
    player: Player,
    user: Auth.User
): Promise<Player> {
    return fetch(`/api/players`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...Auth.headers(user)
        },
        body: JSON.stringify(player)
    })
        .then((res: Response) => {
            if (res.status === 201) return res.json();
            throw new Error(`${res.status} status; creating player`);
        })
        .then((json: unknown) => {
            if (json) return json as Player;
            throw new Error("No JSON in API response");
        })
        .catch((err) => {
            console.log("Error creating player:", err);
            throw err;
        });
}


function requestGames(user: Auth.User) {
    return fetch("/api/games", {
        headers: Auth.headers(user)
    })
        .then((response: Response) => {
            if (response.status === 200) return response.json();
            throw "No Response from server";
        })
        .then((json: unknown) => {
            if (json) {
                return ["games/load", { games: json as Game[] }];
            }
            throw "No JSON in response from server";
        });
}

function requestGame(id: string, user: Auth.User) {
    return fetch(`/api/games/${id}`, {
        headers: Auth.headers(user)
    })
        .then((response: Response) => {
            if (response.status === 200) return response.json();
            throw `${response.status} status fetching game ${id}`;
        })
        .then((json: unknown) => {
            if (json) {
                return ["game/load", { game: json as Game }];
            }
            throw "No JSON in response from server";
        });
}


function requestCoaches(user: Auth.User) {
    return fetch("/api/coaches", {
        headers: Auth.headers(user)
    })
        .then((response: Response) => {
            if (response.status === 200) return response.json();
            throw "No Response from server";
        })
        .then((json: unknown) => {
            if (json) {
                return ["coaches/load", { coaches: json as Coach[] }];
            }
            throw "No JSON in response from server";
        });
}

function requestCoach(id: string, user: Auth.User) {
    return fetch(`/api/coaches/${id}`, {
        headers: Auth.headers(user)
    })
        .then((response: Response) => {
            if (response.status === 200) return response.json();
            throw `${response.status} status fetching coach ${id}`;
        })
        .then((json: unknown) => {
            if (json) {
                return ["coach/load", { coach: json as Coach }];
            }
            throw "No JSON in response from server";
        });
}
