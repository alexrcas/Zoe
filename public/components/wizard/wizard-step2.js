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
            
            <div class="accordion" id="goalAccordion">

                <!-- Perder grasa -->
                <div class="accordion-item border-0 border-bottom">
                    <h3 class="accordion-header" id="headingLose">
                        <button class="accordion-button show bg-transparent fw-semibold py-2 no-button" style="font-size: 0.9rem; font-weight: 400 !important" type="button" 
                                data-bs-toggle="collapse" data-bs-target="#collapseLose" 
                                aria-expanded="false" aria-controls="collapseLose">
                            Perder grasa
                        </button>
                    </h3>
                    <div id="collapseLose" class="accordion-collapse show" aria-labelledby="headingLose">
                        <div class="accordion-body pt-0">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="goal" id="deficitModerado"
                                       value="slightDeficit" @change=${this.updateGoal}>
                                <label class="form-check-label" for="deficitModerado">
                                    Déficit ligero ${this.slightDeficit} kcals
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="goal" id="deficitAgresivo"
                                       value="deficit" @change=${this.updateGoal}>
                                <label class="form-check-label" for="deficitAgresivo">
                                    Déficit ${this.deficit} kcals
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Mantener peso -->
                <div class="accordion-item border-0 border-bottom">
                    <h3 class="accordion-header" id="headingMaintain">
                        <button class="accordion-button show bg-transparent fw-semibold py-2 no-button" style="font-size: 0.9rem; font-weight: 400 !important" type="button" 
                                data-bs-toggle="collapse" data-bs-target="#collapseMaintain" 
                                aria-expanded="false" aria-controls="collapseMaintain">
                            Mantener peso / Tonificar
                        </button>
                    </h3>
                    <div id="collapseMaintain" class="accordion-collapse show" aria-labelledby="headingMaintain">
                        <div class="accordion-body pt-0">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="goal" id="mantenerPeso"
                                       value="mantain" @change=${this.updateGoal}>
                                <label class="form-check-label" for="mantenerPeso">
                                    Alimentación normocalórica ${this.mantain} kcals
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Aumentar masa muscular -->
                <div class="accordion-item border-0">
                    <h3 class="accordion-header" id="headingGain">
                        <button class="accordion-button show bg-transparent fw-semibold py-2 no-button" style="font-size: 0.9rem; font-weight: 400 !important" type="button" 
                                data-bs-toggle="collapse" data-bs-target="#collapseGain" 
                                aria-expanded="false" aria-controls="collapseGain">
                            Aumentar masa muscular
                        </button>
                    </h3>
                    <div id="collapseGain" class="accordion-collapse show" aria-labelledby="headingGain">
                        <div class="accordion-body pt-0">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="goal" id="superavitModerado"
                                       value="slightSurplus" @change=${this.updateGoal}>
                                <label class="form-check-label" for="superavitModerado">
                                    Superávit ligero ${this.slightSurplus} kcals
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="goal" id="superavitAgresivo"
                                       value="surplus" @change=${this.updateGoal}>
                                <label class="form-check-label" for="superavitAgresivo">
                                    Superávit ${this.surplus} kcals
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div class="d-flex justify-content-end mt-3 me-2">
                <button class="btn btn-outline-primary" @click=${this.goToStep3} ?disabled="${this.buttonDisabled}">Siguiente</button>
            </div>
        `;
    }
}

customElements.define('wizard-step2', WizardStep2);
