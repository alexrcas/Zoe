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
        window.location.reload();
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
            <div class="container px-0" style="max-width: 420px;">

  <!-- Resumen superior -->
  <summary-component></summary-component>

  <!-- Journal por grupos -->
  ${this.journal.map(journalEntry => html`
    <div class="mb-3">

      <!-- Badge del grupo -->
      <span class="badge rounded-pill text-bg-light text-secondary mb-2" style="font-weight: 600;">
        ${journalEntry.group}
      </span>

      <!-- Lista de alimentos -->
      <div class="list-group list-group-flush shadow-sm rounded-3 bg-white striped-list">
        ${journalEntry.entries.map(entry => html`
          <a href="#" class="list-group-item list-group-item-action py-2 d-flex flex-column"
             @click=${e => { e.preventDefault(); this.selectEntry(entry); }}>

            <div class="d-flex w-100 justify-content-between align-items-center mb-1">
              <h6 style="font-weight: 400; font-size: 0.85em;">${entry.name}</h6>
              <small class="opacity-50 text-nowrap">${entry.grams} grs.</small>
            </div>

            <!-- Valores y labels alineados en columnas -->
            <div class="d-flex justify-content-between text-center" style="font-weight: 500; font-size: 0.85em;">
              <div>
                <div>${entry.nutriments.kcals}</div>
                <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">kcals</div>
              </div>
              <div>
                <div>${entry.nutriments.proteins}</div>
                <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">Prot.</div>
              </div>
              <div>
                <div>${entry.nutriments.carbs}</div>
                <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">Carb.</div>
              </div>
              <div>
                <div>${entry.nutriments.fats}</div>
                <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">Grasas</div>
              </div>
            </div>

          </a>
        `)}

        <!-- Agregar alimento -->
        <div class="d-flex justify-content-center py-2">
          <a class="text-decoration-underline text-muted" style="font-weight: 300; font-size: 0.8em;"
             @click=${e => { e.preventDefault(); window.location.hash = `#recents?group=${journalEntry.group}`; }}>
            Agregar alimento
          </a>
        </div>
      </div>
    </div>
  `)}

</div>

<!-- Modal de edición de entrada -->
<div class="modal fade" id="entryModal" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content rounded-4 shadow-sm">

      <div class="modal-header border-0">
        <h5 class="modal-title fw-semibold">Editar alimento</h5>
        <button type="button" class="btn-close" @click=${() => this.bsModal.hide()}></button>
      </div>

      <div class="modal-body px-3 pt-2 pb-0">

        <h6 class="fw-normal mb-2" style="font-size: 0.85em;">
          ${this.selectedEntry?.name}
        </h6>

        <!-- Valores y labels en columnas, alineados -->
        <div class="d-flex justify-content-between text-center mb-3" style="font-weight: 500; font-size: 0.85em;">
          <div>
            <div>${this.displayValues?.kcals}</div>
            <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">kcals</div>
          </div>
          <div>
            <div>${this.displayValues?.proteins}</div>
            <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">Prot.</div>
          </div>
          <div>
            <div>${this.displayValues?.carbs}</div>
            <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">Carb.</div>
          </div>
          <div>
            <div>${this.displayValues?.fats}</div>
            <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">Grasas</div>
          </div>
        </div>

        <!-- Input gramos -->
        <div class="d-flex justify-content-center mb-3">
          <div class="input-group input-group-sm" style="width: 40%;">
            <input class="form-control text-center" type="number" inputmode="numeric" pattern="[0-9]*"
                   placeholder="Cantidad en gramos"
                   value=${this.grams} @input=${e => this.updateValues(e.target.value)}/>
            <span class="input-group-text">grs.</span>
          </div>
        </div>
      </div>

      <div class="modal-footer d-flex justify-content-between border-0 pt-0">
        <button class="btn btn-outline-danger rounded-3" @click=${this.deleteEntry}>Eliminar</button>
        <button class="btn btn-outline-primary rounded-3" @click=${this.updateEntry}>Aceptar</button>
      </div>

    </div>
  </div>
</div>


        `;
    }
}

customElements.define('home-page', HomePage);
