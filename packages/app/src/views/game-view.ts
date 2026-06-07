import { html, css, shadow } from "@unbndl/html";

export class GameViewElement extends HTMLElement {
    static template = html`
        <template>
            <div class="page-container">
                <aside class="sidebar">
                    <h3>Game Info</h3>
                    <ul>
                        <li>Date: Oct 25, 2025</li>
                        <li>Time: 7:30 PM EST</li>
                        <li>Location: Kaseya Center</li>
                    </ul>
                </aside>

                <main class="content-area">
                    <heat-card icon="icon-calendar">
                        <span slot="heading">Miami Heat vs. Los Angeles Lakers</span>
                        <p slot="body">
                            This is a highly anticipated cross-conference matchup featuring two championship-contending teams.
                        </p>
                    </heat-card>

                    <heat-card>
                        <span slot="heading">Post-Season Status</span>
                        <p slot="body">
                            Is this a playoff matchup? Check the
                            <a href="/app/playoff-game">Playoff Game Details</a>.
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
            .template(GameViewElement.template)
            .styles(GameViewElement.styles);
    }
}
