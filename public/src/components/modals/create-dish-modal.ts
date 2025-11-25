import { LitElement, html } from 'lit';

declare const bootstrap: any;

export class CreateDishModal extends LitElement {
    dishName: string;
    bsModal: any;
    modalElement: HTMLElement | null = null;

    static properties = {
        dishName: { type: String }
    };

    constructor() {
        super();
        this.dishName = '';
        this.bsModal = null;
    }

    createRenderRoot() {
        return this;
    }

    firstUpdated() {
        this.modalElement = this.querySelector('#createDishModal');
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
        const name = e.target.value;
        this.dispatchEvent(new CustomEvent('update-name', {
            detail: name,
            bubbles: true,
            composed: true
        }));
    }

    handleCreate() {
        this.dispatchEvent(new CustomEvent('create-dish', {
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
            <div class="modal fade" id="createDishModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content rounded-4 shadow-sm">

                        <div class="modal-header border-0">
                            <h5 class="modal-title fw-semibold">Crear Plato</h5>
                            <button type="button" class="btn-close" @click=${() => this.hide()}></button>
                        </div>

                        <div class="modal-body px-3 pt-2 pb-0 pt-2">

                            <div class="form-floating mb-3 w-100">
                                <input
                                        id="dishName"
                                        class="form-control form-control-sm"
                                        type="text"
                                        .value="${this.dishName}"
                                        @input=${this.handleInput}
                                        placeholder="Nombre del plato"
                                />
                                <label for="dishName">Nombre del plato</label>
                            </div>
                            
                        </div>

                        <div class="modal-footer d-flex justify-content-end border-0 pt-0 pb-1 px-1">
                            <button class="btn btn-outline-primary rounded-pill" @click="${this.handleCreate}">Aceptar</button>
                        </div>

                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('create-dish-modal', CreateDishModal);
