import { html, css, shadow } from "@unbndl/html";
import { createViewModel } from "@unbndl/view";
import { fromStore, Store } from "@unbndl/store";
import { Game } from "server/models";
import { Model } from "../model.ts";

function formatDate(iso: string): string {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

function gameResult(g: Game): string {
    if (g.heatScore == null || g.opponentScore == null) return "";
    if (g.heatScore > g.opponentScore) return "W";
    if (g.heatScore < g.opponentScore) return "L";
    return "T";
}

export class GameViewElement extends HTMLElement {
    viewModel: any = createViewModel({
        games: undefined as any
    }).with(fromStore<Model>(this) as any, "games");

    view = html`
        <div class="page-container">
            <main class="content-area">
                <h2>Schedule</h2>
                <p class="subtitle">2025-2026 Miami Heat regular season</p>

                ${($: any) => {
                    if (!$.games) return html`<p class="loading">Loading...</p>`;
                    if (!$.games.length) return html`<p>No games scheduled.</p>`;

                    return html`
                        <ul class="game-list">
                            ${$.games.map((g: Game) => {
                                const result = gameResult(g);
                                const hasScore = g.heatScore != null && g.opponentScore != null;
                                return html`
                                    <li class="game-item">
                                        <div class="game-date">
                                            <div class="date">${formatDate(g.date)}</div>
                                            ${g.time
                                                ? html`<div class="time">${g.time}</div>`
                                                : ""}
                                        </div>
                                        <div class="game-matchup">
                                            <span class="ha">${g.isHome ? "vs" : "@"}</span>
                                            <span class="opponent">${g.opponent}</span>
                                            ${g.location
                                                ? html`<span class="loc">${g.location}</span>`
                                                : ""}
                                        </div>
                                        <div class="game-result">
                                            ${hasScore
                                                ? html`<span class=${`result-badge ${result === "W" ? "win" : result === "L" ? "loss" : ""}`}>${result}</span>
                                                       <span class="score">${g.heatScore}-${g.opponentScore}</span>`
                                                : html`<span class="upcoming">Upcoming</span>`}
                                        </div>
                                    </li>
                                `;
                            })}
                        </ul>
                    `;
                }}
            </main>
        </div>
    `;

    constructor() {
        super();
        shadow(this)
            .styles(GameViewElement.styles)
            .replace(this.viewModel.render(this.view));
    }

    connectedCallback() {
        Store.dispatch(this, ["games/request", {}]);
    }

    static styles = css`
        :host {
            display: block;
        }
        .page-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: var(--space-lg);
        }
        h2 {
            font-family: 'Oswald', Impact, sans-serif;
            color: var(--color-text-heading);
            border-bottom: 1px solid var(--color-border-subtle);
            padding-bottom: var(--space-xs);
            margin-bottom: var(--space-xs);
        }
        .subtitle {
            color: var(--color-text-default);
            margin-bottom: var(--space-md);
        }
        .game-list {
            list-style: none;
            padding: 0;
        }
        .game-item {
            display: grid;
            grid-template-columns: 200px 1fr 150px;
            gap: var(--space-md);
            align-items: center;
            background-color: var(--color-background-section);
            border: 1px solid var(--color-border-subtle);
            border-radius: 8px;
            padding: var(--space-md);
            margin-bottom: var(--space-sm);
        }
        .game-date .date {
            font-family: 'Oswald', Impact, sans-serif;
            font-size: 1.125rem;
            color: var(--color-accent);
        }
        .game-date .time {
            font-size: 0.875rem;
            color: var(--color-text-default);
        }
        .game-matchup {
            display: flex;
            align-items: baseline;
            gap: var(--space-sm);
            flex-wrap: wrap;
        }
        .ha {
            color: var(--color-text-default);
            font-weight: bold;
            text-transform: uppercase;
            font-size: 0.875rem;
        }
        .opponent {
            font-family: 'Oswald', Impact, sans-serif;
            font-size: 1.25rem;
            color: var(--color-text-heading);
        }
        .loc {
            color: var(--color-text-default);
            font-size: 0.875rem;
            margin-left: auto;
        }
        .game-result {
            display: flex;
            align-items: center;
            gap: var(--space-sm);
            justify-content: flex-end;
        }
        .result-badge {
            font-family: 'Oswald', Impact, sans-serif;
            font-weight: 700;
            color: var(--color-white);
            background-color: var(--color-text-default);
            border-radius: 50%;
            width: 2rem;
            height: 2rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
        .result-badge.win {
            background-color: #2e7d32;
        }
        .result-badge.loss {
            background-color: var(--color-brand-red);
        }
        .score {
            font-weight: bold;
            color: var(--color-text-default);
        }
        .upcoming {
            color: var(--color-accent);
            font-style: italic;
        }
        .loading {
            color: var(--color-text-default);
            text-align: center;
            padding: var(--space-xl);
        }
    `;
}
