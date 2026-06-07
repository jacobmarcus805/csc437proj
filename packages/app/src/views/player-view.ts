import { html, css, shadow } from "@unbndl/html";

export class PlayerViewElement extends HTMLElement {
    static template = html`
        <template>
            <div class="page-container">
                <aside class="sidebar">
                    <h3>Player Stats</h3>
                    <ul>
                        <li>Position: Center</li>
                        <li>Height: 6'9"</li>
                        <li>PPG: 19.3</li>
                        <li>RPG: 10.4</li>
                    </ul>
                </aside>

                <main class="content-area">
                    <heat-card icon="icon-jersey">
                        <span slot="heading">Bam Adebayo (#13)</span>
                        <p slot="body">
                            Bam Adebayo is a core player for the Miami Heat, known for his
                            elite defense and playmaking ability.
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
            .template(PlayerViewElement.template)
            .styles(PlayerViewElement.styles);
    }
}
