import { LitElement, html } from 'lit';
import {Dao, Dish} from '../components/Dao';

declare const bootstrap: any;


export class DishesPage extends LitElement {

    dao: Dao;
    bsModal: any;
    modalElement: HTMLElement | null = null;
    dishName: string;
    dishes: Dish[];

    static properties = {
        dishName: { type: String},
        dishesName: { type: Array},
    }

    constructor() {
        super();
        this.dao = Dao.getInstance();
        this.bsModal = null;
        this.dishName = '';
        this.dishes = [];
    }

    createRenderRoot() {
        return this;
    }

    async firstUpdated() {
        this.modalElement = this.querySelector('#createDishModal');
        if (this.modalElement) {
            this.bsModal = new bootstrap.Modal(this.modalElement, { backdrop: 'static' });
            this.bsModal.hide();
        }

        this.dishes = await this.dao.listDishes();
        this.requestUpdate();
    }


    handleOpenModal() {
        this.bsModal.show();
        this.requestUpdate();
    }


    async createDish() {
        const dish: Dish = {
            ingredients: [],
            name: this.dishName,
            nutriments: {
                kcals: 0,
                proteins: 0,
                carbs: 0,
                fats: 0
            }
        }

        const id = await this.dao.saveOrUpdateDish(dish);
        this.bsModal.hide();
        window.location.hash = `#elaborate?id=${id}`;
    }



    render() {
        return html`

            <div class="container pt-3" style="max-width: 420px;">
                <h6 class="text-center fw-semibold mb-3 text-secondary">Mis platos</h6>
            </div>
            
            <div class="list-group list-group-flush shadow-sm rounded-3 bg-white striped-list">
                ${this.dishes.map((dish: Dish) => html`
          <a href="#" class="list-group-item list-group-item-action py-2 d-flex flex-column"
             @click=${(e: Event) => { e.preventDefault();  window.location.hash = `#elaborate?id=${dish.id}`}}>

            <div class="d-flex w-100 justify-content-between align-items-center mb-1">
              <h6 style="font-weight: 400; font-size: 0.85em;">${dish.name}</h6>
            </div>

            <!-- Valores y labels alineados en columnas -->
            <div class="d-flex justify-content-between text-center" style="font-weight: 500; font-size: 0.85em;">
              <div>
                <div>${dish.nutriments.kcals}</div>
                <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">kcals</div>
              </div>
              <div>
                <div>${dish.nutriments.proteins}</div>
                <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">Prot.</div>
              </div>
              <div>
                <div>${dish.nutriments.carbs}</div>
                <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">Carb.</div>
              </div>
              <div>
                <div>${dish.nutriments.fats}</div>
                <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">Grasas</div>
              </div>
            </div>

          </a>
        `)}

            </div>
            
            
            <div class="container mt-2 px-2 pt-2 d-flex justify-content-center">
                <button class="btn btn-primary btn-sm w-50 ms-1 rounded-3 shadow-sm" @click=${(e: Event) => { e.preventDefault(); this.handleOpenModal()}}>
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
                                        type="text"
                                        .value="${this.dishName}"
                                        @input=${e => this.dishName = e.target.value}
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
