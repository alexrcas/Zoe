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
                <div class="d-flex justify-content-center flex-column align-items-center">
                    
                <div class="input-group input-group-sm pb-2" style="width: 40%">
                    <input class="form-control" type="number" inputmode="numeric" pattern="[0-9]*"
                           placeholder="Proteínas"
                           value=${this.values.proteins} @input=${e => {
                        this.updateValues(e.target.value, 'proteins');
                    }}/>
                    <span class="input-group-text">grs.</span>
                </div>

                <div class="input-group input-group-sm pb-2" style="width: 40%">
                    <input class="form-control" type="number" inputmode="numeric" pattern="[0-9]*"
                           placeholder="Carbohidratos"
                           value=${this.values.carbs} @input=${e => {
                        this.updateValues(e.target.value, 'carbs');
                    }}/>
                    <span class="input-group-text">grs.</span>
                </div>

                <div class="input-group input-group-sm pb-2" style="width: 40%">
                    <input class="form-control" type="number" inputmode="numeric" pattern="[0-9]*"
                           placeholder="Grasas"
                           value=${this.values.fats} @input=${e => {
                        this.updateValues(e.target.value, 'fats');
                    }}/>
                    <span class="input-group-text">grs.</span>
                </div>
                    
                    <h4>${this.kcals} Kcals</h4>
                    
                    <button @click="${this.saveValues}" class="btn btn-primary mt-3">Guardar</button>
                    
                </div>
            </div>
            
        `

    }

}

customElements.define('profile-page', ProfilePage);