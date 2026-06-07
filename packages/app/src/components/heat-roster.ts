import { html, css, shadow } from "@unbndl/html";
import { createViewModel } from "@unbndl/view";
import { fromAuth } from "@unbndl/auth";

interface RosterItem {
    label: string;
    href: string;
}

interface RosterCard {
    heading: string;
    icon: string;
    items: RosterItem[];
}

interface RosterData {
    cards: RosterCard[];
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

export class HeatRosterElement extends HTMLElement {
    viewModel = createViewModel({
        authenticated: false,
        token: undefined as string | undefined,
        src: undefined as string | undefined
    });

    constructor() {
        super();
        shadow(this).styles(HeatRosterElement.styles);

        this.viewModel.with(fromAuth(this), "authenticated", "token");

        this.viewModel.createEffect(($: any) => {
            if ($.authenticated && $.src) {
                this.hydrate($.src).then((data: RosterData | undefined) => {
                    if (!data) return;
                    const view = HeatRosterElement.render(data);
                    shadow(this).replace(view);
                });
            }
        });
    }

    static observedAttributes = ["src"];

    attributeChangedCallback(name: string, _: string, newValue: string) {
        if (name === "src") {
            this.viewModel.set("src", newValue);
        }
    }

    get authorization() {
        const $ = this.viewModel.toObject() as any;
        if ($.authenticated)
            return { Authorization: `Bearer ${$.token}` };
        else return {};
    }

    static render(data: RosterData) {
        const cards = data?.cards || [];
        return html`<div>${cards.map(renderCard)}</div>`;
    }

    hydrate(src: string): Promise<RosterData | undefined> {
        return fetch(src, { headers: this.authorization })
            .then((response) => {
                if (response.status !== 200)
                    throw `HTTP Status ${response.status}`;
                return response.json() as Promise<RosterData>;
            })
            .catch((error) => {
                console.log(`Could not fetch ${src}:`, error);
                return undefined;
            });
    }

    static styles = css`
        :host {
            display: contents;
        }
    `;
}
