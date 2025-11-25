import { LitElement, html } from 'lit';

declare const bootstrap: any;

interface DisplayValues {
    kcals: number;
    proteins: number;
    carbs: number;
    fats: number;
}

export class SelectIngredientModal extends LitElement {
    selectedProduct: any;
    grams: number;
    displayValues: DisplayValues;
    bsModal: any;
    modalElement: HTMLElement | null = null;

    static properties = {
        selectedProduct: { type: Object },
        grams: { type: Number },
        displayValues: { type: Object }
    };

    constructor() {
        super();
        this.selectedProduct = null;
        this.grams = 100;
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
        this.modalElement = this.querySelector('#recentsModal');
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

    handleAdd() {
        this.dispatchEvent(new CustomEvent('add-entry', {
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
            <div class="modal fade" id="recentsModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content rounded-4 shadow-sm">

                        <div class="modal-header border-0 pb-2">
                            <h5 class="modal-title fw-semibold">Añadir</h5>
                            <button type="button" class="btn-close" @click=${() => this.hide()}></button>
                        </div>

                        <div class="modal-body px-0 pt-2 pb-0">

                            ${this.selectedProduct ? html`
                                <div class="list-group list-group-flush">
                                    <a class="list-group-item list-group-item-action d-flex flex-column py-2 px-3"
                                       @click=${(e: Event) => e.preventDefault()}>

                                        <h6 class="fw-normal mb-1" style="font-size: 0.85em;">
                                            ${this.selectedProduct.name}</h6>

                                        <div class="d-flex justify-content-between text-center"
                                             style="font-weight: 500; font-size: 0.85em;">
                                            <div>
                                                <div>${this.displayValues.kcals}</div>
                                                <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">
                                                    kcals
                                                </div>
                                            </div>
                                            <div>
                                                <div>${this.displayValues.proteins}</div>
                                                <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">
                                                    Prot.
                                                </div>
                                            </div>
                                            <div>
                                                <div>${this.displayValues.carbs}</div>
                                                <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">
                                                    Carb.
                                                </div>
                                            </div>
                                            <div>
                                                <div>${this.displayValues.fats}</div>
                                                <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">
                                                    Grasas
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </div>

                                <!-- Input gramos -->
                                <div class="d-flex justify-content-center pt-2 pb-2">
                                    <div class="input-group input-group-sm" style="width: 40%">
                                        <input class="form-control rounded-start" type="number" inputmode="numeric"
                                               pattern="[0-9]*"
                                               placeholder="Cantidad en gramos" .value=${this.grams}
                                               @input=${this.handleInput}>
                                        <span class="input-group-text rounded-end">g.</span>
                                    </div>
                                </div>

                                <!-- Botón añadir -->
                                <div class="modal-footer d-flex justify-content-end border-0 pt-0">
                                    <button class="btn btn-outline-primary rounded-pill" @click=${this.handleAdd}>
                                        Añadir
                                    </button>
                                </div>

                            ` : html`
                                <div class="alert alert-info py-2 my-2 mx-3" style="font-size: 0.8em;">No hemos
                                    encontrado información sobre este producto
                                </div>
                            `}

                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('select-ingredient-modal', SelectIngredientModal);
