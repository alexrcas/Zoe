import {LitElement, html} from 'https://unpkg.com/lit@3.2.0/index.js?module';
import {Dao} from '../../components/Dao.js'

export class WizardStep4 extends LitElement {

    constructor() {
        super();

        this.dao = new Dao();
        this.userData = null;

    }

    createRenderRoot() {
        return this;
    }

    async firstUpdated() {
        this.userData = await this.dao.getUserData();
        this.requestUpdate();
    }


    renderGoal() {
        switch (this.userData?.goal.goal) {
            case 'slightDeficit':
                return html`Perder grasa (déficit ligero)`
            case 'deficit':
                return html`Perder grasa (déficit)`;

            case 'mantain':
                return html`Mantener peso / tonificar`

            case 'slightSurplus':
                return html`Aumentar masa muscular (superávit ligero)`
            case 'surplus':
                return html`Aumentar masa muscular (superávit)`

            default:
                return html``;
        }

    }

    render() {
        return html`
            <div class="px-4">
                <h6 style="font-weight: 500; font-size: 1em" class="mb-1 text-center">Tu Resumen</h6>

                <div class="card shadow-sm border-0 rounded-4 mb-3" style="max-width: 380px; background-color: #f8f9fa;">
                    <div class="card-body text-center py-4">
                        <h5 class="card-title mb-3" style="font-weight: 300">${this.userData?.goal.kcals} kcals</h5>
                        <p class="text-muted mb-3" style="font-size: 0.85em">
                            ${this.renderGoal()}
                        </p>

                        <div class="d-flex justify-content-around text-center">
                            <div>
                                <h6 class="fw-semi-bold mb-1">${this.userData?.goal.proteins} g</h6>
                                <small class="text-muted">Proteínas</small>
                            </div>
                            <div>
                                <h6 class="fw-semi-bold mb-1">${this.userData?.goal.carbs} g</h6>
                                <small class="text-muted">Carbohidratos</small>
                            </div>
                            <div>
                                <h6 class="fw-semi-bold mb-1">${this.userData?.goal.fats} g</h6>
                                <small class="text-muted">Grasas</small>
                            </div>
                        </div>
                    </div>
                </div>


                <span class="py-3" style="font-size: 0.85em; font-weight: 300;">
                No hace falta que apuntes estos valores. ¡Ya los tienes actualizados en tu calculadora!
            </span>

                
            </div>

            <div class="d-flex justify-content-end mt-3 mb-2 me-2">
                <button class="btn btn-primary">Terminar</button>
            </div>
            
            <div class="alert alert-warning mx-4 mt-3" style="font-weight: 300; font-size: 0.85em;">
                Estos valores se han obtenido a partir de fórmulas y tablas de referencia generales, por lo que tienen un carácter orientativo. No sustituyen en ningún caso la valoración personalizada de un profesional de la salud.
                Consulta siempre con un especialista, especialmente si tienes alguna condición médica o requerimientos nutricionales específicos. Escucha a tu cuerpo y mantén una alimentación equilibrada y saludable.
            </div>
        `;
    }
}

customElements.define('wizard-step4', WizardStep4);
