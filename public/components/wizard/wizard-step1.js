import {LitElement, html, css} from 'https://unpkg.com/lit@3.2.0/index.js?module';

export class WizardStep1 extends LitElement {

    constructor() {
        super();
        this.sexo = '';
        this.edad = '';
        this.altura = '';
        this.peso = '';
        this.actividad = '';
    }

    createRenderRoot() {
        return this; // usar el DOM global (Bootstrap)
    }

    handleInput(e, field) {
        this[field] = e.target.value;
        console.log(this.peso)
    }

    goToStep2() {
        this.dispatchEvent(
            new CustomEvent('next-step', {
                detail: { step: 2 }, // ⚠️ "detail", no "details"
                bubbles: true,
                composed: true
            })
        );
    }

    render() {
        return html`
            
            
            <div class="form-card">
                <form class="form-section px-4">

                    <!-- Sexo -->
                    <div class="form-floating mb-3">
                        <select id="sexo" class="form-select" @change=${e => this.handleInput(e, 'sexo')}>
                            <option selected disabled value="">Selecciona tu sexo</option>
                            <option value="male">Hombre</option>
                            <option value="female">Mujer</option>
                            <option value="other">Otro / Prefiero no decirlo</option>
                        </select>
                        <label for="sexo">Sexo</label>
                    </div>

                    <!-- Edad -->
                    <div class="form-floating mb-3">
                        <input
                                type="number"
                                id="edad"
                                class="form-control"
                                placeholder="Edad"
                                min="0"
                                .value=${this.edad}
                                @input=${e => this.handleInput(e, 'edad')}
                        />
                        <label for="edad">Edad</label>
                    </div>

                    <!-- Altura -->
                    <div class="form-floating mb-3">
                        <input
                                type="number"
                                id="altura"
                                class="form-control"
                                placeholder="Altura (cm)"
                                min="0"
                                .value=${this.altura}
                                @input=${e => this.handleInput(e, 'altura')}
                        />
                        <label for="altura">Altura (cm)</label>
                    </div>

                    <!-- Peso -->
                    <div class="form-floating mb-3">
                        <input
                                type="number"
                                id="peso"
                                class="form-control"
                                placeholder="Peso (kg)"
                                min="0"
                                .value=${this.peso}
                                @input=${e => this.handleInput(e, 'peso')}
                        />
                        <label for="peso">Peso (kg)</label>
                    </div>

                    <!-- Nivel de actividad -->
                    <div class="form-floating mb-3">
                        <select id="actividad" class="form-select" @change=${e => this.handleInput(e, 'actividad')}>
                            <option selected disabled value="">Selecciona nivel de actividad</option>
                            <option value="1">1 - Muy baja (poca o ninguna actividad)</option>
                            <option value="2">2 - Moderada (algo de ejercicio semanal)</option>
                            <option value="3">3 - Activa (entrenas con regularidad)</option>
                            <option value="4">4 - Muy activa (entrenas intensamente a diario)</option>
                        </select>
                        <label for="actividad">Nivel de actividad física</label>
                    </div>

                </form>

                <div class="d-flex justify-content-end mt-3 me-2">
                    <button class="btn btn-outline-primary" @click=${this.goToStep2}>Siguiente</button>
                </div>

            </div>
        `;
    }
}

customElements.define('wizard-step1', WizardStep1);
