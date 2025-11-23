import { LitElement, html } from 'lit';
import { Dao } from '../components/Dao';

declare const bootstrap: any;

class ProfilePage extends LitElement {
  dao: Dao;
  toastEl: HTMLElement | null;
  toast: any;
  saveButtonDisabled: boolean;
  values: { proteins: number; carbs: number; fats: number };
  percents: { proteins: number; carbs: number; fats: number };
  kcals: number;

  static properties = {
    saveButtonDisabled: { type: Boolean },
    values: { type: Object },
    percents: { type: Object },
    kcals: { type: Number }
  };

  createRenderRoot() {
    return this;
  }

  constructor() {
    super();
    this.dao = Dao.getInstance();
    this.toastEl = null;
    this.toast = null;
    this.saveButtonDisabled = true;

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
    this.toastEl = this.querySelector('#liveToast');
    if (this.toastEl) {
      this.toast = new bootstrap.Toast(this.toastEl, {
        autohide: true,   // se oculta automáticamente
        delay: 1500       // tiempo en ms antes de ocultarse
      });
    }
    const goals = await this.dao.getUserGoals();
    if (goals) {
      this.values.proteins = goals.proteins || 0;
      this.values.carbs = goals.carbs || 0;
      this.values.fats = goals.fats || 0;
      this.kcals = goals.kcals || 0;
    }

    this.updatePercents();
    this.requestUpdate();
  }

  /** Actualiza kcal totales y porcentajes cuando cambian los gramos */
  updateValues(value: string, key: 'proteins' | 'carbs' | 'fats') {
    this.values[key] = Number(value) || 0;
    this.kcals = (this.values.proteins * 4) + (this.values.carbs * 4) + (this.values.fats * 9);
    this.updatePercents();
    this.saveButtonDisabled = false;
    this.requestUpdate();
  }

  /** Actualiza gramos y kcals cuando cambian los porcentajes */
  updatePercentsValues(value: string, key: 'proteins' | 'carbs' | 'fats' | 'none') {
    if (key !== 'none') {
      this.percents[key] = Number(value) || 0;
    }

    const totalPercent = this.percents.proteins + this.percents.carbs + this.percents.fats;
    if (totalPercent === 0 || this.kcals === 0) return;

    // Recalcular gramos en base al % y kcals totales
    this.values.proteins = Math.round((this.kcals * (this.percents.proteins / 100)) / 4);
    this.values.carbs = Math.round((this.kcals * (this.percents.carbs / 100)) / 4);
    this.values.fats = Math.round((this.kcals * (this.percents.fats / 100)) / 9);
    this.saveButtonDisabled = false;
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
      this.percents = { proteins: 0, carbs: 0, fats: 0 };
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
    this.toast.show();
    this.toastEl?.addEventListener('click', () => this.toast.hide());
    this.saveButtonDisabled = true;
    this.requestUpdate();
  }

