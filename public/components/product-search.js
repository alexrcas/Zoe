import {LitElement, html, css} from 'https://unpkg.com/lit@3.2.0/index.js?module';

export class ProductSearch extends LitElement {

    constructor() {
        super();
        this.bsSearchModal = null;
        this.searchValue = '';
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
        if (e.key != 'Enter') { return; }
        this.bsSearchModal.show();
        this.requestUpdate();
    }


    render() {
        return html`
            <div class="row justify-content-center my-1">
                <div class="col-md-6">
                    <div class="search-container">
                        <input type="text" @keydown=${this.handleSearch} class="form-control search-input" value=${this.searchValue} @input="${e => this.searchValue = e.target.value}" placeholder="Busca un alimento...">
                        <i style="font-size: 0.75em" class="fas fa-search search-icon"></i>
                    </div>
                </div>
            </div>


            <div class="modal fade" id="searchModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${this.searchValue}</h5>
                            <button type="button" class="btn-close" @click=${() => this.bsSearchModal.hide()}></button>
                        </div>

                        <div class="modal-body">
                        </div>

                        <div class="modal-footer">
                            <button class="btn btn-success">Añadir</button>
                            <button class="btn btn-secondary" @click=${() => {
                                this.bsSearchModal.hide()
                            }}>Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    `;
    }

}

customElements.define('product-search', ProductSearch);
