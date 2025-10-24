import {LitElement, html, css} from 'https://unpkg.com/lit@3.2.0/index.js?module';
import {ApiService} from '../components/ApiService.js';

export class ProductSearch extends LitElement {

    constructor() {
        super();
        this.bsSearchModal = null;
        this.searchValue = '';
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
        this.bsSearchModal.show();
        this.requestUpdate();
        this.searchResult = await this.apiService.search(this.searchValue);
        this.requestUpdate();
    }

    render() {
        return html`
            <div class="row justify-content-center my-2">
                <div class="col-md-6">
                    <div class="search-container">
                        <input type="text" @keydown=${this.handleSearch} class="form-control search-input"
                               value=${this.searchValue} @input="${e => this.searchValue = e.target.value}"
                               placeholder="Busca un alimento...">
                        <i style="font-size: 0.75em" class="fas fa-search search-icon"></i>
                    </div>
                </div>
            </div>


            <div class="modal fade" id="searchModal" tabindex="-1">
                <div class="modal-dialog modal-fullscreen-sm-down">
                    <div class="modal-content">
                        <div class="modal-header pb-2">
                            <h5 class="modal-title">Resultados para "${this.searchValue}"</h5>
                            <button type="button" class="btn-close" @click=${() => this.bsSearchModal.hide()}></button>
                        </div>

                        <div class="modal-body px-0 pt-0">
                            <div class="list-group">

                                ${this.searchResult
                                        ? html`
                                            ${this.searchResult.map(
                                                    product => html`
                                                        <a
                                                                href="#"
                                                                class="list-group-item list-group-item-action d-flex flex-column py-2"
                                                                @click=${e => {
                                                                    e.preventDefault();
                                                                    this.dispatchEvent(
                                                                            new CustomEvent('product-selected', {
                                                                                detail: product,
                                                                                bubbles: true,
                                                                                composed: true
                                                                            })
                                                                    );
                                                                    this.bsSearchModal.hide();
                                                                }}
                                                                aria-current="true"
                                                        >
                                                            <div class="d-flex w-100 justify-content-between align-items-start">
                                                                <div>
                                                                    <h6 style="font-weight: 400; font-size: 0.80em">
                                                                        ${product.name}</h6>
                                                                    <h6 style="font-weight: 300; font-size: 0.75em">
                                                                        ${product.brands}</h6>
                                                                </div>
                                                            </div>

                                                            <table class="meal-values w-100">
                                                                <tbody>
                                                                <tr>
                                                                    <td><strong
                                                                            style="font-weight: 400">${product.nutriments.kcals}</strong>
                                                                        kcals
                                                                    </td>
                                                                    <td><strong
                                                                            style="font-weight: 400">${product.nutriments.proteins}</strong>
                                                                        Prot.
                                                                    </td>
                                                                    <td><strong
                                                                            style="font-weight: 400">${product.nutriments.carbs}</strong>
                                                                        Carb.
                                                                    </td>
                                                                    <td><strong
                                                                            style="font-weight: 400">${product.nutriments.fats}</strong>
                                                                        Grasas
                                                                    </td>
                                                                </tr>
                                                                </tbody>
                                                            </table>
                                                        </a>
                                                    `
                                            )}
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
