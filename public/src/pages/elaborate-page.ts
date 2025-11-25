import { LitElement, html } from 'lit';
import {Dao, Dish, Ingredient} from '../components/Dao';

declare const bootstrap: any;

interface DisplayValues {
    grams: number;
    kcals: number;
    proteins: number;
    carbs: number;
    fats: number;
}


export class ElaboratePage extends LitElement {

    dao: Dao;
    dish: Dish | null;
    displayValues: DisplayValues;
    selectedIngredient: Ingredient | null;
    bsModal: any;
    modalElement: HTMLElement | null = null;
    grams: number | null;

    static properties = {
        dish: { type: Object},
        selectedEntry: { type: Object },
        grams: { type: Number },
        displayValues: { type: Object }
    }

    constructor() {
        super();
        this.dao = Dao.getInstance();
        this.dish = null;
        this.displayValues = {
            grams: 0,
            kcals: 0,
            proteins: 0,
            carbs: 0,
            fats: 0
        };
        this.selectedIngredient = null;
        this.bsModal = null;
        this.grams = null;
    }

    createRenderRoot() {
        return this;
    }

    async firstUpdated() {
        const query = window.location.hash.slice(1).split('?')[1];
        if (!query) {
            return;
        }

        const id: number = parseInt(new URLSearchParams(query).get('id')!);
        this.dish = await this.dao.getDish(id);

        this.modalElement = this.querySelector('#entryModal');
        if (this.modalElement) {
            this.bsModal = new bootstrap.Modal(this.modalElement, { backdrop: 'static' });
        }
    }


    selectIngredient(ingredient: Ingredient) {
        this.selectedIngredient = ingredient;
        this.grams = this.selectedIngredient.grams;
        this.displayValues = {
            kcals: this.selectedIngredient.nutriments.kcals,
            proteins: this.selectedIngredient.nutriments.proteins,
            carbs: this.selectedIngredient.nutriments.carbs,
            fats: this.selectedIngredient.nutriments.carbs,
            grams: this.selectedIngredient.grams
        }
        this.bsModal.show();
        this.requestUpdate();
    }


    updateValues(grams: string) {

        if (!grams) {
            return;
        }

        if (!this.selectedIngredient) {
            return;
        }

        this.grams = parseFloat(grams);
        const factor = this.grams / 100;
        this.displayValues = {
            kcals: Number((this.selectedIngredient.product.nutriments.kcals * factor).toFixed(0)),
            proteins: Number((this.selectedIngredient.product.nutriments.proteins * factor).toFixed(1)),
            carbs: Number((this.selectedIngredient.product.nutriments.carbs * factor).toFixed(1)),
            fats: Number((this.selectedIngredient.product.nutriments.fats * factor).toFixed(1)),
            grams: this.grams
        };

        this.requestUpdate();
    }


    async deleteIngredient() {
        if (!this.dish) {
            return;
        }

        if (!this.selectedIngredient) {
            return;
        }

        this.dish.ingredients = this.dish.ingredients
            .filter(ingr => ingr.product.code != this.selectedIngredient!.product.code)

        await this.dao.saveOrUpdateDish(this.dish);
        this.updateDish();

        this.bsModal.hide();
        this.requestUpdate();
    }


    updateDish() {

        if (!this.dish) {
            return;
        }

        this.dish.nutriments.kcals = 0;
        this.dish.nutriments.proteins = 0;
        this.dish.nutriments.carbs = 0;
        this.dish.nutriments.fats = 0;
        this.dish.ingredients.forEach(ingr => {

            // @ts-ignore
            this.dish.nutriments.kcals += ingr.nutriments.kcals;
            // @ts-ignore
            this.dish.nutriments.carbs += ingr.nutriments.carbs;
            // @ts-ignore
            this.dish.nutriments.proteins += ingr.nutriments.proteins;
            // @ts-ignore
            this.dish.nutriments.fats += ingr.nutriments.fats;
        });

        this.dish.nutriments.kcals = Number(this.dish.nutriments.kcals.toFixed(2));
        this.dish.nutriments.proteins = Number(this.dish.nutriments.proteins.toFixed(2));
        this.dish.nutriments.carbs = Number(this.dish.nutriments.carbs.toFixed(2));
        this.dish.nutriments.fats = Number(this.dish.nutriments.fats.toFixed(2));

    }




