import { LitElement, html, css } from 'https://unpkg.com/lit@3.2.0/index.js?module';
import { Dao } from '../components/Dao.js';

export class HomePage extends LitElement {

    constructor() {
        super();
        this.meals = [];
        this.dao = new Dao();
        this.total = {
            kcals: 0,
            proteins: 0,
            carbs: 0,
            fats: 0
        }
    }

    createRenderRoot() { return this; }

    async firstUpdated() {

        this.meals = await this.dao.listEntries();

        this.meals.forEach(meal => {
            this.total.kcals += Math.round(meal.nutriments.kcals);
            this.total.proteins += Math.round(meal.nutriments.proteins);
            this.total.carbs += Math.round(meal.nutriments.carbs);
            this.total.fats += Math.round(meal.nutriments.fats);
        });

        this.requestUpdate();
    }

    render() {
        return html`
      <div class="container">
        <div class="card mt-2">
            <div class="card-body d-flex py-0">
            <table class="nutrient-table">
      <thead>
        <tr>
          <th>kcals</th>
          <th>P</th>
          <th>Ch</th>
          <th>G</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${this.total.kcals}</td>
          <td>${this.total.proteins}</td>
          <td>${this.total.carbs}</td>
          <td>${this.total.fats}</td>
        </tr>
      </tbody>
    </table>
            </div>
        </div>

${this.meals.map(
  meal => html`
    <div class="meal-item py-2 border-bottom">
      <!-- Fila 1: nombre -->
      <div class="meal-name fw-medium text-body mb-1">
        ${meal.name} - ${meal.grams} grs.
      </div>

      <!-- Fila 2: tabla de valores compacta -->
      <table class="meal-values">
        <tbody>
          <tr>
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
            <button @click=${() => window.location.hash = '#recents'} class="btn btn-primary">+</button>
        </div>

      </div>
    `;
    }
}

customElements.define('home-page', HomePage);
