import { html, css, shadow } from "@unbndl/html";
import { createViewModel } from "@unbndl/view";
import { fromStore, Store } from "@unbndl/store";
import { Player } from "server/models";
import { Model } from "../model.ts";

export class PlayerDetailViewElement extends HTMLElement {
    static get observedAttributes() {
        return ["player-id"];
    }

    viewModel: any = createViewModel({
        playerId: undefined as string | undefined,
        player: undefined as Player | undefined
    }).with(fromStore<Model>(this) as any, "player");

    view = html`
        <div class="page-container">
            ${($: any) => {
                const p = $.player;
                if (!p) return html`<p class="loading">Loading...</p>`;
                return html`
                    <article class="player-card">
                        <header class="player-header">
                            <img
                                class="player-photo"
                                src=${p.photo || ""}
                                alt=${p.name}
                            />
                            <div class="player-meta">
                                <h2>${p.name}</h2>
                                <p class="jersey-line">#${p.jersey}</p>
                                <p class="position">
                                    ${p.position} · ${p.height}${p.weight ? ` · ${p.weight} lbs` : ""}
                                </p>
                            </div>
                        </header>

                        <div class="stats-grid">
                            <div class="stat">
                                <span class="stat-label">PPG</span>
                                <span class="stat-value">${p.ppg ?? "-"}</span>
                            </div>
                            <div class="stat">
                                <span class="stat-label">RPG</span>
                                <span class="stat-value">${p.rpg ?? "-"}</span>
                            </div>
                            <div class="stat">
                                <span class="stat-label">APG</span>
                                <span class="stat-value">${p.apg ?? "-"}</span>
                            </div>
                        </div>

                        ${p.bio
                            ? html`<section class="bio">
                                  <h3>Biography</h3>
                                  <p>${p.bio}</p>
                              </section>`
                            : ""}

                        <div class="actions">
                            <a class="btn" href=${`/app/players/${p._id}/edit`}>
                                Edit Player
                            </a>
                            <a class="link" href="/app/players">Back to Roster</a>
                        </div>
                    </article>
                `;
            }}
        </div>
    `;

    constructor() {
        super();
        shadow(this)
            .styles(PlayerDetailViewElement.styles)
            .replace(this.viewModel.render(this.view));
    }

    connectedCallback() {
        // Try to get player-id from attribute first, then from URL
        let playerId = this.getAttribute("player-id");
        if (!playerId) {
            const match = window.location.pathname.match(/\/app\/players\/([^/]+)/);
            if (match) playerId = match[1];
        }
        if (playerId) {
            this.viewModel.set("playerId", playerId);
            Store.dispatch(this, ["player/request", { id: playerId }]);
        }
    }

    attributeChangedCallback(name: string, _: string, newValue: string) {
        if (name === "player-id" && newValue && this.isConnected) {
            this.viewModel.set("playerId", newValue);
            Store.dispatch(this, ["player/request", { id: newValue }]);
        }
    }

    static styles = css`
        :host {
            display: block;
        }
        .page-container {
            max-width: 800px;
            margin: 0 auto;
            padding: var(--space-lg);
        }
        .player-card {
            background-color: var(--color-background-section);
            border: 1px solid var(--color-border-subtle);
            border-radius: 8px;
            padding: var(--space-lg);
        }
        .player-header {
            display: flex;
            align-items: center;
            gap: var(--space-md);
            border-bottom: 1px solid var(--color-border-subtle);
            padding-bottom: var(--space-md);
            margin-bottom: var(--space-md);
        }
        .jersey-badge {
            background-color: var(--color-brand-red);
            color: var(--color-white);
            font-family: 'Oswald', Impact, sans-serif;
            font-size: 2rem;
            font-weight: 700;
            width: 4rem;
            height: 4rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            border: 3px solid var(--color-brand-yellow);
        }
        .player-photo {
            width: 8rem;
            height: 8rem;
            border-radius: 50%;
            border: 3px solid var(--color-brand-yellow);
            object-fit: cover;
            background-color: var(--color-background-page);
        }
        .player-meta h2 {
            margin-bottom: var(--space-xs);
        }
        .jersey-line {
            color: var(--color-accent);
            font-family: 'Oswald', Impact, sans-serif;
            font-size: 1.25rem;
            margin: 0 0 var(--space-xs) 0;
        }
        h2 {
            font-family: 'Oswald', Impact, sans-serif;
            color: var(--color-text-heading);
            margin: 0;
        }
        .position {
            color: var(--color-text-default);
            margin: 0;
            margin-top: var(--space-xs);
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: var(--space-md);
            margin-bottom: var(--space-md);
        }
        .stat {
            background-color: var(--color-background-page);
            border: 1px solid var(--color-border-subtle);
            border-radius: 8px;
            padding: var(--space-md);
            text-align: center;
        }
        .stat-label {
            display: block;
            font-size: 0.875rem;
            color: var(--color-text-default);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: var(--space-xs);
        }
        .stat-value {
            display: block;
            font-family: 'Oswald', Impact, sans-serif;
            font-size: 2rem;
            font-weight: 700;
            color: var(--color-accent);
        }
        .bio {
            margin-bottom: var(--space-md);
        }
        .bio h3 {
            font-family: 'Oswald', Impact, sans-serif;
            color: var(--color-text-heading);
            margin-bottom: var(--space-xs);
        }
        .actions {
            display: flex;
            gap: var(--space-md);
            align-items: center;
            margin-top: var(--space-md);
            padding-top: var(--space-md);
            border-top: 1px solid var(--color-border-subtle);
        }
        .btn {
            background-color: var(--color-brand-yellow);
            color: var(--color-brand-red);
            text-decoration: none;
            padding: var(--space-sm) var(--space-lg);
            border-radius: 4px;
            font-weight: bold;
        }
        .btn:hover {
            background-color: var(--color-white);
        }
        .link {
            color: var(--color-accent);
            text-decoration: none;
            font-weight: bold;
        }
        .link:hover {
            color: var(--color-accent-hover);
        }
        .loading {
            color: var(--color-text-default);
            text-align: center;
            padding: var(--space-xl);
        }
    `;
}
