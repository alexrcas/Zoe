import { LitElement, html } from 'lit';

export class ProductList extends LitElement {
    products: any[] = [];

    static properties = {
        products: { type: Array }
    };

    createRenderRoot() {
        return this;
    }

    render() {
        if (!this.products || this.products.length === 0) {
            return html`
                <div class="alert alert-info mx-4">No hay alimentos recientes para mostrar</div>
            `;
        }

        return html`
            <div class="list-group list-group-flush w-100">
                ${this.products.map(product => html`
                    <a href="#" class="list-group-item list-group-item-action d-flex flex-column py-2 px-3"
                       @click=${(e: Event) => {
                e.preventDefault();
                this.dispatchEvent(new CustomEvent('product-selected', {
                    detail: product,
                    bubbles: true,
                    composed: true
                }));
            }}>

                        <!-- Nombre del producto -->
                        <h6 class="fw-normal mb-1" style="font-size: 0.85em;">${product.name}</h6>

                        <!-- Valores nutricionales -->
                        <div class="d-flex justify-content-between text-center"
                             style="font-weight: 500; font-size: 0.85em;">
                            <div>
                                <div>${product.nutriments.kcals}</div>
                                <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">kcals</div>
                            </div>
                            <div>
                                <div>${product.nutriments.proteins}</div>
                                <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">Prot.</div>
                            </div>
                            <div>
                                <div>${product.nutriments.carbs}</div>
                                <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">Carb.</div>
                            </div>
                            <div>
                                <div>${product.nutriments.fats}</div>
                                <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">Grasas</div>
                            </div>
                        </div>
                    </a>
                `)}
            </div>
        `;
    }
}

customElements.define('product-list', ProductList);
