import {LitElement, html} from 'https://unpkg.com/lit@3.2.0/index.js?module';

export class WizardStep2 extends LitElement {

    static properties = {
        goal: { type: String }
    };

    constructor() {
        super();
        this.goal = '';
    }

    createRenderRoot() {
        return this; // usar el DOM global (Bootstrap)
    }

    updateGoal(e) {
        this.goal = e.target.value;
        console.log("Objetivo seleccionado:", this.goal);
    }

    goToStep3() {
        this.dispatchEvent(
            new CustomEvent('next-step', {
                detail: { step: 3 }, // ⚠️ "detail", no "details"
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
                                       value="deficit_moderado" @change=${this.updateGoal}>
                                <label class="form-check-label" for="deficitModerado">
                                    Déficit moderado (≈1800 kcal)
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="goal" id="deficitAgresivo"
                                       value="deficit_agresivo" @change=${this.updateGoal}>
                                <label class="form-check-label" for="deficitAgresivo">
                                    Déficit agresivo (≈1500 kcal)
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
                                       value="mantener_peso" @change=${this.updateGoal}>
                                <label class="form-check-label" for="mantenerPeso">
                                    Mantener peso (≈1800 kcal)
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
                                       value="superavit_moderado" @change=${this.updateGoal}>
                                <label class="form-check-label" for="superavitModerado">
                                    Superávit moderado
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="goal" id="superavitAgresivo"
                                       value="superavit_agresivo" @change=${this.updateGoal}>
                                <label class="form-check-label" for="superavitAgresivo">
                                    Superávit agresivo
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div class="d-flex justify-content-end mt-3 me-2">
                <button class="btn btn-outline-primary" @click=${this.goToStep3}>Siguiente</button>
            </div>
        `;
    }
}

customElements.define('wizard-step2', WizardStep2);
