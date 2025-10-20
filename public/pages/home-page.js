import { LitElement, html, css } from 'https://unpkg.com/lit@3.2.0/index.js?module';
import { openDB } from 'https://unpkg.com/idb?module';
import { MealDao } from '../components/MealDao.js'; 

export class HomePage extends LitElement {

    constructor() {
        super();
        this.meals = [];
        this.mealDao = new MealDao();
        this.total = {
            kcal: 0,
            proteins: 0,
            carbs: 0,
            fats: 0
        }
    }

    createRenderRoot() { return this; }

    async firstUpdated() {
        this.db = await openDB('scanDB', 1, {
            upgrade(db) {
                db.createObjectStore('dailyMeals', { keyPath: 'id', autoIncrement: true });
            }
        });

        this.meals = await this.mealDao.listDailyMeals();

        this.meals.forEach(meal => {
            this.total.kcal += Math.round(meal.nutriments.kcal);
            this.total.proteins += Math.round(meal.nutriments.proteins);
            this.total.carbs += Math.round(meal.nutriments.carbs);
            this.total.fats += Math.round(meal.nutriments.fats);
        });

        this.requestUpdate();
    }

    render() {
        return html`
      <div class="container">
        <div class="card" style="margin-top: 10dvh">
            <div class="card-body d-flex py-0">
            <table class="nutrient-table">
      <thead>
        <tr>
          <th>Kcal</th>
          <th>P</th>
          <th>Ch</th>
          <th>G</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${this.total.kcal}</td>
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
        ${meal.name}
      </div>

      <!-- Fila 2: tabla de valores compacta -->
      <table class="meal-values">
        <tbody>
          <tr>
            <td><strong>${Math.round(meal.nutriments.kcal)}</strong> kcal</td>
            <td><strong>${Math.round(meal.nutriments.proteins)}</strong> P</td>
            <td><strong>${Math.round(meal.nutriments.carbs)}</strong> Ch</td>
            <td><strong>${Math.round(meal.nutriments.fats)}</strong> G</td>
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
    `;
    }
}

customElements.define('home-page', HomePage);
