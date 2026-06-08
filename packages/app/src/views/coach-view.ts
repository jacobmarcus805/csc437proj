import { html, css, shadow } from "@unbndl/html";
import { createViewModel } from "@unbndl/view";
import { fromStore, Store } from "@unbndl/store";
import { Coach } from "server/models";
import { Model } from "../model.ts";

export class CoachViewElement extends HTMLElement {
    viewModel: any = createViewModel({
        coaches: undefined as any
    }).with(fromStore<Model>(this) as any, "coaches");

    view = html`
        <div class="page-container">
            <main class="content-area">
                <h2>Coaching Staff</h2>
                ${($: any) => {
                    if (!$.coaches) return html`<p class="loading">Loading...</p>`;
                    if (!$.coaches.length) return html`<p>No coaches listed.</p>`;
                    return html`
                        <ul class="coach-list">
                            ${$.coaches.map(
                                (c: Coach) => html`
                                    <li class="coach-card">
                                        <header class="coach-header">
                                            <img
                                                class="coach-photo"
                                                src=${c.photo || ""}
                                                alt=${c.name}
                                            />
                                            <div class="coach-meta">
                                                <h3>${c.name}</h3>
                                                <p class="role">${c.role}</p>
                                                <p class="stats">
                                                    ${c.yearsActive != null
                                                        ? html`<span>${c.yearsActive} years</span>`
                                                        : ""}
                                                    ${c.championships != null && c.championships > 0
                                                        ? html`<span class="rings">${c.championships} ${c.championships === 1 ? "ring" : "rings"}</span>`
                                                        : ""}
                                                </p>
                                            </div>
                                        </header>
                                        ${c.bio
                                            ? html`<p class="bio">${c.bio}</p>`
                                            : ""}
                                    </li>
                                `
                            )}
                        </ul>
                    `;
                }}
            </main>
        </div>
    `;

    constructor() {
        super();
        shadow(this)
            .styles(CoachViewElement.styles)
            .replace(this.viewModel.render(this.view));
    }

    connectedCallback() {
        Store.dispatch(this, ["coaches/request", {}]);
    }

    static styles = css`
        :host {
            display: block;
        }
        .page-container {
            max-width: 1000px;
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
        .coach-list {
            list-style: none;
            padding: 0;
            display: grid;
            grid-template-columns: 1fr;
            gap: var(--space-md);
        }
        .coach-card {
            background-color: var(--color-background-section);
            border: 1px solid var(--color-border-subtle);
            border-radius: 8px;
            padding: var(--space-md);
        }
        .coach-header {
            display: flex;
            align-items: center;
            gap: var(--space-md);
            margin-bottom: var(--space-sm);
        }
        .coach-photo {
            width: 5rem;
            height: 5rem;
            border-radius: 50%;
            border: 3px solid var(--color-brand-yellow);
            object-fit: cover;
            background-color: var(--color-background-page);
        }
        .coach-meta h3 {
            font-family: 'Oswald', Impact, sans-serif;
            color: var(--color-text-heading);
            margin: 0;
        }
        .role {
            color: var(--color-accent);
            font-weight: bold;
            margin: var(--space-xs) 0;
        }
        .stats {
            display: flex;
            gap: var(--space-md);
            margin: 0;
            color: var(--color-text-default);
            font-size: 0.875rem;
        }
        .rings {
            color: var(--color-brand-yellow);
            font-weight: bold;
        }
        .bio {
            color: var(--color-text-default);
            margin-top: var(--space-sm);
            line-height: 1.5;
        }
        .loading {
            color: var(--color-text-default);
            text-align: center;
            padding: var(--space-xl);
        }
    `;
}
