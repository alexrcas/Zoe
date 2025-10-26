import { LitElement, html } from 'https://unpkg.com/lit@3.2.0/index.js?module';

export class WizardStep3 extends LitElement {
    static properties = {
        kcals: { type: Number },
        proteins: { type: Number },
        carbs: { type: Number },
        fats: { type: Number },
        proteinPercent: { type: Number },
        carbPercent: { type: Number },
        fatPercent: { type: Number }
    };

    constructor() {
        super();
        this.kcals = 1800;
        this.proteins = 100;
        this.carbs = 150;
        this.fats = 0;
        this.proteinPercent = 0;
        this.carbPercent = 0;
        this.fatPercent = 0;
        this.calculateMacros();
    }

    createRenderRoot() {
        return this;
    }

    updateProteins(e) {
        this.proteins = Number(e.target.value);
        this.calculateMacros();
    }

    updateCarbs(e) {
        this.carbs = Number(e.target.value);
        this.calculateMacros();
    }

    calculateMacros() {
        const proteinKcals = this.proteins * 4;
        const carbKcals = this.carbs * 4;
        const remainingKcals = this.kcals - (proteinKcals + carbKcals);
        this.fats = remainingKcals > 0 ? (remainingKcals / 9).toFixed(1) : 0;

        // Porcentajes
        this.proteinPercent = ((proteinKcals / this.kcals) * 100).toFixed(1);
        this.carbPercent = ((carbKcals / this.kcals) * 100).toFixed(1);
        this.fatPercent = ((this.fats * 9 / this.kcals) * 100).toFixed(1);

        this.requestUpdate();
    }

    renderCarbLabel() {
        if (this.carbPercent <= 10) return html`<span class="badge bg-dark ms-2">keto</span>`;
        if (this.carbPercent <= 20) return html`<span class="badge bg-secondary ms-2">low carb</span>`;
        return null;
    }

    render() {
        return html`
            <div class="p-3">
                <h5 class="mb-3 text-center fw-semibold">Ajusta tus macronutrientes</h5>
                <p class="text-muted text-center mb-4">
                    Total diario: <strong>${this.kcals}</strong> kcal
                </p>

                <!-- Proteínas -->
                <div class="mb-4">
                    <label class="form-label fw-semibold">Proteínas: ${this.proteins} g</label>
                    <input type="range" class="form-range" min="50" max="200" step="5"
                           value=${this.proteins} @input=${this.updateProteins}>

                    <div class="alert alert-secondary py-2 px-3 mt-2 mb-0" style="font-size: 0.85em;">
                        🥩 La OMS recomienda consumir entre <strong>1,2 y 2 g de proteína por kilo de peso corporal</strong> al día.  
                        Valores muy bajos pueden causar pérdida muscular y fatiga; valores muy altos, sobrecarga renal innecesaria.
                    </div>
                </div>

                <!-- Carbohidratos -->
                <div class="mb-4">
                    <label class="form-label fw-semibold">
                        Carbohidratos: ${this.carbs} g
                        ${this.renderCarbLabel()}
                    </label>
                    <input type="range" class="form-range" min="0" max="500" step="5"
                           value=${this.carbs} @input=${this.updateCarbs}>

                    <p class="text-muted small mb-2 text-end">
                        Aporta aproximadamente <strong>${this.carbPercent}%</strong> de las calorías totales
                    </p>

                    <div class="alert alert-secondary py-2 px-3 mt-2 mb-0" style="font-size: 0.85em;">
                        🍚 Los carbohidratos deberían representar entre <strong>45 % y 65 % de las calorías diarias</strong>.  
                        Consumir muy pocos puede causar cansancio o bajo rendimiento, y en exceso facilita la ganancia de grasa.
                    </div>
                </div>

                <!-- Resultado -->
                <div class="border rounded-3 p-3 text-center bg-light mb-3">
                    <p class="mb-1"><strong>Grasas estimadas:</strong> ${this.fats} g</p>
                    <small class="text-muted">(Calculadas automáticamente según proteínas y carbohidratos)</small>
                </div>

                <!-- Porcentajes totales -->
                <div class="text-center">
                    <p class="mb-1"><strong>Distribución de macronutrientes:</strong></p>
                    <p class="mb-0 text-muted" style="font-size: 0.9em;">
                        Proteínas: ${this.proteinPercent}% • Carbohidratos: ${this.carbPercent}% • Grasas: ${this.fatPercent}%
                    </p>
                </div>
            </div>
        `;
    }
}

customElements.define('wizard-step3', WizardStep3);
