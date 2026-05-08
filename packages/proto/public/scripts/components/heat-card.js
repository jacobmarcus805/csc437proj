import { html, css, shadow } from "@unbndl/html";
import reset from "../styles/reset.js";

export class HeatCardElement extends HTMLElement {
    static template = html`
        <template>
            <article>
                <h2>
                    <svg class="icon"><use id="icon-use" /></svg>
                    <slot name="heading"></slot>
                </h2>
                <div class="card-body">
                    <slot name="body"></slot>
                </div>
            </article>
        </template>
    `;

    constructor() {
        super();
        shadow(this)
            .template(HeatCardElement.template)
            .styles(reset.styles, HeatCardElement.styles);
    }

    static observedAttributes = ["icon"];

    attributeChangedCallback(name, _, newValue) {
        if (name === "icon") {
            const use = this.shadowRoot.querySelector("#icon-use");
            if (use) use.setAttribute("href", `/icons/nba.svg#${newValue}`);
        }
    }

    static styles = css`
        :host {
            display: block;
        }
        article {
            background-color: var(--color-background-section);
            border: 1px solid var(--color-border-subtle);
            border-radius: 8px;
            padding: var(--space-md);
            margin-bottom: var(--space-lg);
        }
        h2 {
            font-family: 'Oswald', Impact, sans-serif;
            font-weight: 700;
            color: var(--color-text-heading);
            border-bottom: 1px solid var(--color-border-subtle);
            padding-bottom: var(--space-xs);
            margin-bottom: var(--space-md);
        }
        .icon {
            display: inline;
            height: 2em;
            width: 2em;
            vertical-align: top;
            fill: currentColor;
        }
        a {
            color: var(--color-accent);
            text-decoration: none;
            font-weight: bold;
        }
        a:hover {
            color: var(--color-accent-hover);
        }
        li {
            margin-bottom: var(--space-sm);
        }
    `;
}
