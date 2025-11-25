import { LitElement, html } from 'lit';
import { Dao } from '../components/Dao';
import '../components/summary-component';
import { JournalService } from "../components/JournalService";
import '../components/modals/home-entry-modal';

declare const bootstrap: any;

interface DisplayValues {
  grams: number;
  kcals: number;
  proteins: number;
  carbs: number;
  fats: number;
}

export class HomePage extends LitElement {
  dao: Dao;
  journalService: JournalService;
  journal: any[];
  selectedEntry: any;
  grams: number | null;
  displayValues: DisplayValues;
  modalComponent: any;

  static properties = {
    journal: { type: Array },
    selectedEntry: { type: Object },
    grams: { type: Number },
    displayValues: { type: Object }
  };

  constructor() {
    super();
    this.dao = Dao.getInstance();
    this.journalService = new JournalService();
    this.journal = [];
    this.selectedEntry = null;
    this.grams = null;
    this.displayValues = {
      grams: 0,
      kcals: 0,
      proteins: 0,
      carbs: 0,
      fats: 0
    };
  }

  createRenderRoot() {
    return this;
  }

  async firstUpdated() {
    this.modalComponent = this.querySelector('home-entry-modal');
    this.journal = await this.journalService.getJournal();
    this.requestUpdate();
  }

  selectEntry(entry: any) {
    this.selectedEntry = entry;
    this.grams = this.selectedEntry.grams;

    if (!this.grams) { return; }

    this.displayValues = {
      kcals: this.selectedEntry.nutriments.kcals,
      proteins: this.selectedEntry.nutriments.proteins,
      carbs: this.selectedEntry.nutriments.carbs,
      fats: this.selectedEntry.nutriments.carbs,
      grams: this.grams
    }
    if (this.modalComponent) {
      this.modalComponent.show();
    }
    this.requestUpdate();
  }

  async deleteEntry() {
    await this.dao.deleteEntry(this.selectedEntry);
    this.journal = await this.journalService.getJournal();
    if (this.modalComponent) {
      this.modalComponent.hide();
    }
    this.requestUpdate();
  }

  async updateEntry() {
    await this.dao.updateEntryValues(this.selectedEntry.id, this.grams!);

    this.selectedEntry.grams = this.grams;
    this.selectedEntry.nutriments.kcals = this.displayValues.kcals;
    this.selectedEntry.nutriments.proteins = this.displayValues.proteins;
    this.selectedEntry.nutriments.carbs = this.displayValues.carbs;
    this.selectedEntry.nutriments.fats = this.displayValues.fats;

    if (this.modalComponent) {
      this.modalComponent.hide();
    }
    this.requestUpdate();
    window.location.reload();
  }


  updateValues(grams: string) {

    if (!grams) {
      return;
    }
    this.grams = parseFloat(grams);
    const factor = this.grams / 100;
    this.displayValues = {
      kcals: Number((this.selectedEntry.product.nutriments.kcals * factor).toFixed(0)),
      proteins: Number((this.selectedEntry.product.nutriments.proteins * factor).toFixed(1)),
      carbs: Number((this.selectedEntry.product.nutriments.carbs * factor).toFixed(1)),
      fats: Number((this.selectedEntry.product.nutriments.fats * factor).toFixed(1)),
      grams: this.grams
    };

    this.requestUpdate();
  }

  handleModalUpdateValues(e: CustomEvent) {
    this.updateValues(e.detail);
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
        ${journalEntry.entries.map((entry: any) => html`
          <a href="#" class="list-group-item list-group-item-action py-2 d-flex flex-column"
             @click=${(e: Event) => { e.preventDefault(); this.selectEntry(entry); }}>

            <div class="d-flex w-100 justify-content-between align-items-center mb-1">
              <h6 style="font-weight: 400; font-size: 0.85em;">${entry.name}</h6>
              <small class="opacity-50 text-nowrap">${entry.grams} g.</small>
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
             @click=${(e: Event) => { e.preventDefault(); window.location.hash = `#recents?group=${journalEntry.group}`; }}>
            Agregar alimento
          </a>
        </div>
      </div>
    </div>
  `)}

</div>

<!-- Modal de edición de entrada -->
<home-entry-modal
    .selectedEntry=${this.selectedEntry}
    .grams=${this.grams}
    .displayValues=${this.displayValues}
    @update-values=${this.handleModalUpdateValues}
    @delete-entry=${this.deleteEntry}
    @update-entry=${this.updateEntry}
></home-entry-modal>


        `;
  }
}

customElements.define('home-page', HomePage);
