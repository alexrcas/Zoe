import {LitElement, html, css} from 'https://unpkg.com/lit@3.2.0/index.js?module';
import {Dao} from '../components/Dao.js';

class ProfilePage extends LitElement {

    createRenderRoot() { return this; }

    constructor() {
        super();
        this.dao = new Dao();
        this.values = {
            proteins: 0,
            carbs: 0,
            fats: 0,
        }
        this.kcals = 0;
    }


    async firstUpdated() {
        const goals = await this.dao.getUserGoals();
        this.values.proteins = goals.proteins;
        this.values.carbs = goals.carbs;
        this.values.fats = goals.fats;
        this.kcals = goals.kcals;
        this.requestUpdate();
    }


    updateValues(value, key) {
        this.values[key] = value;
        this.kcals = (this.values.proteins * 4) + (this.values.carbs * 4) + (this.values.fats * 9);
        this.requestUpdate();
    }

    async saveValues() {
        const goals = {
            kcals: this.kcals,
            carbs: this.values.carbs,
            fats: this.values.fats,
            proteins: this.values.proteins
        };
        await this.dao.saveOrUpdateUserGoals(goals)
    }


    render() {

        return html`

            <div class="container">
                <h5 class="pt-2 pb-0 mb-0">Perfil</h5>
            </div>
            
            <div class="container ">

                <div class="d-flex flex-column align-items-center px-3 py-2">

<div class="d-flex flex-column align-items-center px-3 py-2">

  <!-- Proteínas -->
  <div class="form-floating mb-3 w-75">
    <input id="proteins" class="form-control pe-5" type="number" inputmode="numeric" pattern="[0-9]*"
           placeholder="Proteínas"
           value=${this.values.proteins} 
           @input=${e => this.updateValues(e.target.value, 'proteins')} />
    <label for="proteins">Proteínas</label>
    <span class="position-absolute top-50 end-0 translate-middle-y pe-3 text-muted">grs.</span>
  </div>

  <!-- Carbohidratos -->
  <div class="form-floating mb-3 w-75">
    <input id="carbs" class="form-control pe-5" type="number" inputmode="numeric" pattern="[0-9]*"
           placeholder="Carbohidratos"
           value=${this.values.carbs} 
           @input=${e => this.updateValues(e.target.value, 'carbs')} />
    <label for="carbs">Carbohidratos</label>
    <span class="position-absolute top-50 end-0 translate-middle-y pe-3 text-muted">grs.</span>
  </div>

  <!-- Grasas -->
  <div class="form-floating mb-3 w-75">
    <input id="fats" class="form-control pe-5" type="number" inputmode="numeric" pattern="[0-9]*"
           placeholder="Grasas"
           value=${this.values.fats} 
           @input=${e => this.updateValues(e.target.value, 'fats')} />
    <label for="fats">Grasas</label>
    <span class="position-absolute top-50 end-0 translate-middle-y pe-3 text-muted">grs.</span>
  </div>

  <!-- Calorías -->
  <h4 class="mt-2">${this.kcals} Kcals</h4>

  <!-- Botón -->
  <button @click="${this.saveValues}" class="btn btn-primary mt-3 w-100 w-md-50">Guardar</button>

</div>


            </div>
            
        `

    }

}

customElements.define('profile-page', ProfilePage);