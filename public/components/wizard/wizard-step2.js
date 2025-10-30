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
      
      <div class="alert alert-info" style="font-size: 0.8em; font-weight: 300">
          Tanto si tu objetivo es perder grasa o ganar masa muscular, lo ideal es empezar con un déficit o superávit ligero: 
          podrás irlo ajustando poco a poco, mientras que un cambio de alimentación demasiado brusco puede ser contraproducente o podría provocar un efecto rebote.
      </div>

    <!-- Objetivos siempre desplegados -->
    <div class="mb-3">

      <!-- Perder grasa -->
      <div class="mb-3">
        <h6 class="text-secondary mb-2" style="font-weight: 400; font-size: 0.9em">Perder grasa</h6>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="goal" id="deficitModerado"
                 value="slightDeficit" @change=${this.updateGoal}>
          <label class="form-check-label" for="deficitModerado">
            Déficit ligero &nbsp; <span class="text-muted small">${this.slightDeficit} Kcals</span>
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="goal" id="deficitAgresivo"
                 value="deficit" @change=${this.updateGoal}>
          <label class="form-check-label" for="deficitAgresivo">
            Déficit &nbsp; <span class="text-muted small">${this.deficit} Kcals</span>
          </label>
        </div>
      </div>

      <!-- Mantener peso -->
      <div class="mb-3">
        <h6 class="text-secondary mb-2" style="font-weight: 400; font-size: 0.9em">Mantener peso / Tonificar</h6>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="goal" id="mantenerPeso"
                 value="mantain" @change=${this.updateGoal}>
          <label class="form-check-label" for="mantenerPeso">
            Alimentación normocalórica &nbsp; <span class="text-muted small">${this.mantain} Kcals</span>
          </label>
        </div>
      </div>

      <!-- Aumentar masa muscular -->
      <div>
        <h6 class="text-secondary mb-2" style="font-weight: 400; font-size: 0.9em">Aumentar masa muscular</h6>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="goal" id="superavitModerado"
                 value="slightSurplus" @change=${this.updateGoal}>
          <label class="form-check-label" for="superavitModerado">
            Superávit ligero &nbsp; <span class="text-muted small">${this.slightSurplus} Kcals</span>
          </label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="goal" id="superavitAgresivo"
                 value="surplus" @change=${this.updateGoal}>
          <label class="form-check-label" for="superavitAgresivo">
            Superávit &nbsp; <span class="text-muted small">${this.surplus} Kcals</span>
          </label>
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
