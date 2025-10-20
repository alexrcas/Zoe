import { LitElement, html, css } from 'https://unpkg.com/lit@3.2.0/index.js?module';
import { Dao } from '../components/Dao.js';


export class RecentsPage extends LitElement {

    constructor() {
        super();
        this.dao = new Dao();
        this.meals = [];
        this.displayValues = {};
        this.bsModal = null;
        this.grams = 100;
        this.selectedProduct = {};
    }

    createRenderRoot() { return this; }

    async firstUpdated() {
        this.meals = await this.dao.listProducts();
        this.modalElement = this.querySelector('#recentsModal');
        this.bsModal = new bootstrap.Modal(this.modalElement, { backdrop: 'static' });
        this.requestUpdate();
    }

    onSelect(product) {
        this.selectedProduct = product;
        this.updateValues(this.grams);
        this.requestUpdate();
        this.bsModal.show();
    }


    updateValues(grams) {
        this.grams = grams;
        const factor = this.grams / 100; // factor de escala

        this.displayValues = {
            kcals: (this.selectedProduct.nutriments.kcals * factor).toFixed(1),
            proteins: (this.selectedProduct.nutriments.proteins * factor).toFixed(1),
            carbs: (this.selectedProduct.nutriments.carbs * factor).toFixed(1),
            fats: (this.selectedProduct.nutriments.fats * factor).toFixed(1)
        };

        this.requestUpdate();
    }


    async addEntry() {
        const entry = {
            name: this.selectedProduct.name,
            grams: this.grams,
            code: this.selectedProduct.code,
            nutriments: {
                kcals: this.displayValues.kcals,
                proteins: this.displayValues.proteins,
                carbs: this.displayValues.carbs,
                fats: this.displayValues.fats
            }
        }
        await this.dao.saveEntry(entry);
        this.bsModal.hide();
        window.location.hash = '#home';
    }


    render() {
        return html`
      <div class="container">

${this.meals.map(
            meal => html`
    <div class="meal-item py-2 border-bottom">
      <!-- Fila 1: nombre -->
      <div class="meal-name fw-medium text-body mb-1">
        ${meal.name}
      </div>

      <!-- Fila 2: tabla de valores compacta -->
      <table class="meal-values">
        <tbody>
          <tr @click="${() => this.onSelect(meal)}">
            <td><strong>${meal.nutriments.kcals}</strong> kcals</td>
            <td><strong>${meal.nutriments.proteins}</strong> P</td>
            <td><strong>${meal.nutriments.carbs}</strong> Ch</td>
            <td><strong>${meal.nutriments.fats}</strong> G</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
        )}

        <div class="d-flex justify-content-center pt-2 pb-2">
            <button @click=${() => window.location.hash = '#scan'} class="btn btn-primary">+</button>
        </div>

      </div>



      <div class="modal fade" id="recentsModal" tabindex="-1">
          <div class="modal-dialog">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title">Código Escaneado</h5>
                      <button type="button" class="btn-close" @click=${() => this.bsModal.hide()}></button>
                  </div>

                  <div class="modal-body">
                      <p class="fw-semibold">${this.selectedProduct.name}</p>

                      <div class="nutrient-values">
                          <span>${this.displayValues.kcals || 0} kcals</span>
                          <span>${this.displayValues.proteins || 0} P</span>
                          <span>${this.displayValues.carbs || 0} Ch</span>
                          <span>${this.displayValues.fats || 0} G</span>
                      </div>

                      <input type="number" inputmode="numeric" pattern="[0-9]*" placeholder="Cantidad en gramos" value=${this.grams} @input=${e => {this.updateValues(e.target.value)}} />

                      <p>Cantidad: <span>${this.grams || 0}</span> g</p>

                  </div>

                  <div class="modal-footer">
                      <button class="btn btn-success" @click=${() => this.addEntry()}>Añadir</button>
                      <button class="btn btn-secondary" @click=${() => { this.bsModal.hide() }}>Cerrar</button>
                  </div>
              </div>
          </div>
      </div>
    `;
    }




}

customElements.define('recents-page', RecentsPage);
