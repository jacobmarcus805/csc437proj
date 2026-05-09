import { html, css, shadow } from "@unbndl/html";

function renderCard(card) {
    const { heading, icon, items } = card;
    return html`
        <heat-card icon=${icon}>
            <span slot="heading">${heading}</span>
            <ul slot="body">
                ${items.map(item => html`<li><a href=${item.href}>${item.label}</a></li>`)}
            </ul>
        </heat-card>
    `;
}

export class HeatRosterElement extends HTMLElement {
    constructor() {
        super();
        shadow(this).styles(HeatRosterElement.styles);
    }

    static observedAttributes = ["src"];

    attributeChangedCallback(name, _, newValue) {
        if (name === "src") {
            this.hydrate(newValue).then((data) => {
                const view = HeatRosterElement.render(data);
                shadow(this).replace(view);
            });
        }
    }

    static render(data) {
        const cards = data?.cards || [];
        return html`
            <div>
                ${cards.map(renderCard)}
            </div>
        `;
    }

    hydrate(src) {
        return fetch(src)
            .then((response) => {
                if (response.status !== 200)
                    throw `HTTP Status ${response.status}`;
                else return response.json();
            })
            .catch((error) => {
                console.log(`Could not fetch ${src}:`, error);
            });
    }

    static styles = css`
        :host {
            display: contents;
        }
    `;
}
