import { define, html } from "@unbndl/html";
import { Auth } from "@unbndl/auth";
import { Store } from "@unbndl/store";
import { BrowserHistory, Switch } from "@unbndl/switch";
import { Msg } from "./messages.ts";
import { Model, init } from "./model.ts";
import update, { Cmd } from "./update.ts";
import { HeatHeaderElement } from "./components/heat-header.ts";
import { HeatCardElement } from "./components/heat-card.ts";
import { HeatRosterElement } from "./components/heat-roster.ts";
import { HomeViewElement } from "./views/home-view.ts";
import { PlayerViewElement } from "./views/player-view.ts";
import { GameViewElement } from "./views/game-view.ts";
import { SeasonViewElement } from "./views/season-view.ts";
import { CoachViewElement } from "./views/coach-view.ts";
import { PlayoffGameViewElement } from "./views/playoff-game-view.ts";

const routes: Switch.Route[] = [
    {
        path: "/app/player",
        view: html`<player-view></player-view>`
    },
    {
        path: "/app/game",
        view: html`<game-view></game-view>`
    },
    {
        path: "/app/season",
        view: html`<season-view></season-view>`
    },
    {
        path: "/app/coach",
        view: html`<coach-view></coach-view>`
    },
    {
        path: "/app/playoff-game",
        view: html`<playoff-game-view></playoff-game-view>`
    },
    {
        path: "/app",
        view: html`<home-view></home-view>`
    },
    {
        path: "/",
        redirect: "/app"
    }
];

define({
    "auth-provider": Auth.Provider,
    "history-provider": BrowserHistory.Provider,
    "store-provider": class AppStore extends Store.Provider<Model, Msg, Cmd> {
        constructor() {
            super(update, init);
        }
    },
    "router-switch": class AppSwitch extends Switch.Element {
        constructor() {
            super(routes);
        }
    },
    "heat-header": HeatHeaderElement,
    "heat-card": HeatCardElement,
    "heat-roster": HeatRosterElement,
    "home-view": HomeViewElement,
    "player-view": PlayerViewElement,
    "game-view": GameViewElement,
    "season-view": SeasonViewElement,
    "coach-view": CoachViewElement,
    "playoff-game-view": PlayoffGameViewElement
});
