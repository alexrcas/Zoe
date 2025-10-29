import {LitElement, html} from 'https://unpkg.com/lit@3.2.0/index.js?module';
import {Dao} from '../../components/Dao.js'

export class WizardStep1 extends LitElement {

    constructor() {
        super();
        this.dao = new Dao();
        this.genre = '';
        this.age = '';
        this.height = '';
        this.weight = '';
        this.activity = '';
        this.buttonDisabled = true;
    }

    createRenderRoot() {
        return this; // usar el DOM global (Bootstrap)
    }

    handleInput(e, field) {
        this[field] = e.target.value;
        this.buttonDisabled = !(this.genre && this.age && this.height && this.weight && this.activity);
        this.requestUpdate();
    }

    async goToStep2() {

        const userData = {
            genre: this.genre,
            weight: this.weight,
            age: this.age,
            height: this.height,
            activity: this.activity
        }

        await this.dao.saveOrUpdateUserData(userData);

        this.dispatchEvent(
            new CustomEvent('next-step', {
                detail: { step: 2 },
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
    <form class="d-flex flex-column px-2">

      <!-- Sexo -->
      <div class="form-floating mb-3">
        <select
          id="sexo"
          class="form-select"
          @change=${e => this.handleInput(e, 'genre')}
        >
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
          .value=${this.age}
          @input=${e => this.handleInput(e, 'age')}
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
          .value=${this.height}
          @input=${e => this.handleInput(e, 'height')}
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
          .value=${this.weight}
          @input=${e => this.handleInput(e, 'weight')}
        />
        <label for="peso">Peso (kg)</label>
      </div>

      <!-- Nivel de actividad -->
      <div class="form-floating mb-3">
        <select
          id="actividad"
          class="form-select"
          @change=${e => this.handleInput(e, 'activity')}
        >
          <option selected disabled value="">Selecciona nivel de actividad</option>
          <option value="0">Sedentario: poco o nada de ejercicio</option>
          <option value="1">Ligero: ejercicio ligero 1-3 veces/semana</option>
          <option value="2">Moderado: ejercicio moderado 3-5 veces/semana</option>
          <option value="3">Intenso: ejercicio intenso 6-7 veces/semana</option>
          <option value="4">Muy intenso: trabajo físico intenso diario o deportista élite</option>
        </select>
        <label for="actividad">Nivel de actividad física</label>
      </div>

      <!-- Botón siguiente -->
      <div class="d-flex justify-content-end mt-3">
        <button
          class="btn btn-primary rounded-3 shadow-sm px-4"
          @click=${this.goToStep2}
          ?disabled="${this.buttonDisabled}"
        >
          Siguiente
        </button>
      </div>

    </form>
  </div>
</div>

        `;
    }
}

customElements.define('wizard-step1', WizardStep1);
