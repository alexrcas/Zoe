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

        const goals = {
            kcals: this.userData.goal.kcals,
            carbs: this.userData.goal.carbs,
            fats: this.userData.goal.fats,
            proteins: this.userData.goal.proteins
        };

        await this.dao.saveOrUpdateUserGoals(goals);
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
<div class="container py-3" style="max-width: 420px;">

  <h6 class="text-center fw-semibold mb-3" style="font-size: 1em;">Tu Resumen</h6>

  <!-- Card de resumen -->
  <div class="card shadow-sm border-0 rounded-4 mb-3" style="max-width: 380px; background-color: #f8f9fa; margin: 0 auto;">
    <div class="card-body text-center py-4">
      <h5 class="card-title mb-3" style="font-weight: 300; font-size: 1.2em;">
        ${this.userData?.goal.kcals} Kcals
      </h5>
      <p class="text-muted mb-3" style="font-size: 0.85em;">
        ${this.renderGoal()}
      </p>

      <div class="d-flex justify-content-around text-center mt-2">
        <div>
          <h6 class="fw-semibold mb-1">${this.userData?.goal.proteins} g</h6>
          <small class="text-muted">Proteínas</small>
        </div>
        <div>
          <h6 class="fw-semibold mb-1">${this.userData?.goal.carbs} g</h6>
          <small class="text-muted">Carbohidratos</small>
        </div>
        <div>
          <h6 class="fw-semibold mb-1">${this.userData?.goal.fats} g</h6>
          <small class="text-muted">Grasas</small>
        </div>
      </div>
    </div>
  </div>

  <!-- Mensaje de información -->
  <p class="text-center text-muted mb-3" style="font-size: 0.85em; font-weight: 300;">
    No hace falta que apuntes estos valores. ¡Ya los tienes actualizados en tu calculadora!
  </p>

  <!-- Alerta de advertencia -->
  <div class="alert alert-warning" style="font-weight: 300; font-size: 0.85em; line-height: 1.4;">
    Estos valores se han obtenido a partir de fórmulas y tablas de referencia generales, por lo que tienen un carácter orientativo. 
    No sustituyen en ningún caso la valoración personalizada de un profesional de la salud. 
    Consulta siempre con un especialista, especialmente si tienes alguna condición médica o requerimientos nutricionales específicos. 
    Escucha a tu cuerpo y mantén una alimentación equilibrada y saludable.
  </div>

    <!-- Botón Terminar -->
    <div class="d-flex justify-content-end mb-3">
        <button @click="${() => window.location = '#home'}" class="btn btn-primary rounded-3 shadow-sm px-4">Terminar</button>
    </div>

</div>

        `;
    }
}

customElements.define('wizard-step4', WizardStep4);
