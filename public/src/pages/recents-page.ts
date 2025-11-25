import { LitElement, html } from 'lit';
import { Dao, Dish, Entry } from '../components/Dao';
import '../components/product-search';
import '../components/scan-component';
import '../components/product-list';
import '../components/dish-list';
import '../components/modals/recents-product-modal';

declare const bootstrap: any;


interface DisplayValues {
    kcals: number;
    proteins: number;
    carbs: number;
    fats: number;
}

export class RecentsPage extends LitElement {
    dao: Dao;
    products: any[];
    dishes: Dish[];
    displayValues: DisplayValues;
    grams: number;
    selectedProduct: any;
    showScanner: boolean;
    group: string | null;
    modalComponent: any;

    static properties = {
        products: { type: Array },
        dishes: { type: Array },
        displayValues: { type: Object },
        grams: { type: Number },
        selectedProduct: { type: Object },
        showScanner: { type: Boolean },
        group: { type: String }
    };

    constructor() {
        super();
        this.dao = Dao.getInstance();
        this.products = [];
        this.dishes = [];
        this.displayValues = {
            kcals: 0,
            proteins: 0,
            carbs: 0,
            fats: 0
        };
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
        if (query) {
            this.group = new URLSearchParams(query).get('group');
        }

        this.products = await this.dao.listProducts();
        this.dishes = await this.dao.listDishes();
        this.modalComponent = this.querySelector('recents-product-modal');
        this.requestUpdate();
    }

    selectProduct(product: any) {
        this.selectedProduct = product;
        if (this.selectedProduct) {
            this.updateValues(this.grams.toString());
        }
        this.requestUpdate();
        if (this.modalComponent) {
            this.modalComponent.show();
        }
    }


    updateValues(grams: string | number) {
        this.grams = typeof grams === 'string' ? parseFloat(grams) : grams;
        const factor = this.grams / 100;

        this.displayValues = {
            kcals: Number((this.selectedProduct.nutriments.kcals * factor).toFixed(1)),
            proteins: Number((this.selectedProduct.nutriments.proteins * factor).toFixed(1)),
            carbs: Number((this.selectedProduct.nutriments.carbs * factor).toFixed(1)),
            fats: Number((this.selectedProduct.nutriments.fats * factor).toFixed(1))
        };

        this.requestUpdate();
    }


    async addEntry() {
        const entry: Entry = {
            group: this.group || '',
            name: this.selectedProduct.name,
            grams: this.grams,
            code: this.selectedProduct.code,
            nutriments: {
                kcals: this.displayValues.kcals,
                proteins: this.displayValues.proteins,
                carbs: this.displayValues.carbs,
                fats: this.displayValues.fats
            },
            product: this.selectedProduct
        }
        await this.dao.saveEntry(entry);
        await this.dao.saveProduct(this.selectedProduct)
        if (this.modalComponent) {
            this.modalComponent.hide();
        }
        window.location.hash = '#home';
    }

    handleProductSelected(event: CustomEvent) {
        this.selectProduct(event.detail)
    }

    handleProductScanned(event: CustomEvent) {
        this.showScanner = false;
        this.selectProduct(event.detail);
        this.requestUpdate();
    }

    handleDishSelected(event: CustomEvent) {
        // console.log('Dish selected:', event.detail);
    }

    enableScanner() {
        this.showScanner = true;
        this.requestUpdate();
    }

    handleCloseScanner() {
        this.showScanner = false;
        this.requestUpdate();
    }

    handleModalUpdateValues(e: CustomEvent) {
        this.updateValues(e.detail);
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
            
            
            <ul class="nav nav-pills nav-fill mb-3 w-100 bg-light rounded-3 p-1" id="formToggle" role="tablist">
                <li class="nav-item" role="presentation">
                    <button
                            class="nav-link active rounded-3 py-2 small"
                            id="alimentos-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#alimentos"
                            type="button"
                            role="tab"
                            style="font-size: 0.88em; font-weight: 500"
                    >
                        Alimentos
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button
                            class="nav-link rounded-3 py-2 small"
                            id="dishes-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#dishes"
                            type="button"
                            role="tab"
                            style="font-size: 0.88em; font-weight: 500"
                    >
                        Mis Platos
                    </button>
                </li>
            </ul>

            <div class="tab-content w-100" id="formToggleContent">

                <!-- Formulario 1 -->
                <div class="tab-pane fade show active" id="alimentos" role="tabpanel">
                    <div class="d-flex flex-column align-items-center">
                        <div class="px-3 w-100">
                            <h5 class="pt-2 pb-0 mb-0" style="font-weight: 500; font-size: 0.9em">Alimentos recientes</h5>
                            <em class="d-block mb-2" style="font-weight: 300; font-size: 0.85em;">Valores nutricionales por 100 g. / ml.</em>
                        </div>
                        <product-list class="w-100" .products=${this.products} @product-selected=${this.handleProductSelected}></product-list>
                    </div>
                </div>
                
                <!-- Formulario 2 -->
                <div class="tab-pane fade" id="dishes" role="tabpanel">
                    <div class="d-flex flex-column align-items-center">
                        <dish-list class="w-100" .dishes=${this.dishes} @dish-selected=${this.handleDishSelected}></dish-list>
                    </div>
                </div>
                
            </div>

                <!-- Scanner overlay -->
                ${this.showScanner ? html`
                    <div class="overlay">
                        <scan-component @close-scanner="${this.handleCloseScanner}" @product-scanned=${this.handleProductScanned}></scan-component>
                    </div>
                ` : ''}

            </div>

            <!-- Modal de añadir producto -->
            <recents-product-modal
                .selectedProduct=${this.selectedProduct}
                .grams=${this.grams}
                .displayValues=${this.displayValues}
                @update-values=${this.handleModalUpdateValues}
                @add-entry=${this.addEntry}
            ></recents-product-modal>
        `;
    }
}

customElements.define('recents-page', RecentsPage);
