import {LitElement, html, css} from 'https://unpkg.com/lit@3.2.0/index.js?module';
import {Dao} from '../components/Dao.js';
import '../components/product-search.js';


export class RecentsPage extends LitElement {

    constructor() {
        super();
        this.dao = new Dao();
        this.products = [];
        this.displayValues = {};
        this.bsModal = null;
        this.grams = 100;
        this.selectedProduct = {};
    }

    createRenderRoot() {
        return this;
    }

    async firstUpdated() {
        this.products = await this.dao.listProducts();
        this.modalElement = this.querySelector('#recentsModal');
        this.bsModal = new bootstrap.Modal(this.modalElement, {backdrop: 'static'});
        this.requestUpdate();
    }

    selectProduct(product) {
        this.selectedProduct = product;
        this.updateValues(this.grams);
        this.requestUpdate();
        this.bsModal.show();
    }


    updateValues(grams) {
        this.grams = grams;
        const factor = this.grams / 100; // factor de escala

        this.displayValues = {
            kcals: (this.selectedProduct.nutriments.kcals * factor).toFixed(1),
            proteins: (this.selectedProduct.nutriments.proteins * factor).toFixed(1),
            carbs: (this.selectedProduct.nutriments.carbs * factor).toFixed(1),
            fats: (this.selectedProduct.nutriments.fats * factor).toFixed(1)
        };

        this.requestUpdate();
    }


    async addEntry() {
        const entry = {
            name: this.selectedProduct.name,
            grams: this.grams,
            code: this.selectedProduct.code,
            nutriments: {
                kcals: this.displayValues.kcals,
                proteins: this.displayValues.proteins,
                carbs: this.displayValues.carbs,
                fats: this.displayValues.fats
            }
        }
        await this.dao.saveEntry(entry);
        this.bsModal.hide();
        window.location.hash = '#home';
    }


    render() {
        return html`
            <div class="container">
                <h5 class="pt-2 pb-0 mb-0">Alimentos recientes</h5>
                <em style="font-weight: 300; font-size: 0.85em">Valores nutricionales por 100 grs. / ml.</em>
                
                <product-search></product-search>
            </div>
            
            <div class="container px-0">

                <div class="list-group mt-2">
                    ${this.products.map(
                            product => html`

                                <a href="#" class="list-group-item list-group-item-action d-flex flex-column py-2" @click=${(e) => { e.preventDefault(); this.selectProduct(product); }}
                                   aria-current="true">
                                    <div class="d-flex w-100 justify-content-between align-items-start">
                                        <div>
                                            <h6 style="font-weight: 400; font-size: 0.80em">${product.name}</h6>
                                        </div>
                                    </div>

                                    <table class="meal-values w-100">
                                        <tbody>
                                        <tr>
                                            <td><strong style="font-weight: 400">${product.nutriments.kcals}</strong> kcals</td>
                                            <td><strong style="font-weight: 400">${product.nutriments.proteins}</strong> Prot.</td>
                                            <td><strong style="font-weight: 400">${product.nutriments.carbs}</strong> Carb.</td>
                                            <td><strong style="font-weight: 400">${product.nutriments.fats}</strong> Grasas</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </a>
                            `
                    )}
                </div>
                <div class="d-flex justify-content-center pt-2 pb-2">
                    <button @click=${() => window.location.hash = '#scan'} class="btn btn-primary">+</button>
                </div>

            </div>


            <div class="modal fade" id="recentsModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Añadir alimento</h5>
                            <button type="button" class="btn-close" @click=${() => this.bsModal.hide()}></button>
                        </div>

                        <div class="modal-body px-2">

                                <a class="list-group-item list-group-item-action d-flex flex-column py-2" @click=${(e) => { e.preventDefault()}}
                                   aria-current="true">
                                    <div class="d-flex w-100 justify-content-between align-items-start">
                                        <div>
                                            <h6 style="font-weight: 400; font-size: 0.80em">${this.selectedProduct.name}</h6>
                                        </div>
                                    </div>
    
                                    <table class="meal-values w-100">
                                        <tbody>
                                        <tr>
                                            <td><strong style="font-weight: 400">${this.displayValues.kcals}</strong> kcals</td>
                                            <td><strong style="font-weight: 400">${this.displayValues.proteins}</strong> Prot.</td>
                                            <td><strong style="font-weight: 400">${this.displayValues.carbs}</strong> Carb.</td>
                                            <td><strong style="font-weight: 400">${this.displayValues.fats}</strong> Grasas</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </a>


                            <input class="mt-2" type="number" inputmode="numeric" pattern="[0-9]*" placeholder="Cantidad en gramos"
                                   value=${this.grams} @input=${e => {
                                this.updateValues(e.target.value)
                            }}/>

                        </div>

                        <div class="modal-footer">
                            <button class="btn btn-success" @click=${() => this.addEntry()}>Añadir</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }


}

customElements.define('recents-page', RecentsPage);
