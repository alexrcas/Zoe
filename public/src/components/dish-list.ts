import { LitElement, html } from 'lit';
import { Dish } from './Dao';

export class DishList extends LitElement {
    dishes: Dish[] = [];

    static properties = {
        dishes: { type: Array }
    };

    createRenderRoot() {
        return this;
    }

    render() {
        if (!this.dishes || this.dishes.length === 0) {
            return html`
                <div class="alert alert-info mx-4">No hay platos recientes para mostrar</div>
            `;
        }

        return html`
            <div class="list-group list-group-flush w-100">
                ${this.dishes.map(dish => html`
                    <a href="#" class="list-group-item list-group-item-action d-flex flex-column py-2 px-3"
                       @click=${(e: Event) => {
                e.preventDefault();
                this.dispatchEvent(new CustomEvent('dish-selected', {
                    detail: dish,
                    bubbles: true,
                    composed: true
                }));
            }}>                  <!-- Nombre del plato -->
                        <h6 class="fw-normal mb-1" style="font-size: 0.85em;">${dish.name}</h6>

                        <!-- Valores nutricionales -->
                        <div class="d-flex justify-content-between text-center"
                             style="font-weight: 500; font-size: 0.85em;">
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
        `;
    }
}

customElements.define('dish-list', DishList);
