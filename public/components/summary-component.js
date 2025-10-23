import {LitElement, html, css} from 'https://unpkg.com/lit@3.2.0/index.js?module';
import {Dao} from './Dao.js';

export class SummaryComponent extends LitElement {

    constructor() {
        super();
        this.dao = new Dao();
        this.kcals = 0;
        this.proteins = 0;
        this.carbs = 0;
        this.fats = 0;
    }

    createRenderRoot() {
        return this;
    }

    async firstUpdated() {
        this.entries = await this.dao.listEntries();
        this.entries.forEach(entry => {
            this.kcals += Math.round(entry.nutriments.kcals);
            this.proteins += Math.round(entry.nutriments.proteins);
            this.carbs += Math.round(entry.nutriments.carbs);
            this.fats += Math.round(entry.nutriments.fats);
        });
        this.requestUpdate();
    }


    render() {
        return html`

            <div class="list-group mb-1">
                <a href="#" class="list-group-item list-group-item-action d-flex flex-column py-2"
                   aria-current="true">
                    <div class="d-flex w-100 justify-content-between align-items-start">
                        <div>
                            <h6 style="font-weight: 400; font-size: 0.80em">Total</h6>
                        </div>
                    </div>

                    <table class="meal-values w-100">
                        <tbody>
                        <tr>
                            <td><strong style="font-weight: 400">${this.kcals}</strong> kcals</td>
                            <td><strong style="font-weight: 400">${this.proteins}</strong> Prot.</td>
                            <td><strong style="font-weight: 400">${this.carbs}</strong> Carb.</td>
                            <td><strong style="font-weight: 400">${this.fats}</strong> Grasas</td>
                        </tr>
                        </tbody>
                    </table>
                </a>
            </div>

        `;
    }
}

customElements.define('summary-component', SummaryComponent);
