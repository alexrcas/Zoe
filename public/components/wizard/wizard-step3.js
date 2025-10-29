import { LitElement, html } from 'https://unpkg.com/lit@3.2.0/index.js?module';
import {Dao} from '../../components/Dao.js'

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

        this.dao = new Dao();

        this.userData = null;

        this.kcals = 0;

        this.proteinsMinRange = 0;
        this.proteinsMaxRange = 0;
        this.proteins = 0;
        this.proteinsRatio = 0;

        this.carbs = 0;
        this.carbsMaxRange = 0;

        this.fats = 0;
        this.proteinPercent = 0;
        this.carbPercent = 0;
        this.fatPercent = 0;

        this.showHelp = false;
        this.helpButtonText = 'Mostrar ayuda';
        this.animateClass = '';
    }

    toggleHelp() {
        this.showHelp = !this.showHelp;
        this.animateClass = 'animate__animated animate__zoomIn';
        this.helpButtonText = this.showHelp ? 'Ocultar ayuda' : 'Mostrar ayuda';
        this.requestUpdate();
    }

    createRenderRoot() {
        return this;
    }

    async firstUpdated() {
        this.userData = await this.dao.getUserData();

        this.kcals = this.userData.goal.kcals;

        this.proteinsMinRange = Math.round(this.userData.weight * 0.5);
        this.proteinsMaxRange = Math.round(this.userData.weight * 2.5);
        this.proteins = Math.round(this.userData.weight * 1.5);

        this.proteinsRatio = (this.proteins / this.userData.weight).toFixed(1);

        this.carbs = Math.round((this.userData.goal.kcals * 0.45) / 4);
        this.carbsMaxRange = Math.round((this.userData.goal.kcals * 0.75) / 4);

        this.calculateMacros();

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
        this.fats = parseInt(remainingKcals > 0 ? (remainingKcals / 9).toFixed(1) : 0);

        // Porcentajes
        this.proteinPercent = ((proteinKcals / this.kcals) * 100).toFixed(1);
        this.carbPercent = ((carbKcals / this.kcals) * 100).toFixed(1);
        this.fatPercent = ((this.fats * 9 / this.kcals) * 100).toFixed(1);

        this.proteinsRatio = (this.proteins / this.userData.weight).toFixed(1);

        this.requestUpdate();
    }

    renderCarbLabel() {
        if (this.carbPercent <= 10) return html`<span class="badge bg-dark ms-2">keto</span>`;
        if (this.carbPercent <= 20) return html`<span class="badge bg-secondary ms-2">low carb</span>`;
        return null;
    }

    renderFatsLabel() {
        if (this.fatPercent < 15) return html`<span class="badge bg-danger ms-2"><i class="fa-solid fa-triangle-exclamation"></i> El aporte de grasas debería ser mayor</span>`
        return null;
    }

    async goToStep4() {
        const userData = await this.dao.getUserData();
        userData.goal = {...userData.goal, ...{
                proteins: this.proteins,
                carbs: this.carbs,
                fats: this.fats
        }}

        await this.dao.saveOrUpdateUserData(userData);

        this.dispatchEvent(
            new CustomEvent('next-step', {
                detail: { step: 4 },
                bubbles: true,
                composed: true
            })
        );
    }

    render() {
        return html`
            <div class="px-4">
                <h6 style="font-weight: 400" class="mb-1 text-center">Ajusta tus macronutrientes</h6>
                <p class="text-muted text-center mb-2">
                    <strong style="font-weight: 400">${this.kcals} kcal</strong>
                </p>
                
                <div class="d-flex justify-content-end">
                <button class="btn btn-outline-secondary mb-2 mt-1 btn-borderless" @click="${this.toggleHelp}">${this.helpButtonText} <i class="fa-regular fa-lightbulb"></i></button>
                </div>
                
                <div class="alert-wrapper ${this.showHelp ? 'visible' : 'hidden'}">
                    <div class="alert alert-info animate__animated ${this.showHelp ? 'animate__fadeInDown' : 'animate__fadeOutUp'}"
                         style="font-weight: 300; font-size: 0.8em;">
                        En esta pantalla puedes terminar de afinar las cantidades de macronutrientes según tus gustos y necesidades.
                        <strong style="font-weight: 600">Ya hemos calculado unos valores adecuados para ti</strong>, así que si no sabes qué hacer, simplemente presiona continuar.
                    </div>
                </div>

                <!-- Proteínas -->
                <div>

                    <div style="font-weight: 300; font-size: 0.9em">
                    Proteínas: <label class="form-label" style="font-weight: 600; font-size: 0.9em">${this.proteins} g</label>
                        </div>
                    <input type="range" class="form-range" min="${this.proteinsMinRange}" max="${this.proteinsMaxRange}" step="5"
                           value=${this.proteins} @input=${this.updateProteins}>

                    <p class="text-muted small mb-2 text-end" style="font-size: 0.8em; font-weight: 400">
                        Aprox. <strong>${this.proteinsRatio} grs. </strong> por kg. de tu peso
                    </p>

                    <div class="alert-wrapper ${this.showHelp ? 'visible' : 'hidden'}">
                        <div class="alert alert-info animate__animated ${this.showHelp ? 'animate__fadeInDown' : 'animate__fadeOutUp'}"
                             style="font-weight: 300; font-size: 0.8em;">
                            La OMS recomienda consumir al menos 0,8 gramos de proteína por cada kilo de peso corporal al día, aunque la mayoría de especialistas aconsejan un rango un poco mayor, de entre 1,2 y 2 gramos por kilo,
                            según la edad, el nivel de actividad física y los objetivos personales.
                            Las proteínas ayudan a mantener y reparar los músculos y tejidos, forman parte de enzimas y hormonas, y son clave para que el cuerpo funcione correctamente.
                            Un déficit de proteínas puede provocar pérdida de masa muscular, cansancio o baja resistencia a las infecciones. En cambio, su consumo excesivo puede provocar estreñimiento y otras afecciones graves a largo plazo.
                        </div>
                    </div>

                </div>

                <!-- Carbohidratos -->
                <div class="mt-2">
                    <div style="font-weight: 300; font-size: 0.9em">
                    Carbohidratos:
                    <label class="form-label" style="font-weight: 600; font-size: 0.9em">
                        ${this.carbs} g
                        ${this.renderCarbLabel()}
                    </label>
                        </div>
                    <input type="range" class="form-range" min="0" max="${this.carbsMaxRange}" step="5"
                           value=${this.carbs} @input=${this.updateCarbs}>

                    <p class="text-muted small mb-2 text-end" style="font-size: 0.8em; font-weight: 400">
                        Aprox. <strong>${this.carbPercent}%</strong> de las calorías totales
                    </p>

                    <div class="alert-wrapper ${this.showHelp ? 'visible' : 'hidden'}">
                        <div class="alert alert-info animate__animated ${this.showHelp ? 'animate__fadeInDown' : 'animate__fadeOutUp'}"
                             style="font-weight: 300; font-size: 0.8em;">
                            Los carbohidratos son un macronutriente muy flexible en la dieta, aunque la mayoría de expertos recomienda que aporten entre el 35% y el 65% de las calorías totales.
                            Algunas personas se acostumbran y se sienten bien con dietas bajas en carbohidratos, pero es importante hacerlo con cuidado y de forma progresiva.
                            Los carbohidratos son nuestra principal fuente de energía, especialmente para el cerebro y los músculos.
                            Un déficit puede provocar cansancio, fatiga, mareos e incluso desvanecimientos, sobre todo si se realiza actividad física intensa.
                        </div>
                    </div>


                </div>

                <!-- Resultado -->
                <div class="mt-2">
                    
                    <div style="font-weight: 300; font-size: 0.9em">
                    Grasas:
                        <label class="form-label" style="font-weight: 600; font-size: 0.9em">
                            ${this.fats} g
                            ${this.renderFatsLabel()}
                        </label>
                    </div>
                    <div class="alert-wrapper ${this.showHelp ? 'visible' : 'hidden'}">
                        <div class="alert alert-info animate__animated ${this.showHelp ? 'animate__fadeInDown' : 'animate__fadeOutUp'}"
                             style="font-weight: 300; font-size: 0.8em;">
                            Las grasas son clave en muchas funciones vitales del cuerpo: nos proporcionan energía de reserva, ayudan a absorber algunas vitaminas y son necesarias para producir y mantener un entorno hormonal adecuado.
                            Los expertos recomiendan que las grasas aporten entre el 20% y el 30% de las calorías diarias, siempre priorizando grasas saludables.
                            Un déficit de grasas puede provocar desajustes hormonales y enfermedades a largo plazo
                        </div>
                    </div>
                </div>
            </div>

            <div class="d-flex justify-content-end mt-3 mb-2 me-2">
                <button class="btn btn-primary" @click=${this.goToStep4} ?disabled="${this.buttonDisabled}" >Siguiente</button>
            </div>
        `;
    }
}

customElements.define('wizard-step3', WizardStep3);
