import {LitElement, html, css} from 'https://unpkg.com/lit@3.2.0/index.js?module';
import {Dao} from './Dao.js';

export class SummaryComponent extends LitElement {

    constructor() {
        super();
        this.dao = new Dao();
        this.kcals = 0;
        this.proteins = 0;
        this.carbs = 0;
        this.fats = 0;
        this.goals = {};
    }

    createRenderRoot() {
        return this;
    }

    async firstUpdated() {
        this.entries = await this.dao.listEntries();
        this.entries.forEach(entry => {
            this.kcals += Math.round(entry.nutriments.kcals);
            this.proteins += Math.round(entry.nutriments.proteins);
            this.carbs += Math.round(entry.nutriments.carbs);
            this.fats += Math.round(entry.nutriments.fats);
        });
        this.goals = await this.dao.getUserGoals();
        this.requestUpdate();
    }


    render() {
        return html`

            <div class="accordion accordion-flush pt-2" id="accordionFlushSummary">

  <div class="accordion-item">

    <!-- Header del acordeón -->
    <h2 class="accordion-header">
      <button class="accordion-button collapsed px-2 py-1" type="button"
              data-bs-toggle="collapse" data-bs-target="#flush-collapseSummary"
              aria-expanded="false" aria-controls="flush-collapseSummary">

        <div class="w-100 d-flex flex-column">
          <!-- Título Total -->
          <h6 class="mb-1 fw-normal" style="font-size: 0.85em;">Total</h6>

          <!-- Valores y labels en columnas -->
          <div class="d-flex justify-content-between text-center" style="font-weight: 500; font-size: 0.85em;">
            <div>
              <div>${this.kcals}</div>
              <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">kcals</div>
            </div>
            <div>
              <div>${this.proteins}</div>
              <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">Prot.</div>
            </div>
            <div>
              <div>${this.carbs}</div>
              <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">Carb.</div>
            </div>
            <div>
              <div>${this.fats}</div>
              <div class="text-muted" style="font-weight: 400; font-size: 0.75em;">Grasas</div>
            </div>
          </div>

        </div>
      </button>
    </h2>

    <!-- Body del acordeón -->
    <div id="flush-collapseSummary" class="accordion-collapse collapse" data-bs-parent="#accordionFlushSummary">
      <div class="accordion-body px-2">

        <!-- KCALS -->
        <div class="mb-3">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <small class="fw-semibold text-secondary">Kcals</small>
            <small class="fw-semibold text-secondary">${this.kcals} / ${this.goals.kcals}</small>
          </div>
          <div class="progress rounded-pill" style="height: 0.35em; background-color: #f0f0f0;">
            <div class="progress-bar bg-primary rounded-pill opacity-75" 
                 style="width: ${Math.round((this.kcals / this.goals.kcals) * 100)}%; transition: width 0.4s ease;"></div>
          </div>
        </div>

        <!-- PROTEÍNAS -->
        <div class="mb-3">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <small class="fw-semibold text-secondary">Prot.</small>
            <small class="fw-semibold text-secondary">${this.proteins} / ${this.goals.proteins} g.</small>
          </div>
          <div class="progress rounded-pill" style="height: 0.35em; background-color: #f0f0f0;">
            <div class="progress-bar bg-danger rounded-pill opacity-75" 
                 style="width: ${Math.round((this.proteins / this.goals.proteins) * 100)}%; transition: width 0.4s ease;"></div>
          </div>
        </div>

        <!-- CARBOHIDRATOS -->
        <div class="mb-3">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <small class="fw-semibold text-secondary">Carb.</small>
            <small class="fw-semibold text-secondary">${this.carbs} / ${this.goals.carbs} g.</small>
          </div>
          <div class="progress rounded-pill" style="height: 0.35em; background-color: #f0f0f0;">
            <div class="progress-bar bg-success rounded-pill opacity-75" 
                 style="width: ${Math.round((this.carbs / this.goals.carbs) * 100)}%; transition: width 0.4s ease;"></div>
          </div>
        </div>

        <!-- GRASAS -->
        <div>
          <div class="d-flex justify-content-between align-items-center mb-1">
            <small class="fw-semibold text-secondary">Grasas</small>
            <small class="fw-semibold text-secondary">${this.fats} / ${this.goals.fats} g.</small>
          </div>
          <div class="progress rounded-pill" style="height: 0.35em; background-color: #f0f0f0;">
            <div class="progress-bar bg-warning rounded-pill opacity-75" 
                 style="width: ${Math.round((this.fats / this.goals.fats) * 100)}%; transition: width 0.4s ease;"></div>
          </div>
        </div>

      </div>
    </div>

  </div>

</div>


        `;
    }
}

customElements.define('summary-component', SummaryComponent);
