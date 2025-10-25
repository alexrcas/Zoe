import {LitElement, html} from 'https://unpkg.com/lit@3.2.0/index.js?module';
import {Dao} from '../components/Dao.js';

class ProfilePage extends LitElement {

    createRenderRoot() {
        return this;
    }

    constructor() {
        super();
        this.dao = new Dao();

        this.values = {
            proteins: 0,
            carbs: 0,
            fats: 0,
        };

        this.percents = {
            proteins: 0,
            carbs: 0,
            fats: 0,
        };

        this.kcals = 0;
    }

    async firstUpdated() {
        const goals = await this.dao.getUserGoals();
        this.values.proteins = goals.proteins || 0;
        this.values.carbs = goals.carbs || 0;
        this.values.fats = goals.fats || 0;
        this.kcals = goals.kcals || 0;

        this.updatePercents();
        this.requestUpdate();
    }

    /** Actualiza kcal totales y porcentajes cuando cambian los gramos */
    updateValues(value, key) {
        this.values[key] = Number(value) || 0;
        this.kcals = (this.values.proteins * 4) + (this.values.carbs * 4) + (this.values.fats * 9);
        this.updatePercents();
        this.requestUpdate();
    }

    /** Actualiza gramos y kcals cuando cambian los porcentajes */
    updatePercentsValues(value, key) {
        this.percents[key] = Number(value) || 0;

        const totalPercent = this.percents.proteins + this.percents.carbs + this.percents.fats;
        if (totalPercent === 0 || this.kcals === 0) return;

        // Recalcular gramos en base al % y kcals totales
        this.values.proteins = Math.round((this.kcals * (this.percents.proteins / 100)) / 4);
        this.values.carbs = Math.round((this.kcals * (this.percents.carbs / 100)) / 4);
        this.values.fats = Math.round((this.kcals * (this.percents.fats / 100)) / 9);

        this.requestUpdate();
    }

    /** Calcula los porcentajes basándose en los gramos actuales */
    updatePercents() {
        const proteinKcals = this.values.proteins * 4;
        const carbKcals = this.values.carbs * 4;
        const fatKcals = this.values.fats * 9;
        const totalFromMacros = proteinKcals + carbKcals + fatKcals;

        if (totalFromMacros > 0) {
            this.percents = {
                proteins: Math.round((proteinKcals / totalFromMacros) * 100),
                carbs: Math.round((carbKcals / totalFromMacros) * 100),
                fats: Math.round((fatKcals / totalFromMacros) * 100),
            };
        } else {
            this.percents = {proteins: 0, carbs: 0, fats: 0};
        }
    }

    async saveValues() {
        const goals = {
            kcals: this.kcals,
            carbs: this.values.carbs,
            fats: this.values.fats,
            proteins: this.values.proteins
        };
        await this.dao.saveOrUpdateUserGoals(goals);
    }

