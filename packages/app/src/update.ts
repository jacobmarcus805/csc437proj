import { Auth } from "@unbndl/auth";
import { TeamRoster } from "server/models";
import { Model } from "./model.ts";
import { Msg } from "./messages.ts";

export type Cmd =
    | ["team/load", { roster: TeamRoster }];

export default function update(
    model: Readonly<Model>,
    message: Msg | Cmd,
    user: Auth.User
): Model | any {
    const [type, payload] = message;
    switch (type) {
        case "team/request":
            return [
                model,
                requestTeam(user)
            ];
        case "team/load": {
            const { roster } = payload as { roster: TeamRoster };
            return { ...model, roster };
        }
        default:
            throw new Error(`Unhandled message "${message}"`);
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
                // The API returns an array of TeamRosters; take the first
                const roster = Array.isArray(json) ? json[0] : json;
                return ["team/load", { roster: roster as TeamRoster }];
            }
            throw "No JSON in response from server";
        });
}
