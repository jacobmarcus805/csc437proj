import { html, css, shadow } from "@unbndl/html";

export class SeasonViewElement extends HTMLElement {
    static template = html`
        <template>
            <div class="page-container">
                <aside class="sidebar">
                    <h3>Season Overview</h3>
                    <ul>
                        <li>Status: Active</li>
                        <li>Record: 42-20</li>
                        <li>Standing: 2nd in East</li>
                    </ul>
                </aside>

                <main class="content-area">
                    <heat-card icon="icon-calendar">
                        <span slot="heading">2025-2026 NBA Season</span>
                        <p slot="body">
                            The Miami Heat are looking to secure a top playoff seed and make
                            another deep run in the postseason.
                        </p>
                    </heat-card>

                    <heat-card>
                        <span slot="heading">Season Schedule</span>
                        <ul slot="body">
                            <li><a href="/app/game">October 25, 2025: vs. Lakers</a></li>
                            <li><a href="/app/playoff-game">Post-Season Hub</a></li>
                        </ul>
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
            .template(SeasonViewElement.template)
            .styles(SeasonViewElement.styles);
    }
}
