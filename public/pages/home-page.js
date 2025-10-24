import {LitElement, html, css} from 'https://unpkg.com/lit@3.2.0/index.js?module';
import {Dao} from '../components/Dao.js';
import { SummaryComponent } from '../components/summary-component.js';
import { JournalService } from "../components/JournalService.js";

export class HomePage extends LitElement {

    constructor() {
        super();
        this.dao = new Dao();
        this.journalService = new JournalService();
        this.journal = [];
        this.selectedEntry = null;
        this.bsModal = null;
        this.grams = null;
        this.displayValues = {};
    }

    createRenderRoot() {
        return this;
    }

    async firstUpdated() {
        this.modalElement = this.querySelector('#entryModal');
        this.bsModal = new bootstrap.Modal(this.modalElement, {backdrop: 'static'});
        this.journal = await this.journalService.getJournal();
        this.requestUpdate();
    }

    selectEntry(entry) {
        this.selectedEntry = entry;
        this.grams = this.selectedEntry.grams;
        this.displayValues = {
            kcals: this.selectedEntry.nutriments.kcals,
            proteins: this.selectedEntry.nutriments.proteins,
            carbs: this.selectedEntry.nutriments.carbs,
            fats: this.selectedEntry.nutriments.carbs,
            grams: this.grams
        }
        this.bsModal.show();
        this.requestUpdate();
    }

    async deleteEntry() {
        await this.dao.deleteEntry(this.selectedEntry);
        this.journal = await this.journalService.getJournal();
        this.bsModal.hide();
        this.requestUpdate();
    }

    async updateEntry() {
        await this.dao.updateEntryValues(this.selectedEntry.id, this.grams);

        this.selectedEntry.grams = this.grams;
        this.selectedEntry.nutriments.kcals = this.displayValues.kcals;
        this.selectedEntry.nutriments.proteins = this.displayValues.proteins;
        this.selectedEntry.nutriments.carbs = this.displayValues.carbs;
        this.selectedEntry.nutriments.fats = this.displayValues.fats;

        this.bsModal.hide();
        this.requestUpdate();
    }


    updateValues(grams) {
        this.grams = grams;
        const factor = this.grams / 100;
        this.displayValues = {
            kcals: (this.selectedEntry.nutriments_per100g.kcals * factor).toFixed(1),
            proteins: (this.selectedEntry.nutriments_per100g.proteins * factor).toFixed(1),
            carbs: (this.selectedEntry.nutriments_per100g.carbs * factor).toFixed(1),
            fats: (this.selectedEntry.nutriments_per100g.fats * factor).toFixed(1),
            grams: this.grams
        };

        this.requestUpdate();
    }

    render() {
        return html`

            <div class="container px-0">
                
                <summary-component></summary-component>
                
                    ${this.journal.map(
                            journalEntry => html`
                                
                                <div>
                                    <span class="badge rounded-pill text-bg-light text-secondary" style="font-weight: 600">${journalEntry.group}</span>
                                </div>
                                <div class="list-group list-group-flush my-2 striped-list">
                                    
                                
                                    ${journalEntry.entries.map(
                                        entry => html`
                                            
                                    <a href="#" class="list-group-item list-group-item-action d-flex flex-column py-1"
                                       aria-current="true" @click=${(e) => {
                                        e.preventDefault();
                                        this.selectEntry(entry);
                                    }}>
                                        <div class="d-flex w-100 justify-content-between align-items-start">
                                            <div>
                                                <h6 style="font-weight: 400; font-size: 0.80em">${entry.name}</h6>
                                            </div>
                                            <small class="opacity-50 text-nowrap">${entry.grams} grs.</small>
                                        </div>
    
                                        <table class="meal-values w-100">
                                            <tbody>
                                            <tr>
                                                <td><strong style="font-weight: 500">${entry.nutriments.kcals}</strong>
                                                    kcals
                                                </td>
                                                <td><strong style="font-weight: 500">${entry.nutriments.proteins}</strong>
                                                    Prot.
                                                </td>
                                                <td><strong style="font-weight: 500">${entry.nutriments.carbs}</strong>
                                                    Carb.
                                                </td>
                                                <td><strong style="font-weight: 500">${entry.nutriments.fats}</strong>
                                                    Grasas
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </a>
                                            
                                    `)}
                                    
                                    <div class="d-flex justify-content-center pt-2">
                                        <a class="link-offset-2 link-underline link-underline-opacity-0"
                                           style="font-weight: 300; font-size: 0.80em"
                                           @click=${(e) => { e.preventDefault(); window.location.hash = `#recents?group=${journalEntry.group}`}}>Agregar alimento</a>
                                    </div>
                            `)}

                </div>

            </div>
            </div>
            

            <div class="modal fade" id="entryModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Editar</h5>
                            <button type="button" class="btn-close" @click=${() => this.bsModal.hide()}></button>
                        </div>
                        <div class="modal-body px-3 pb-0 pt-2">



                            <div class="d-flex w-100 justify-content-between align-items-start">
                                <div>
                                    <h6 style="font-weight: 400; font-size: 0.80em">
                                        ${this.selectedEntry?.name}
                                    </h6>
                                </div>
                            </div>

                            <table class="meal-values w-100">
                                <tbody>
                                <tr>
                                    <td>
                                        <strong style="font-weight: 400">${this.displayValues?.kcals}</strong>
                                        kcals
                                    </td>
                                    <td>
                                        <strong style="font-weight: 400">${this.displayValues?.proteins}</strong>
                                        Prot.
                                    </td>
                                    <td>
                                        <strong style="font-weight: 400">${this.displayValues?.carbs}</strong>
                                        Carb.
                                    </td>
                                    <td>
                                        <strong style="font-weight: 400">${this.displayValues?.fats}</strong>
                                        Grasas
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


                            <div class="modal-footer d-flex justify-content-between">
                                <button class="btn btn-outline-danger" @click=${this.deleteEntry}>Eliminar</button>
                                <button class="btn btn-outline-primary" @click=${this.updateEntry}>Aceptar</button>
                            </div>
                    </div>
                </div>
        `;
    }
}

customElements.define('home-page', HomePage);
