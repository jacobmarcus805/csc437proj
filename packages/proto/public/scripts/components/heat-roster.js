import { html, css, shadow } from "@unbndl/html";
import { createViewModel } from "@unbndl/view";
import { fromAuth } from "@unbndl/auth";

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
    viewModel = createViewModel({
        authenticated: false,
        token: undefined,
        src: undefined
    });

    constructor() {
        super();
        shadow(this).styles(HeatRosterElement.styles);

        this.viewModel
            .with(fromAuth(this), "authenticated", "token");

        this.viewModel.createEffect(($) => {
            if ($.authenticated && $.src) {
                this.hydrate($.src).then((data) => {
                    const view = HeatRosterElement.render(data);
                    shadow(this).replace(view);
                });
            }
        });
    }

    static observedAttributes = ["src"];

    attributeChangedCallback(name, _, newValue) {
        if (name === "src") {
            this.viewModel.set("src", newValue);
        }
    }

    get authorization() {
        const $ = this.viewModel.toObject();
        if ($.authenticated)
            return { Authorization: `Bearer ${$.token}` };
        else return {};
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
        return fetch(src, { headers: this.authorization })
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
