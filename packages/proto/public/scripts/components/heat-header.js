// scripts/components/heat-header.js
import { html, css, shadow } from "@unbndl/html";
import { createViewModel } from "@unbndl/view";
import { fromAuth } from "@unbndl/auth";

export class HeatHeaderElement extends HTMLElement {
    viewModel = createViewModel({
        authenticated: false,
        username: undefined
    }).with(fromAuth(this), "authenticated", "username");

    view = html`
        <header class="app-header">
            <div class="team-brand">
                <h1>
                    <svg class="icon"><use href="/icons/nba.svg#icon-basketball" /></svg>
                    Miami Heat
                </h1>
            </div>
            <nav class="app-nav">
                <a href="player.html">Roster</a>
                <a href="game.html">Schedule</a>
                <nav class=${($) => $.authenticated ? "logged-in" : "logged-out"}>
                    <span class="when-signed-in username">
                        Hello, ${($) => $.username || ""}
                    </span>
                    <span class="when-signed-in">
                        <button class="signout-btn">Sign Out</button>
                    </span>
                    <span class="when-signed-out">
                        <a href="/login.html">Login</a>
                    </span>
                </nav>
                <label class="theme-toggle">
                    <input type="checkbox" autocomplete="off" />
                    Light mode
                </label>
            </nav>
        </header>
    `;

    constructor() {
        super();
        shadow(this)
            .styles(HeatHeaderElement.styles)
            .replace(this.viewModel.render(this.view))
            .delegate(".signout-btn", {
                click: () => this.signout()
            });

        // Wire up dark mode toggle inside shadow DOM
        this.shadowRoot.addEventListener("change", (event) => {
            if (event.target.closest(".theme-toggle")) {
                document.body.classList.toggle("light-mode", event.target.checked);
            }
        });
    }

    signout() {
        const customEvent = new CustomEvent("auth:message", {
            bubbles: true,
            composed: true,
            detail: ["auth/signout"]
        });
        this.dispatchEvent(customEvent);
    }

    static styles = css`
        :host {
            display: block;
        }
        .app-header {
            background-color: var(--color-background-header);
            color: var(--color-text-header);
            padding: var(--space-lg);
            border-bottom: 4px solid var(--color-accent);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .app-nav {
            display: flex;
            align-items: center;
            gap: var(--space-lg);
        }
        h1 {
            font-family: 'Oswald', Impact, sans-serif;
            font-weight: 700;
        }
        .icon {
            display: inline;
            height: 2em;
            width: 2em;
            vertical-align: top;
            fill: currentColor;
        }
        a {
            color: var(--color-accent);
            text-decoration: none;
            font-weight: bold;
        }
        a:hover {
            color: var(--color-accent-hover);
        }
        button.signout-btn {
            background: none;
            border: none;
            color: var(--color-accent);
            font-weight: bold;
            cursor: pointer;
            font-size: inherit;
            padding: 0;
        }
        button.signout-btn:hover {
            color: var(--color-accent-hover);
        }
        span {
            display: none;
        }
        .logged-in .when-signed-in,
        .logged-out .when-signed-out {
            display: inline;
        }
        .username {
            color: var(--color-text-header);
            font-weight: normal;
            margin-right: var(--space-xs);
        }
        label.theme-toggle {
            display: flex;
            align-items: center;
            gap: var(--space-xs);
            color: var(--color-accent);
            font-weight: bold;
            cursor: pointer;
            margin: 0;
        }
        label.theme-toggle input {
            cursor: pointer;
            accent-color: var(--color-accent);
            margin: 0;
            position: relative;
            top: -1px;
        }
    `;
}
