import { html, css, shadow } from "@unbndl/html";
import { createViewModel } from "@unbndl/view";
import { fromStore, Store } from "@unbndl/store";
import { Player } from "server/models";
import { Model } from "../model.ts";

export class PlayersListViewElement extends HTMLElement {
    viewModel: any = createViewModel({
        players: undefined as any
    }).with(fromStore<Model>(this) as any, "players");

    view = html`
        <div class="page-container">
            <main class="content-area">
                <h2>Roster</h2>
                <p><a href="/app/players/new" class="new-link">+ New Player</a></p>
                ${($: any) =>
                    $.players?.length
                        ? html`<ul class="player-list">${$.players.map(
                              (p: Player) => html`
                                  <li>
                                      <a href=${`/app/players/${p._id}/edit`}>
                                          #${p.jersey} ${p.name} - ${p.position}
                                      </a>
                                  </li>
                              `
                          )}</ul>`
                        : html`<p>No players yet. Add one!</p>`}
            </main>
        </div>
    `;

    constructor() {
        super();
        shadow(this)
            .styles(PlayersListViewElement.styles)
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
            max-width: 1200px;
            margin: 0 auto;
            padding: var(--space-lg);
        }
        h2 {
            font-family: 'Oswald', Impact, sans-serif;
            color: var(--color-text-heading);
            border-bottom: 1px solid var(--color-border-subtle);
            padding-bottom: var(--space-xs);
            margin-bottom: var(--space-md);
        }
        .new-link {
            color: var(--color-accent);
            text-decoration: none;
            font-weight: bold;
        }
        .new-link:hover {
            color: var(--color-accent-hover);
        }
        .player-list {
            list-style: none;
            padding: 0;
        }
        .player-list li {
            padding: var(--space-sm) var(--space-md);
            background-color: var(--color-background-section);
            border: 1px solid var(--color-border-subtle);
            border-radius: 8px;
            margin-bottom: var(--space-sm);
        }
        .player-list a {
            color: var(--color-accent);
            text-decoration: none;
            font-weight: bold;
        }
        .player-list a:hover {
            color: var(--color-accent-hover);
        }
    `;
}
