import { LitElement, html } from 'lit';
import {Dao, Dish} from '../components/Dao';

declare const bootstrap: any;


export class ElaboratePage extends LitElement {

    dao: Dao;

    constructor() {
        super();
        this.dao = Dao.getInstance();
    }

    createRenderRoot() {
        return this;
    }

    async firstUpdated() {
    }



    render() {
        return html`
            <div class="container py-3" style="max-width: 420px;">
                <h6 class="text-center fw-semibold mb-3 text-secondary">Crear plato</h6>
            </div>
            
            
<div class="mx-2">
    
            <div class="form-floating mb-3 w-100">
                <input
                        id="proteins"
                        class="form-control form-control-sm"
                        type="text"
                        pattern="[0-9]*"
                        placeholder="Nombre del plato"
                />
                <label for="proteins">Nombre del plato</label>
            </div>

    
    <div>Lista de ingredientes</div>

    <div class="d-flex justify-content-center py-2">
        <a class="text-decoration-underline text-muted" style="font-weight: 300; font-size: 0.8em;">
            Añadir ingrediente
        </a>
    </div>
    
    <button class="btn btn-primary">Guardar</button>

</div>

        `
    }
}

customElements.define('elaborate-page', ElaboratePage);
