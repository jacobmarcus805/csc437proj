import { html, css, shadow } from "@unbndl/html";

export class PlayoffGameViewElement extends HTMLElement {
    static template = html`
        <template>
            <div class="page-container">
                <aside class="sidebar">
                    <h3>Series Info</h3>
                    <ul>
                        <li>Format: Best of 7</li>
                        <li>Stakes: Elimination</li>
                    </ul>
                </aside>

                <main class="content-area">
                    <heat-card>
                        <span slot="heading">Playoff Matchup: Game 1</span>
                        <p slot="body">
                            Eastern Conference Finals — a high-stakes elimination game.
                        </p>
                    </heat-card>
                </main>
            </div>
        </template>
    `;

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
        }
        .content-area {
            grid-column: span 9;
        }
        h3 {
            font-family: 'Oswald', Impact, sans-serif;
            font-weight: 700;
            margin-bottom: var(--space-sm);
        }
        ul {
            list-style: none;
            padding: 0;
        }
        li {
            margin-bottom: var(--space-sm);
        }
    `;

    constructor() {
        super();
        shadow(this)
            .template(PlayoffGameViewElement.template)
            .styles(PlayoffGameViewElement.styles);
    }
}