  render() {
    return html`
<div class="container py-3" style="max-width: 420px;">
  <!-- Encabezado -->
  <h6 class="text-center fw-semibold mb-3 text-secondary">Tu plan</h6>

  <!-- Card principal -->
  <div class="card shadow-sm border-0 rounded-4 p-3">
    <div class="d-flex flex-column align-items-center">

      <!-- Tabs -->
      <ul class="nav nav-pills nav-fill mb-3 w-100 bg-light rounded-3 p-1" id="formToggle" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class="nav-link active rounded-3 py-2 small"
            id="macros-tab"
            data-bs-toggle="pill"
            data-bs-target="#macros"
            type="button"
            role="tab"
            style="font-size: 0.88em; font-weight: 500"
          >
            Usar gramos
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link rounded-3 py-2 small"
            id="kcals-tab"
            data-bs-toggle="pill"
            data-bs-target="#kcals"
            type="button"
            role="tab"
            style="font-size: 0.88em; font-weight: 500"
          >
            Usar porcentajes
          </button>
        </li>
      </ul>

      <!-- Contenido -->
      <div class="tab-content w-100" id="formToggleContent">

        <!-- Formulario 1 -->
        <div class="tab-pane fade show active" id="macros" role="tabpanel">
          <div class="d-flex flex-column align-items-center">

            <!-- Proteínas -->
            <div class="form-floating mb-3 w-100">
              <input
                id="proteins"
                class="form-control form-control-sm"
                type="number"
                inputmode="numeric"
                pattern="[0-9]*"
                placeholder="Proteínas"
                .value=${this.values.proteins}
                @input=${(e: any) => this.updateValues(e.target.value, 'proteins')}
              />
              <label for="proteins">Proteínas (g)</label>
            </div>

            <!-- Carbohidratos -->
            <div class="form-floating mb-3 w-100">
              <input
                id="carbs"
                class="form-control form-control-sm"
                type="number"
                inputmode="numeric"
                pattern="[0-9]*"
                placeholder="Carbohidratos"
                .value=${this.values.carbs}
                @input=${(e: any) => this.updateValues(e.target.value, 'carbs')}
              />
              <label for="carbs">Carbohidratos (g)</label>
            </div>

            <!-- Grasas -->
            <div class="form-floating mb-3 w-100">
              <input
                id="fats"
                class="form-control form-control-sm"
                type="number"
                inputmode="numeric"
                pattern="[0-9]*"
                placeholder="Grasas"
                .value=${this.values.fats}
                @input=${(e: any) => this.updateValues(e.target.value, 'fats')}
              />
              <label for="fats">Grasas (g)</label>
            </div>

            <!-- Calorías -->
            <h5 class="mt-1 text-secondary fw-semibold">${this.kcals} Kcals</h5>
          </div>
        </div>

        <!-- Formulario 2 -->
        <div class="tab-pane fade" id="kcals" role="tabpanel">
          <div class="d-flex flex-column align-items-center">

            <!-- Calorías totales -->
            <div class="form-floating mb-3 w-100">
              <input
                id="kcalsInput"
                class="form-control form-control-sm"
                type="number"
                inputmode="numeric"
                pattern="[0-9]*"
                placeholder="Calorías totales"
                .value=${this.kcals}
                @input=${(e: any) => {
        this.kcals = Number(e.target.value) || 0;
        this.updatePercentsValues('0', 'none');
      }}
              />
              <label for="kcalsInput">Calorías totales (Kcals)</label>
            </div>

            <!-- Proteínas -->
            <div class="form-floating mb-3 w-100">
              <input
                id="proteinsPercent"
                class="form-control form-control-sm"
                type="number"
                inputmode="numeric"
                pattern="[0-9]*"
                placeholder="Proteínas"
                .value=${this.percents.proteins}
                @input=${(e: any) => this.updatePercentsValues(e.target.value, 'proteins')}
              />
              <label for="proteinsPercent">Proteínas (%)</label>
            </div>

            <!-- Carbohidratos -->
            <div class="form-floating mb-3 w-100">
              <input
                id="carbsPercent"
                class="form-control form-control-sm"
                type="number"
                inputmode="numeric"
                pattern="[0-9]*"
                placeholder="Carbohidratos"
                .value=${this.percents.carbs}
                @input=${(e: any) => this.updatePercentsValues(e.target.value, 'carbs')}
              />
              <label for="carbsPercent">Carbohidratos (%)</label>
            </div>

            <!-- Grasas -->
            <div class="form-floating mb-3 w-100">
              <input
                id="fatsPercent"
                class="form-control form-control-sm"
                type="number"
                inputmode="numeric"
                pattern="[0-9]*"
                placeholder="Grasas"
                .value=${this.percents.fats}
                @input=${(e: any) => this.updatePercentsValues(e.target.value, 'fats')}
              />
              <label for="fatsPercent">Grasas (%)</label>
            </div>
          </div>
        </div>
      </div>

      <!-- Botones -->
      <div class="mt-1 mb-3 d-flex justify-content-center w-100">
        <button
          @click=${this.saveValues}
          class="btn btn-primary btn-sm w-50 ms-1 rounded-3 shadow-sm"
          ?disabled="${this.saveButtonDisabled}"
        >
          Guardar
        </button>
      </div>

        <button
                class="btn btn-outline-secondary btn-borderless btn-sm w-100 rounded-3"
                @click="${() => window.location.hash = '#wizard'}"
        >
            ¿No sabes qué poner? <strong>Usa el Asistente</strong> <i class="fa-regular fa-lightbulb me-2"></i>
        </button>

    </div>
  </div>
</div>

<div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div id="liveToast" class="toast align-items-center text-white bg-primary border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
            <div class="toast-body text-center">
                ¡Guardado!
            </div>
        </div>
    </div>
</div>

        `;
  }
}

customElements.define('profile-page', ProfilePage);
