import { html, css, shadow } from "@unbndl/html";
import { createViewModel } from "@unbndl/view";
import { fromStore, Store } from "@unbndl/store";
import { BrowserHistory } from "@unbndl/switch";
import { Player } from "server/models";
import { Model } from "../model.ts";

type Mode = "edit" | "new";

export class PlayerEditViewElement extends HTMLElement {
    static get observedAttributes() {
        return ["player-id", "mode"];
    }

    viewModel: any = createViewModel({
        playerId: undefined as string | undefined,
        mode: "edit" as Mode,
        player: undefined as Player | undefined
    }).with(fromStore<Model>(this) as any, "player");

    view = html`
        <div class="page-container">
            <main class="content-area">
                <h2>${($: any) => ($.mode === "new" ? "New Player" : "Edit Player")}</h2>
                <form class="player-form">
                    <label>
                        <span>Name</span>
                        <input name="name" required value=${($: any) =>
                            $.mode === "new" ? "" : $.player?.name || ""} />
                    </label>
                    <label>
                        <span>Jersey #</span>
                        <input type="number" name="jersey" required value=${($: any) =>
                            $.mode === "new" ? "" : $.player?.jersey ?? ""} />
                    </label>
                    <label>
                        <span>Position</span>
                        <input name="position" required value=${($: any) =>
                            $.mode === "new" ? "" : $.player?.position || ""} />
                    </label>
                    <label>
                        <span>Height</span>
                        <input name="height" required placeholder="6'9&quot;" value=${($: any) =>
                            $.mode === "new" ? "" : $.player?.height || ""} />
                    </label>
                    <label>
                        <span>Weight (lbs)</span>
                        <input type="number" name="weight" value=${($: any) =>
                            $.mode === "new" ? "" : $.player?.weight ?? ""} />
                    </label>
                    <label>
                        <span>PPG</span>
                        <input type="number" step="0.1" name="ppg" value=${($: any) =>
                            $.mode === "new" ? "" : $.player?.ppg ?? ""} />
                    </label>
                    <label>
                        <span>RPG</span>
                        <input type="number" step="0.1" name="rpg" value=${($: any) =>
                            $.mode === "new" ? "" : $.player?.rpg ?? ""} />
                    </label>
                    <label>
                        <span>APG</span>
                        <input type="number" step="0.1" name="apg" value=${($: any) =>
                            $.mode === "new" ? "" : $.player?.apg ?? ""} />
                    </label>
                    <label class="full-width">
                        <span>Bio</span>
                        <textarea name="bio" rows="4">${($: any) =>
                            $.mode === "new" ? "" : $.player?.bio || ""}</textarea>
                    </label>
                    <div class="actions">
                        <button type="submit">Save</button>
                        <a href="/app/players" class="cancel">Cancel</a>
                    </div>
                </form>
            </main>
        </div>
    `;

    constructor() {
        super();
        shadow(this)
            .styles(PlayerEditViewElement.styles)
            .replace(this.viewModel.render(this.view));

        this.shadowRoot?.addEventListener("submit", (ev: Event) => this.submitForm(ev));
    }

    attributeChangedCallback(name: string, _: string, newValue: string) {
        if (name === "player-id") {
            this.viewModel.set("playerId", newValue);
            if (newValue) {
                Store.dispatch(this, ["player/request", { id: newValue }]);
            }
        }
        if (name === "mode") {
            this.viewModel.set("mode", newValue as Mode);
        }
    }

    formDataToJSON(form: HTMLFormElement): Player {
        const inputs = Array.from(form.elements).filter(
            (el) => "name" in el && (el as any).name
        ) as Array<HTMLInputElement | HTMLTextAreaElement>;

        const obj: any = {};
        inputs.forEach((el) => {
            const name = el.name;
            const value = el.value;
            if (value === "") return;
            // Coerce numeric fields
            if (["jersey", "weight", "ppg", "rpg", "apg"].includes(name)) {
                obj[name] = Number(value);
            } else {
                obj[name] = value;
            }
        });
        return obj as Player;
    }

    submitForm(ev: Event) {
        ev.preventDefault();
        const form = ev.target as HTMLFormElement;
        const player = this.formDataToJSON(form);
        const mode = this.viewModel.toObject().mode;
        const playerId = this.viewModel.toObject().playerId;

        if (mode === "new") {
            Store.dispatch(this, [
                "player/create",
                { player },
                {
                    onSuccess: () =>
                        BrowserHistory.dispatch(this, "history/navigate", {
                            href: "/app/players"
                        }),
                    onFailure: (err: Error) => console.log("Create error:", err)
                }
            ]);
        } else if (playerId) {
            Store.dispatch(this, [
                "player/save",
                { id: playerId, player },
                {
                    onSuccess: () =>
                        BrowserHistory.dispatch(this, "history/navigate", {
                            href: "/app/players"
                        }),
                    onFailure: (err: Error) => console.log("Save error:", err)
                }
            ]);
        }
    }

    static styles = css`
        :host {
            display: block;
        }
        .page-container {
            max-width: 800px;
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
        .player-form {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--space-md);
            background-color: var(--color-background-section);
            padding: var(--space-lg);
            border-radius: 8px;
            border: 1px solid var(--color-border-subtle);
        }
        label {
            display: flex;
            flex-direction: column;
            gap: var(--space-xs);
            color: var(--color-text-default);
        }
        .full-width {
            grid-column: span 2;
        }
        input, textarea {
            padding: var(--space-xs) var(--space-sm);
            border: 1px solid var(--color-border-subtle);
            border-radius: 4px;
            background-color: var(--color-background-page);
            color: var(--color-text-default);
            font-size: 1rem;
            font-family: inherit;
        }
        .actions {
            grid-column: span 2;
            display: flex;
            gap: var(--space-md);
            align-items: center;
            margin-top: var(--space-md);
        }
        button {
            background-color: var(--color-brand-yellow);
            color: var(--color-brand-red);
            border: none;
            padding: var(--space-sm) var(--space-lg);
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            font-size: 1rem;
        }
        button:hover {
            background-color: var(--color-white);
        }
        .cancel {
            color: var(--color-accent);
            text-decoration: none;
            font-weight: bold;
        }
        .cancel:hover {
            color: var(--color-accent-hover);
        }
    `;
}
