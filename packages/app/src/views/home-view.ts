import { html, css, shadow } from "@unbndl/html";
import { createViewModel } from "@unbndl/view";
import { fromStore, Store } from "@unbndl/store";
import { Model } from "../model.ts";

interface RosterItem {
    label: string;
    href: string;
}

interface RosterCard {
    heading: string;
    icon: string;
    items: RosterItem[];
}

function renderCard(card: RosterCard) {
    const { heading, icon, items } = card;
    return html`
        <heat-card icon=${icon}>
            <span slot="heading">${heading}</span>
            <ul slot="body">
                ${items.map(
                    (item) => html`<li><a href=${item.href}>${item.label}</a></li>`
                )}
            </ul>
        </heat-card>
    `;
}

export class HomeViewElement extends HTMLElement {
    viewModel: any = createViewModel({
        roster: undefined as any
    }).with(fromStore<Model>(this) as any, "roster");

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
                ${($: any) =>
                    $.roster?.cards
                        ? $.roster.cards.map(renderCard)
                        : html`<p>Loading...</p>`}
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
        // Dispatch the team/request message to load roster from API
        Store.dispatch(this, ["team/request", {}]);
    }

    dispatch(message: any) {
        Store.dispatch(this, message);
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
}
