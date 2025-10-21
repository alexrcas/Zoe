import {LitElement, html, css} from 'https://unpkg.com/lit@3.2.0/index.js?module';
import {Dao} from '../components/Dao.js';

export class HomePage extends LitElement {

    constructor() {
        super();
        this.entries = [];
        this.dao = new Dao();
        this.total = {
            kcals: 0,
            proteins: 0,
            carbs: 0,
            fats: 0
        }
    }

    createRenderRoot() {
        return this;
    }

    async firstUpdated() {

        this.entries = await this.dao.listEntries();

        this.entries.forEach(entry => {
            this.total.kcals += Math.round(entry.nutriments.kcals);
            this.total.proteins += Math.round(entry.nutriments.proteins);
            this.total.carbs += Math.round(entry.nutriments.carbs);
            this.total.fats += Math.round(entry.nutriments.fats);
        });

        this.requestUpdate();
    }

    render() {
        return html`

            <div class="container">
<div class="list-group mt-2">
                <a href="#" class="list-group-item list-group-item-action d-flex flex-column py-2" aria-current="true">
                    <div class="d-flex w-100 justify-content-between align-items-start">
                        <div>
                            <h6 style="font-weight: 400; font-size: 0.80em">Recuento total</h6>
                        </div>
                    </div>

                    <table class="meal-values w-100">
                        <tbody>
                        <tr>
                            <td><strong style="font-weight: 400">${this.total.kcals}</strong> kcals</td>
                            <td><strong style="font-weight: 400">${this.total.proteins}</strong> Prot.</td>
                            <td><strong style="font-weight: 400">${this.total.carbs}</strong> Carb.</td>
                            <td><strong style="font-weight: 400">${this.total.fats}</strong> Grasas</td>
                        </tr>
                        </tbody>
                    </table>
                </a>
</div>
                
                <div class="list-group mt-2">

                ${this.entries.map(
                        entry => html`



                                <a href="#" class="list-group-item list-group-item-action d-flex flex-column py-2" aria-current="true">
                                    <div class="d-flex w-100 justify-content-between align-items-start">
                                        <div>
                                            <h6 style="font-weight: 400; font-size: 0.80em">${entry.name}</h6>
                                        </div>
                                        <small class="opacity-50 text-nowrap">${entry.grams} grs.</small>
                                    </div>

                                    <table class="meal-values w-100">
                                        <tbody>
                                        <tr>
                                            <td><strong style="font-weight: 400">${entry.nutriments.kcals}</strong> kcals</td>
                                            <td><strong style="font-weight: 400">${entry.nutriments.proteins}</strong> Prot.</td>
                                            <td><strong style="font-weight: 400">${entry.nutriments.carbs}</strong> Carb.</td>
                                            <td><strong style="font-weight: 400">${entry.nutriments.fats}</strong> Grasas</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </a>
                        `
                )}

                </div>
                <div class="d-flex justify-content-center pt-2 pb-2">
                    <button @click=${() => window.location.hash = '#recents'} class="btn btn-primary">+</button>
                </div>

            </div>
            </div>
        `;
    }
}

customElements.define('home-page', HomePage);
