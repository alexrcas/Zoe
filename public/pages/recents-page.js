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
        this.showScanner = false;
        this.group = null;
    }

    createRenderRoot() {
        return this;
    }

    async firstUpdated() {
        const query = window.location.hash.slice(1).split('?')[1];
        this.group = new URLSearchParams(query).get('group');

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
            group: this.group,
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
        await this.dao.saveProduct(entry)
        this.bsModal.hide();
        window.location.hash = '#home';
    }

    handleProductSelected(event) {
        this.selectProduct(event.detail)
    }

    handleProductScanned(event) {
        this.showScanner = false;
        this.selectProduct(event.detail);
        this.requestUpdate();
    }

    enableScanner() {
        this.showScanner = true;
        this.requestUpdate();
    }

    render() {
        return html`
            <div class="container">
                <h5 class="pt-2 pb-0 mb-0">Alimentos recientes</h5>
                <em style="font-weight: 300; font-size: 0.85em">Valores nutricionales por 100 grs. / ml.</em>

                <product-search @product-selected="${this.handleProductSelected}"></product-search>
            </div>

            <div class="container px-0">

                <div class="list-group list-group-flush mt-2">
                    ${this.products.map(
                            product => html`

                                <a href="#" class="list-group-item list-group-item-action d-flex flex-column py-1"
                                   @click=${(e) => {
                                       e.preventDefault();
                                       this.selectProduct(product);
                                   }}
                                   aria-current="true">
                                    <div class="d-flex w-100 justify-content-between align-items-start">
                                        <div>
                                            <h6 style="font-weight: 400; font-size: 0.80em">${product.name}</h6>
                                        </div>
                                    </div>

                                    <table class="meal-values w-100">
                                        <tbody>
                                        <tr>
                                            <td><strong style="font-weight: 400">${product.nutriments.kcals}</strong>
                                                kcals
                                            </td>
                                            <td><strong style="font-weight: 400">${product.nutriments.proteins}</strong>
                                                Prot.
                                            </td>
                                            <td><strong style="font-weight: 400">${product.nutriments.carbs}</strong>
                                                Carb.
                                            </td>
                                            <td><strong style="font-weight: 400">${product.nutriments.fats}</strong>
                                                Grasas
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </a>
                            `
                    )}
                </div>
                <div class="d-flex justify-content-center pt-2 pb-2">
                    <button @click=${this.enableScanner} class="btn btn-primary">
                        Escanear <i class="fa-solid fa-barcode"></i>
                    </button>
                </div>

                ${this.showScanner
                        ? html`
                            <div class="overlay">
                                <scan-component @product-scanned=${this.handleProductScanned}></scan-component>
                            </div>
                        `
                        : ''
                }

            </div>


            <div class="modal fade" id="recentsModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Añadir</h5>
                            <button type="button" class="btn-close" @click=${() => this.bsModal.hide()}></button>
                        </div>

                        <div class="modal-body px-3 pb-0 pt-1">

                            <a class="list-group-item list-group-item-action d-flex flex-column py-2" @click=${(e) => {
                                e.preventDefault()
                            }}
                               aria-current="true">
                                <div class="d-flex w-100 justify-content-between align-items-start">
                                    <div>
                                        <h6 style="font-weight: 400; font-size: 0.80em">
                                            ${this.selectedProduct.name}</h6>
                                    </div>
                                </div>

                                <table class="meal-values w-100">
                                    <tbody>
                                    <tr>
                                        <td><strong style="font-weight: 400">${this.displayValues.kcals}</strong> kcals
                                        </td>
                                        <td><strong style="font-weight: 400">${this.displayValues.proteins}</strong>
                                            Prot.
                                        </td>
                                        <td><strong style="font-weight: 400">${this.displayValues.carbs}</strong> Carb.
                                        </td>
                                        <td><strong style="font-weight: 400">${this.displayValues.fats}</strong> Grasas
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </a>

                            <div class="d-flex justify-content-center pt-1">
                                <div class="input-group input-group-sm pb-2" style="width: 35%">
                                    <input class="form-control" type="number" inputmode="numeric" pattern="[0-9]*"
                                           placeholder="Cantidad en gramos"
                                           value=${this.grams} @input=${e => {
                                        this.updateValues(e.target.value)
                                    }}/>
                                    <span class="input-group-text" id="basic-addon2">grs.</span>
                                </div>
                            </div>


                        </div>

                        <div class="modal-footer">
                            <button class="btn btn-success" @click=${() => this.addEntry('Desayuno')}>Añadir</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }


}

customElements.define('recents-page', RecentsPage);
