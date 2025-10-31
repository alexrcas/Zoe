import {LitElement, html, css} from 'https://unpkg.com/lit@3.2.0/index.js?module';
import {ApiService} from '../components/ApiService.js';

export class ProductSearch extends LitElement {

    constructor() {
        super();
        this.bsSearchModal = null;
        this.searchValue = '';
        this.searchText = '';
        this.searchResult = null;
        this.apiService = new ApiService();
    }

    async firstUpdated() {
        this.modalElement = this.querySelector('#searchModal');
        this.bsSearchModal = new bootstrap.Modal(this.modalElement, {backdrop: 'static'});
        this.requestUpdate();
    }

    createRenderRoot() {
        return this;
    }

    async handleSearch(e) {
        if (e.key != 'Enter') {
            return;
        }
        this.searchText = this.searchValue;
        this.searchValue = '';
        document.querySelector('#search-input').value = '';
        this.bsSearchModal.show();
        this.requestUpdate();
        this.searchResult = await this.apiService.search(this.searchText);
        this.requestUpdate();
    }

    render() {
        return html`
            <!-- Barra de búsqueda -->
            <div class="row justify-content-center my-2">
                <div class="col-12 px-3">
                    <div class="position-relative">
                        <input type="text"
                               id="search-input"
                               @keyup=${this.handleSearch}
                               class="form-control rounded-pill px-4"
                               .value=${this.searchValue}
                               @input="${e => this.searchValue = e.target.value}"
                               placeholder="Busca un alimento...">
                        <i class="fas fa-search position-absolute end-3 top-50 translate-middle-y text-muted"
                           style="font-size: 0.75em; padding-left: 0.75em"></i>
                    </div>
                </div>
            </div>

            <!-- Modal de resultados -->
            <div class="modal fade" id="searchModal" tabindex="-1">
                <div class="modal-dialog modal-fullscreen-sm-down">
                    <div class="modal-content rounded-4 shadow-sm">

                        <!-- Header -->
                        <div class="modal-header pb-2 border-0">
                            <h5 class="modal-title fw-semibold" style="font-size: 1em;">Resultados para
                                    "${this.searchText}"</h5>
                            <button type="button" class="btn-close" @click=${() => this.bsSearchModal.hide()}></button>
                        </div>

                        <!-- Body -->
                        <div class="modal-body px-0 pt-0">

                            <div class="list-group">

                                ${this.searchResult
                                        ? html`
                                            ${this.searchResult.map(product => html`
                                                <a href="#"
                                                   class="list-group-item list-group-item-action d-flex flex-column py-2"
                                                   @click=${e => {
                                                       e.preventDefault();
                                                       this.dispatchEvent(new CustomEvent('product-selected', {
                                                           detail: product,
                                                           bubbles: true,
                                                           composed: true
                                                       }));
                                                       this.bsSearchModal.hide();
                                                   }}>

                                                    <!-- Nombre y marca -->
                                                    <div class="d-flex w-100 justify-content-between align-items-start mb-1">
                                                        <div>
                                                            <h6 class="fw-normal mb-0" style="font-size: 0.85em;">
                                                                ${product.name}</h6>
                                                            <h6 class="fw-light text-muted mb-0"
                                                                style="font-size: 0.75em;">${product.brands}</h6>
                                                        </div>
                                                    </div>

                                                    <!-- Valores y labels en columnas, labels debajo de números -->
                                                    <div class="d-flex justify-content-between text-center"
                                                         style="font-weight: 500; font-size: 0.85em;">
                                                        <div>
                                                            <div>${product.nutriments.kcals}</div>
                                                            <div class="text-muted"
                                                                 style="font-weight: 400; font-size: 0.75em;">kcals
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div>${product.nutriments.proteins}</div>
                                                            <div class="text-muted"
                                                                 style="font-weight: 400; font-size: 0.75em;">Prot.
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div>${product.nutriments.carbs}</div>
                                                            <div class="text-muted"
                                                                 style="font-weight: 400; font-size: 0.75em;">Carb.
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div>${product.nutriments.fats}</div>
                                                            <div class="text-muted"
                                                                 style="font-weight: 400; font-size: 0.75em;">Grasas
                                                            </div>
                                                        </div>
                                                    </div>

                                                </a>
                                            `)}
                                        `
                                        : html`
                                            <div class="d-flex justify-content-center align-items-center py-5">
                                                <div class="spinner-border text-primary" role="status">
                                                    <span class="visually-hidden">Cargando...</span>
                                                </div>
                                            </div>
                                        `}
                            </div>

                        </div>

                    </div>
                </div>
            </div>

        `;
    }

}

customElements.define('product-search', ProductSearch);
