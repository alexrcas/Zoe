import {LitElement, html} from 'https://unpkg.com/lit@3.2.0/index.js?module';
import {Dao} from '../../components/Dao.js'

export class WizardStep2 extends LitElement {

    static properties = {
        goal: { type: String }
    };

    constructor() {
        super();
        this.dao = new Dao();
        this.goal = '';

        this.slightDeficit = 0;
        this.deficit = 0;

        this.mantain = 0;

        this.slightSurplus = 0;
        this.surplus = 0;

        this.buttonDisabled = true;
    }


    calculateCalories({ genre, age, height, weight, activity }) {
        const activityMultipliers = [1.2, 1.375, 1.55, 1.725, 1.9];
        let BMR;
        if (genre === "male") {
            BMR = 66 + (13.7 * weight) + (5 * height) - (6.8 * age);
        } else {
            BMR = 655 + (9.6 * weight) + (1.8 * height) - (4.7 * age);
        }

        const maintenance = BMR * activityMultipliers[activity];

        this.mantain = Math.round(maintenance);
        this.slightDeficit = Math.round(maintenance * 0.9);
        this.deficit = Math.round(maintenance * 0.8);
        this.slightSurplus = Math.round(maintenance * 1.1);
        this.surplus = Math.round(maintenance * 1.2);
    }



    createRenderRoot() {
        return this; // usar el DOM global (Bootstrap)
    }


    async firstUpdated() {
        const userData = await this.dao.getUserData();
        this.calculateCalories(userData);
        this.requestUpdate();
    }


    updateGoal(e) {
        this.goal = e.target.value;
        this.buttonDisabled = !this.goal;
    }

    async goToStep3() {
        const userData = await this.dao.getUserData();
        userData.goal = {
            goal: this.goal,
            kcals: this[this.goal]
        }
        await this.dao.saveOrUpdateUserData(userData);

        this.dispatchEvent(
            new CustomEvent('next-step', {
                detail: { step: 3 },
                bubbles: true,
                composed: true
            })
        );
    }

    render() {
        return html`
<div class="container py-3" style="max-width: 420px;">
  <!-- Card principal -->
  <div class="card shadow-sm border-0 rounded-4 p-3">

    <h6 class="text-center fw-semibold text-secondary mb-3">Selecciona tu objetivo</h6>

    <div class="accordion" id="goalAccordion">

      <!-- Perder grasa -->
      <div class="accordion-item border-0 border-bottom">
        <h3 class="accordion-header" id="headingLose">
          <button class="accordion-button bg-transparent fw-semibold py-2 px-0" 
                  type="button" data-bs-toggle="collapse" 
                  data-bs-target="#collapseLose" aria-expanded="true" 
                  aria-controls="collapseLose" style="font-size: 0.95rem;">
            Perder grasa
          </button>
        </h3>
        <div id="collapseLose" class="accordion-collapse collapse show" aria-labelledby="headingLose">
          <div class="accordion-body pt-2 px-0">
            <div class="form-check mb-2">
              <input class="form-check-input" type="radio" name="goal" id="deficitModerado"
                     value="slightDeficit" @change=${this.updateGoal}>
              <label class="form-check-label" for="deficitModerado">
                Déficit ligero ${this.slightDeficit} Kcals
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="goal" id="deficitAgresivo"
                     value="deficit" @change=${this.updateGoal}>
              <label class="form-check-label" for="deficitAgresivo">
                Déficit ${this.deficit} Kcals
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Mantener peso -->
      <div class="accordion-item border-0 border-bottom">
        <h3 class="accordion-header" id="headingMaintain">
          <button class="accordion-button bg-transparent fw-semibold py-2 px-0" 
                  type="button" data-bs-toggle="collapse" 
                  data-bs-target="#collapseMaintain" aria-expanded="true" 
                  aria-controls="collapseMaintain" style="font-size: 0.95rem;">
            Mantener peso / Tonificar
          </button>
        </h3>
        <div id="collapseMaintain" class="accordion-collapse collapse show" aria-labelledby="headingMaintain">
          <div class="accordion-body pt-2 px-0">
            <div class="form-check">
              <input class="form-check-input" type="radio" name="goal" id="mantenerPeso"
                     value="mantain" @change=${this.updateGoal}>
              <label class="form-check-label" for="mantenerPeso">
                Alimentación normocalórica ${this.mantain} Kcals
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Aumentar masa muscular -->
      <div class="accordion-item border-0">
        <h3 class="accordion-header" id="headingGain">
          <button class="accordion-button bg-transparent fw-semibold py-2 px-0" 
                  type="button" data-bs-toggle="collapse" 
                  data-bs-target="#collapseGain" aria-expanded="true" 
                  aria-controls="collapseGain" style="font-size: 0.95rem;">
            Aumentar masa muscular
          </button>
        </h3>
        <div id="collapseGain" class="accordion-collapse collapse show" aria-labelledby="headingGain">
          <div class="accordion-body pt-2 px-0">
            <div class="form-check mb-2">
              <input class="form-check-input" type="radio" name="goal" id="superavitModerado"
                     value="slightSurplus" @change=${this.updateGoal}>
              <label class="form-check-label" for="superavitModerado">
                Superávit ligero ${this.slightSurplus} Kcals
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="goal" id="superavitAgresivo"
                     value="surplus" @change=${this.updateGoal}>
              <label class="form-check-label" for="superavitAgresivo">
                Superávit ${this.surplus} Kcals
              </label>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Botón siguiente -->
    <div class="d-flex justify-content-end mt-3">
      <button class="btn btn-primary rounded-3 shadow-sm px-4"
              @click=${this.goToStep3} ?disabled="${this.buttonDisabled}">
        Siguiente
      </button>
    </div>

  </div>
</div>

        `;
    }
}

customElements.define('wizard-step2', WizardStep2);