    render() {
        return html`
            <div class="container py-3" style="max-width: 420px;">
                <h6 class="text-center fw-semibold mb-3 text-secondary">Crear plato</h6>
            </div>
            
            
            <div class="container">
                <div class="form-floating mb-3 w-100">
                    <input
                            id="dishName"
                            class="form-control form-control-sm"
                            type="text"
                            .value="${this.dish?.name}"
                            @input=${e => {
                                if (!this.dish) { return; }
                                this.dish.name = e.target.value}
                            }
                            placeholder="Nombre del plato"
                    />
                    <label for="proteins">Nombre del plato</label>
                </div>
            </div>



            <div class="accordion accordion-flush pt-2" id="accordionFlushSummary">
                <div class="accordion-item">
                    <!-- Header del acordeón -->
                    <h2 class="accordion-header">
                        <div class="px-3 py-1 fs-6">
                            <div class="w-100 d-flex flex-column">
                                <!-- Título Total -->
                                <h6 class="my-2 fw-normal mb-2" style="font-size: 0.9em;">Total</h6>
                                <!-- Valores y labels en columnas -->
                                <div class="d-flex justify-content-between text-center" style="font-weight: 500; font-size: 0.85em;">
                                    <div>
                                        <div>${this.dish?.nutriments.kcals}</div>
                                        <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">kcals</div>
                                    </div>
                                    <div>
                                        <div>${this.dish?.nutriments.proteins}</div>
                                        <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">Prot.</div>
                                    </div>
                                    <div>
                                        <div>${this.dish?.nutriments.carbs}</div>
                                        <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">Carb.</div>
                                    </div>
                                    <div>
                                        <div>${this.dish?.nutriments.fats}</div>
                                        <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">Grasas
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </button>
                    </h2>
                    
                    <!-- Body del acordeón -->
                    <div id="flush-collapseSummary" class="accordion-collapse collapse show"
                         data-bs-parent="#accordionFlushSummary">
                        <div class="accordion-body px-0" style="background-color: rgba(var(--bs-light-rgb), var(--bs-bg-opacity))">

                            <div class="list-group list-group-flush shadow-sm rounded-3 bg-white striped-list">
                                ${this.dish?.ingredients.map((ingredient: Ingredient) => html`
          <a href="#" class="list-group-item list-group-item-action py-2 d-flex flex-column"
             @click=${(e: Event) => { e.preventDefault();  this.selectIngredient(ingredient)}}>

            <div class="d-flex w-100 justify-content-between align-items-center mb-1">
              <h6 style="font-weight: 400; font-size: 0.85em;">${ingredient.product.name}</h6>
              <small class="opacity-50 text-nowrap">${ingredient.grams} g.</small>
            </div>

            <!-- Valores y labels alineados en columnas -->
            <div class="d-flex justify-content-between text-center" style="font-weight: 500; font-size: 0.85em;">
              <div>
                <div>${ingredient.nutriments.kcals}</div>
                <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">kcals</div>
              </div>
              <div>
                <div>${ingredient.nutriments.proteins}</div>
                <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">Prot.</div>
              </div>
              <div>
                <div>${ingredient.nutriments.carbs}</div>
                <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">Carb.</div>
              </div>
              <div>
                <div>${ingredient.nutriments.fats}</div>
                <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">Grasas</div>
              </div>
            </div>

          </a>
        `)}
                            
                        </div>
                    </div>
                </div>
            </div>
                
        
    </div>


    <div class="d-flex justify-content-center py-2">
        <a class="text-decoration-underline text-muted" style="font-weight: 300; font-size: 0.8em;" href="#select-ingredient?id=${this.dish?.id}">
            Añadir ingrediente
        </a>
    </div>




            <!-- Modal de edición de entrada -->
            <div class="modal fade" id="entryModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content rounded-4 shadow-sm">

                        <div class="modal-header border-0">
                            <h5 class="modal-title fw-semibold">Editar</h5>
                            <button type="button" class="btn-close" @click=${() => this.bsModal.hide()}></button>
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
                                           value=${this.grams} @input=${(e: any) => this.updateValues(e.target.value)}/>
                                    <span class="input-group-text">g.</span>
                                </div>
                            </div>
                        </div>

                        <div class="modal-footer d-flex justify-content-between border-0 pt-0 pb-1 px-1">
                            <button class="btn btn-outline-danger rounded-pill" @click=${this.deleteIngredient}>Eliminar</button>
                            <button class="btn btn-outline-primary rounded-pill" @click=${this.updateIngredient}>Aceptar</button>
                        </div>

                    </div>
                </div>
            </div>
            
    `}
}

customElements.define('elaborate-page', ElaboratePage);
