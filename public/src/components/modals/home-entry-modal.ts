import { LitElement, html } from 'lit';

declare const bootstrap: any;

interface DisplayValues {
    kcals: number;
    proteins: number;
    carbs: number;
    fats: number;
}

export class HomeEntryModal extends LitElement {
    selectedEntry: any;
    grams: number;
    displayValues: DisplayValues;
    bsModal: any;
    modalElement: HTMLElement | null = null;

    static properties = {
        selectedEntry: { type: Object },
        grams: { type: Number },
        displayValues: { type: Object }
    };

    constructor() {
        super();
        this.selectedEntry = null;
        this.grams = 0;
        this.displayValues = {
            kcals: 0,
            proteins: 0,
            carbs: 0,
            fats: 0
        };
        this.bsModal = null;
    }

    createRenderRoot() {
        return this;
    }

    firstUpdated() {
        this.modalElement = this.querySelector('#entryModal');
        if (this.modalElement) {
            this.bsModal = new bootstrap.Modal(this.modalElement, { backdrop: 'static' });
        }
    }

    show() {
        if (this.bsModal) {
            this.bsModal.show();
        }
    }

    hide() {
        if (this.bsModal) {
            this.bsModal.hide();
        }
    }

    handleInput(e: any) {
        const grams = e.target.value;
        this.dispatchEvent(new CustomEvent('update-values', {
            detail: grams,
            bubbles: true,
            composed: true
        }));
    }

    handleDelete() {
        this.dispatchEvent(new CustomEvent('delete-entry', {
            bubbles: true,
            composed: true
        }));
    }

    handleUpdate() {
        this.dispatchEvent(new CustomEvent('update-entry', {
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
            <div class="modal fade" id="entryModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content rounded-4 shadow-sm">

                        <div class="modal-header border-0">
                            <h5 class="modal-title fw-semibold">Editar</h5>
                            <button type="button" class="btn-close" @click=${() => this.hide()}></button>
                        </div>

                        <div class="modal-body px-3 pt-2 pb-0">

                            <h6 class="fw-normal mb-2" style="font-size: 0.85em;">
                                ${this.selectedEntry?.name}
                            </h6>

                            <!-- Valores y labels en columnas, alineados -->
                            <div class="d-flex justify-content-between text-center mb-3" style="font-weight: 500; font-size: 0.85em;">
                                <div>
                                    <div>${this.displayValues?.kcals}</div>
                                    <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">kcals</div>
                                </div>
                                <div>
                                    <div>${this.displayValues?.proteins}</div>
                                    <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">Prot.</div>
                                </div>
                                <div>
                                    <div>${this.displayValues?.carbs}</div>
                                    <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">Carb.</div>
                                </div>
                                <div>
                                    <div>${this.displayValues?.fats}</div>
                                    <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">Grasas</div>
                                </div>
                            </div>

                            <!-- Input gramos -->
                            <div class="d-flex justify-content-center mb-3">
                                <div class="input-group input-group-sm" style="width: 40%;">
                                    <input class="form-control text-center" type="number" inputmode="numeric" pattern="[0-9]*"
                                           placeholder="Cantidad en gramos"
                                           .value=${this.grams} @input=${this.handleInput}/>
                                    <span class="input-group-text">g.</span>
                                </div>
                            </div>
                        </div>

                        <div class="modal-footer d-flex justify-content-between border-0 pt-0 pb-1 px-1">
                            <button class="btn btn-outline-danger rounded-pill" @click=${this.handleDelete}>Eliminar</button>
                            <button class="btn btn-outline-primary rounded-pill" @click=${this.handleUpdate}>Aceptar</button>
                        </div>

                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('home-entry-modal', HomeEntryModal);
