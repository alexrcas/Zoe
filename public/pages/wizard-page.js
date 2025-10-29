import {LitElement, html, css} from 'https://unpkg.com/lit@3.2.0/index.js?module';
import { WizardStep1 } from '../components/wizard/wizard-step1.js';
import { WizardStep2 } from '../components/wizard/wizard-step2.js';
import { WizardStep3 } from '../components/wizard/wizard-step3.js';
import { WizardStep4 } from '../components/wizard/wizard-step4.js';

export class WizardPage extends LitElement {

    static properties = {
        step: {type: Number}
    };

    constructor() {
        super();
        this.step = 1;
    }

    createRenderRoot() {
        return this; // usar el DOM global (Bootstrap)
    }

    handleNextStep(e) {
      this.step = e.detail.step;
        this.requestUpdate();
    }


    renderStepContent() {
        switch (this.step) {
            case 1:
                return html`<wizard-step1 @next-step="${this.handleNextStep}"></wizard-step1>`;
            case 2:
                return html`<wizard-step2 @next-step="${this.handleNextStep}"></wizard-step2>`;
            case 3:
                return html`<wizard-step3 @next-step="${this.handleNextStep}"></wizard-step3>`;
            case 4:
                return html`<wizard-step4 @next-step="${this.handleNextStep}"></wizard-step4>`;
            default:
                return html``;
        }
    }

    render() {
        return html`
      <div class="container py-2">
          
      ${this.step < 4 ? html`
        <div class="wizard-nav">
          <button class="wizard-step ${this.step === 1 ? 'active' : ''} ${this.step > 1 ? 'wizard-step-done' : ''}" disabled>
              Datos
          </button>
            <i class="fa-solid fa-arrow-right d-flex align-items-center text-secondary ${this.step > 1 ? 'wizard-step-done' : ''}"></i>
          <button class="wizard-step ${this.step === 2 ? 'active' : ''} ${this.step > 2 ? 'wizard-step-done' : ''}" disabled>
              Objetivos</button>
            <i class="fa-solid fa-arrow-right d-flex align-items-center text-secondary  ${this.step > 1 ? 'wizard-step-done' : ''}"></i>
          <button class="wizard-step ${this.step === 3 ? 'active' : ''}" disabled>Nutrientes</button>
        </div>
        ` : html``
        }

      </div>

        <!-- Contenido -->
        <div>
          ${this.renderStepContent()}
        </div>

    `;
    }

}

customElements.define('wizard-page', WizardPage);
