import {LitElement, html, css} from 'https://unpkg.com/lit@3.2.0/index.js?module';
import {Dao} from '../components/Dao.js';
import '../components/product-search.js';
import '../components/scan-component.js';


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
        if (this.selectedProduct) {
            this.updateValues(this.grams);
        }
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
            },
            nutriments_per100g: {
                kcals: this.selectedProduct.nutriments.kcals,
                proteins: this.selectedProduct.nutriments.proteins,
                carbs: this.selectedProduct.nutriments.carbs,
                fats: this.selectedProduct.nutriments.fats
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
            <div class="container px-3">

                <!-- Búsqueda -->
                <product-search @product-selected="${this.handleProductSelected}"></product-search>

                <!-- Botón escáner -->
                <div class="d-flex justify-content-center pt-1 pb-2">
                    <button @click=${this.enableScanner} class="btn btn-outline-primary rounded-pill btn-borderless">
                        Escanea un código de barras <i class="fa-solid fa-barcode"></i>
                    </button>
                </div>
            </div>

            <div class="px-3">
                <h5 class="pt-2 pb-0 mb-0" style="font-weight: 500; font-size: 0.9em">Alimentos recientes</h5>
                <em class="d-block mb-2" style="font-weight: 300; font-size: 0.85em;">Valores nutricionales por 100 g. / ml.</em>
            </div>
                <!-- Lista de productos -->
                <div class="list-group list-group-flush">
                    ${this.products.map(product => html`
                        <a href="#" class="list-group-item list-group-item-action d-flex flex-column py-2 px-3"
                           @click=${(e) => {
                               e.preventDefault();
                               this.selectProduct(product);
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

                <!-- Scanner overlay -->
                ${this.showScanner ? html`
                    <div class="overlay">
                        <scan-component @product-scanned=${this.handleProductScanned}></scan-component>
                    </div>
                ` : ''}

            </div>

            <!-- Modal de añadir producto -->
            <div class="modal fade" id="recentsModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content rounded-4 shadow-sm">

                        <div class="modal-header border-0 pb-2">
                            <h5 class="modal-title fw-semibold">Añadir</h5>
                            <button type="button" class="btn-close" @click=${() => this.bsModal.hide()}></button>
                        </div>

                        <div class="modal-body px-0 pt-2 pb-0">

                            ${this.selectedProduct ? html`
                                <div class="list-group list-group-flush">
                                    <a class="list-group-item list-group-item-action d-flex flex-column py-2 px-3"
                                       @click=${(e) => e.preventDefault()}>

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
                                               placeholder="Cantidad en gramos" value=${this.grams}
                                               @input=${e => this.updateValues(e.target.value)}>
                                        <span class="input-group-text rounded-end">g.</span>
                                    </div>
                                </div>

                                <!-- Botón añadir -->
                                <div class="modal-footer d-flex justify-content-end border-0 pt-0">
                                    <button class="btn btn-outline-primary rounded-pill" @click=${this.addEntry}>
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

customElements.define('recents-page', RecentsPage);