    render() {
        return html`

            <div class="container">
                <h5 class="pt-2 pb-0 mb-0">Perfil</h5>
            </div>

            <div class="container mt-2">
                <div class="d-flex flex-column align-items-center px-3 py-2" style="max-width: 420px;">

                    <!-- Selector tipo pills -->
                    <ul class="nav nav-pills nav-justified mb-3 w-100" id="formToggle" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active py-2 small" id="macros-tab" data-bs-toggle="pill"
                                    data-bs-target="#macros" type="button" role="tab">
                                Macronutrientes
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link py-2 small" id="kcals-tab" data-bs-toggle="pill"
                                    data-bs-target="#kcals" type="button" role="tab">
                                Calorías
                            </button>
                        </li>
                    </ul>

                    <!-- Contenido dinámico -->
                    <div class="tab-content w-100" id="formToggleContent">

                        <!-- Formulario 1: Macronutrientes -->
                        <div class="tab-pane fade show active" id="macros" role="tabpanel" aria-labelledby="macros-tab">
                            <div class="d-flex flex-column align-items-center">

                                <!-- Proteínas -->
                                <div class="form-floating mb-2 w-100" style="font-size: 0.9rem;">
                                    <input id="proteins" class="form-control form-control-sm pe-5" type="number"
                                           inputmode="numeric"
                                           pattern="[0-9]*"
                                           placeholder="Proteínas"
                                           .value=${this.values.proteins}
                                           @input=${e => this.updateValues(e.target.value, 'proteins')}/>
                                    <label for="proteins">Proteínas</label>
                                    <span class="position-absolute top-50 end-0 translate-middle-y pe-3 text-muted small">grs.</span>
                                </div>

                                <!-- Carbohidratos -->
                                <div class="form-floating mb-2 w-100" style="font-size: 0.9rem;">
                                    <input id="carbs" class="form-control form-control-sm pe-5" type="number"
                                           inputmode="numeric"
                                           pattern="[0-9]*"
                                           placeholder="Carbohidratos"
                                           .value=${this.values.carbs}
                                           @input=${e => this.updateValues(e.target.value, 'carbs')}/>
                                    <label for="carbs">Carbohidratos</label>
                                    <span class="position-absolute top-50 end-0 translate-middle-y pe-3 text-muted small">grs.</span>
                                </div>

                                <!-- Grasas -->
                                <div class="form-floating mb-2 w-100" style="font-size: 0.9rem;">
                                    <input id="fats" class="form-control form-control-sm pe-5" type="number"
                                           inputmode="numeric"
                                           pattern="[0-9]*"
                                           placeholder="Grasas"
                                           .value=${this.values.fats}
                                           @input=${e => this.updateValues(e.target.value, 'fats')}/>
                                    <label for="fats">Grasas</label>
                                    <span class="position-absolute top-50 end-0 translate-middle-y pe-3 text-muted small">grs.</span>
                                </div>

                                <!-- Calorías -->
                                <h5 class="mt-2 text-center fw-semibold">${this.kcals} Kcals</h5>

                                <!-- Botón -->
                                <button @click=${this.saveValues} class="btn btn-primary btn-sm mt-3 w-100">Guardar
                                </button>
                            </div>
                        </div>

                        <!-- Formulario 2: Calorías -->
                        <div class="tab-pane fade" id="kcals" role="tabpanel" aria-labelledby="kcals-tab">
                            <div class="d-flex flex-column align-items-center">

                                <!-- Total kcal -->
                                <div class="form-floating mb-3 w-100" style="font-size: 0.9rem;">
                                    <input id="kcalsInput" class="form-control form-control-sm pe-5" type="number"
                                           inputmode="numeric"
                                           placeholder="Calorías totales"
                                           .value=${this.kcals}
                                           @input=${e => {
                                               this.kcals = Number(e.target.value) || 0;
                                               this.updatePercentsValues(0, 'none');
                                           }}/>
                                    <label for="kcalsInput">Calorías totales</label>
                                    <span class="position-absolute top-50 end-0 translate-middle-y pe-3 text-muted small">Kcals</span>
                                </div>

                                <!-- Proteínas -->
                                <div class="form-floating mb-2 w-100" style="font-size: 0.9rem;">
                                    <input id="proteinsPercent" class="form-control form-control-sm pe-5" type="number"
                                           inputmode="numeric"
                                           placeholder="Proteínas"
                                           .value=${this.percents.proteins}
                                           @input=${e => this.updatePercentsValues(e.target.value, 'proteins')}/>
                                    <label for="proteinsPercent">Proteínas</label>
                                    <span class="position-absolute top-50 end-0 translate-middle-y pe-3 text-muted small">%</span>
                                </div>

                                <!-- Carbohidratos -->
                                <div class="form-floating mb-2 w-100" style="font-size: 0.9rem;">
                                    <input id="carbsPercent" class="form-control form-control-sm pe-5" type="number"
                                           inputmode="numeric"
                                           placeholder="Carbohidratos"
                                           .value=${this.percents.carbs}
                                           @input=${e => this.updatePercentsValues(e.target.value, 'carbs')}/>
                                    <label for="carbsPercent">Carbohidratos</label>
                                    <span class="position-absolute top-50 end-0 translate-middle-y pe-3 text-muted small">%</span>
                                </div>

                                <!-- Grasas -->
                                <div class="form-floating mb-2 w-100" style="font-size: 0.9rem;">
                                    <input id="fatsPercent" class="form-control form-control-sm pe-5" type="number"
                                           inputmode="numeric"
                                           placeholder="Grasas"
                                           .value=${this.percents.fats}
                                           @input=${e => this.updatePercentsValues(e.target.value, 'fats')}/>
                                    <label for="fatsPercent">Grasas</label>
                                    <span class="position-absolute top-50 end-0 translate-middle-y pe-3 text-muted small">%</span>
                                </div>

                                <!-- Botón -->
                                <button @click=${this.saveValues} class="btn btn-primary btn-sm mt-3 w-100">Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('profile-page', ProfilePage);
