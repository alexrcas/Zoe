import { LitElement, html } from 'lit';
import {Dao, Dish} from '../components/Dao';

declare const bootstrap: any;


export class DishesPage extends LitElement {

    dao: Dao;
    bsModal: any;
    modalElement: HTMLElement | null = null;

    constructor() {
        super();
        this.dao = Dao.getInstance();
        this.bsModal = null;
    }

    createRenderRoot() {
        return this;
    }

    async firstUpdated() {
        this.modalElement = this.querySelector('#createDishModal');
        if (this.modalElement) {
            this.bsModal = new bootstrap.Modal(this.modalElement, { backdrop: 'static' });
        }
    }


    handleOpenModal() {
        this.bsModal.show();
        this.requestUpdate();
    }


    async createDish() {
        const dish: Dish = {
            ingredients: [],
            name: 'bowl queso fresco y avena',
            nutriments: {
                kcals: 70,
                proteins: 20,
                carbs: 10,
                fats: 5
            }
        }

        const id = await this.dao.saveDish(dish);
        console.log(id)
        this.bsModal.hide();
        window.location.hash = `#elaborate?id=${id}`;
    }



    render() {
        return html`
            <div class="container mt-2 px-2">
                <button class="btn btn-primary" @click=${(e: Event) => { e.preventDefault(); this.handleOpenModal()}}>
                    Crear plato
                </button>
            </div>


            
            <div class="modal fade" id="createDishModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content rounded-4 shadow-sm">

                        <div class="modal-header border-0">
                            <h5 class="modal-title fw-semibold">Crear Plato</h5>
                            <button type="button" class="btn-close" @click=${() => this.bsModal.hide()}></button>
                        </div>

                        <div class="modal-body px-3 pt-2 pb-0 pt-2">

                            <div class="form-floating mb-3 w-100">
                                <input
                                        id="dishName"
                                        class="form-control form-control-sm"
                                        placeholder="Nombre del plato"
                                />
                                <label for="fats">Nombre del plato</label>
                            </div>
                            
                        </div>

                        <div class="modal-footer d-flex justify-content-end border-0 pt-0 pb-1 px-1">
                            <button class="btn btn-outline-primary rounded-pill" @click="${this.createDish}">Aceptar</button>
                        </div>

                    </div>
                </div>
            </div>
        `
    }
}

customElements.define('dishes-page', DishesPage);
