import { html, css, shadow } from "@unbndl/html";
import { createViewModel } from "@unbndl/view";
import { fromAuth } from "@unbndl/auth";

export class HeatHeaderElement extends HTMLElement {
    viewModel = createViewModel({
        authenticated: false,
        username: undefined as string | undefined
    }).with(fromAuth(this), "authenticated", "username");

    view = html`
        <header class="app-header">
            <div class="team-brand">
                <a href="/app" class="brand-link">
                    <h1>
                        <img src="/icons/miami-heat-logo.svg" alt="Miami Heat logo" class="logo" />
                        Miami Heat
                    </h1>
                </a>
            </div>
            <nav class="app-nav">
                <a href="/app">Team Home</a>
                <a href="/app/players">Roster</a>
                <a href="/app/game">Schedule</a>
                <a href="/app/season">Season</a>
                <nav class=${($: any) => $.authenticated ? "logged-in" : "logged-out"}>
                    <span class="when-signed-in username">
                        Hello, ${($: any) => $.username || ""}
                    </span>
                    <span class="when-signed-in">
                        <button class="signout-btn">Sign Out</button>
                    </span>
                    <span class="when-signed-out">
                        <a href="/login.html" class="login-link">Login</a>
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
            })
            .delegate(".login-link", {
                click: (ev: Event) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    window.location.href = "/login.html";
                }
            });

        this.shadowRoot?.addEventListener("change", (event: Event) => {
            const target = event.target as HTMLInputElement;
            if (target.closest(".theme-toggle")) {
                document.body.classList.toggle("light-mode", target.checked);
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
            line-height: 1;
        }
        .app-header {
            background-color: var(--color-background-header);
            color: var(--color-text-header);
            padding: var(--space-lg);
            border-bottom: 4px solid var(--color-accent);
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            align-items: center;
            line-height: 1;
        }
        .app-nav {
            display: flex;
            align-items: center;
            gap: var(--space-lg);
            line-height: 1;
        }
        h1 {
            font-family: 'Oswald', Impact, sans-serif;
            font-weight: 700;
            line-height: 1;
            font-size: 2rem;
        }
        .logo {
            height: 2em;
            width: auto;
            vertical-align: middle;
            margin-right: var(--space-xs);
        }
        a {
            color: var(--color-brand-yellow);
            text-decoration: none;
            font-weight: bold;
        }
        a:hover {
            color: var(--color-white);
        }
        .brand-link {
            color: var(--color-text-header);
        }
        .brand-link:hover {
            color: var(--color-text-header);
        }
        button.signout-btn {
            background: none;
            border: none;
            color: var(--color-brand-yellow);
            font-weight: bold;
            cursor: pointer;
            font-size: inherit;
            padding: 0;
        }
        button.signout-btn:hover {
            color: var(--color-white);
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
            color: var(--color-brand-yellow);
            font-weight: bold;
            cursor: pointer;
            margin: 0;
        }
        label.theme-toggle input {
            cursor: pointer;
            accent-color: var(--color-brand-yellow);
            margin: 0;
            position: relative;
            top: -1px;
        }
    `;
}
