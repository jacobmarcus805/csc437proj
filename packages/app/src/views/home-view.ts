import { html, css, shadow } from "@unbndl/html";
import { createViewModel } from "@unbndl/view";
import { fromStore, Store } from "@unbndl/store";
import { Player } from "server/models";
import { Model } from "../model.ts";

export class HomeViewElement extends HTMLElement {
    viewModel: any = createViewModel({
        players: undefined as any
    }).with(fromStore<Model>(this) as any, "players");

    view = html`
        <div class="page-container">
            <aside class="sidebar">
                <h3>Quick Stats</h3>
                <ul>
                    <li>Record: 42-20</li>
                    <li>Streak: W5</li>
                    <li>Conference: 2nd in East</li>
                </ul>
            </aside>

            <main class="content-area">
                <h2>Welcome to Heat Nation</h2>
                <p>Manage the Miami Heat roster, schedule, and season info.</p>

                <div class="card-row">
                    <a href="/app/players" class="action-card">
                        <h3>Roster</h3>
                        <p>${($: any) =>
                            $.players?.length
                                ? `${$.players.length} player${
                                      $.players.length === 1 ? "" : "s"
                                  } on the team`
                                : "View and manage players"}</p>
                    </a>
                    <a href="/app/coach" class="action-card">
                        <h3>Coach</h3>
                        <p>Erik Spoelstra and the coaching staff</p>
                    </a>
                    <a href="/app/season" class="action-card">
                        <h3>Season</h3>
                        <p>2025-2026 NBA Season overview</p>
                    </a>
                    <a href="/app/game" class="action-card">
                        <h3>Schedule</h3>
                        <p>Upcoming and recent games</p>
                    </a>
                </div>

                ${($: any) =>
                    $.players?.length
                        ? html`
                              <h3 class="featured-heading">Featured Players</h3>
                              <ul class="player-preview">
                                  ${$.players.slice(0, 5).map(
                                      (p: Player) => html`
                                          <li>
                                              <a href=${`/app/players/${p._id}/edit`}>
                                                  #${p.jersey} ${p.name}
                                                  <span class="position">${p.position}</span>
                                              </a>
                                          </li>
                                      `
                                  )}
                              </ul>
                          `
                        : ""}
            </main>
        </div>
    `;

    constructor() {
        super();
        shadow(this)
            .styles(HomeViewElement.styles)
            .replace(this.viewModel.render(this.view));
    }

    connectedCallback() {
        Store.dispatch(this, ["players/request", {}]);
    }

    static styles = css`
        :host {
            display: block;
        }
        .page-container {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            max-width: 1200px;
            margin: 0 auto;
            gap: var(--space-lg);
            padding: var(--space-lg);
        }
        .sidebar {
            grid-column: span 3;
            background-color: var(--color-background-section);
            padding: var(--space-md);
            border-radius: 8px;
            border: 1px solid var(--color-border-subtle);
            align-self: start;
        }
        .content-area {
            grid-column: span 9;
        }
        h2 {
            font-family: 'Oswald', Impact, sans-serif;
            font-weight: 700;
            color: var(--color-text-heading);
            border-bottom: 1px solid var(--color-border-subtle);
            padding-bottom: var(--space-xs);
            margin-bottom: var(--space-md);
        }
        h3 {
            font-family: 'Oswald', Impact, sans-serif;
            font-weight: 700;
            margin-bottom: var(--space-sm);
        }
        .card-row {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: var(--space-md);
            margin-top: var(--space-lg);
        }
        .action-card {
            display: block;
            background-color: var(--color-background-section);
            border: 1px solid var(--color-border-subtle);
            border-radius: 8px;
            padding: var(--space-md);
            text-decoration: none;
            color: var(--color-text-default);
            transition: border-color 0.2s;
        }
        .action-card:hover {
            border-color: var(--color-accent);
        }
        .action-card h3 {
            color: var(--color-accent);
            margin-bottom: var(--space-xs);
        }
        .featured-heading {
            margin-top: var(--space-xl);
        }
        ul {
            list-style: none;
            padding: 0;
        }
        .player-preview li {
            padding: var(--space-sm);
            border-bottom: 1px solid var(--color-border-subtle);
        }
        .player-preview a {
            color: var(--color-accent);
            text-decoration: none;
            font-weight: bold;
        }
        .player-preview a:hover {
            color: var(--color-accent-hover);
        }
        .position {
            color: var(--color-text-default);
            font-weight: normal;
            margin-left: var(--space-sm);
        }
    `;
}
