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
        this.goals = {};
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
        this.goals = await this.dao.getUserGoals();
        this.requestUpdate();
    }


    render() {
        return html`



            <div class="accordion accordion-flush" id="accordionFlushExample">
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed px-2 py-0 pe-3" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">

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
                            
                        </button>
                    </h2>
                    <div id="flush-collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                        <div class="accordion-body">


                                <!-- KCALS -->
                            <div style="font-size: 0.8em">
                                <div class="mb-3">
                                    <div class="d-flex justify-content-between align-items-center mb-1">
                                        <small class="fw-semibold text-secondary">Kcals</small>
                                        <small class="fw-semibold text-secondary">${this.kcals} / ${this.goals.kcals}</small>
                                    </div>
                                    <div class="progress rounded-pill" style="height: 0.3em; background-color: #f0f0f0;">
                                        <div class="progress-bar bg-primary rounded-pill" style="width: ${Math.round((this.kcals / this.goals.kcals) * 100)}%; transition: width 0.4s ease;"></div>
                                    </div>
                                </div>

                                <!-- PROTEÍNAS -->
                                <div class="mb-3">
                                    <div class="d-flex justify-content-between align-items-center mb-1">
                                        <small class="fw-semibold text-secondary">Prot.</small>
                                        <small class="fw-semibold text-secondary">${this.proteins} / ${this.goals.proteins} grs.</small>
                                    </div>
                                    <div class="progress rounded-pill" style="height: 0.3em; background-color: #f0f0f0;">
                                        <div class="progress-bar bg-danger rounded-pill" style="width: ${Math.round((this.proteins / this.goals.proteins) * 100)}%; transition: width 0.4s ease;"></div>
                                    </div>
                                </div>

                                <!-- CARBOHIDRATOS -->
                                <div class="mb-3">
                                    <div class="d-flex justify-content-between align-items-center mb-1">
                                        <small class="fw-semibold text-secondary">Carb.</small>
                                        <small class="fw-semibold text-secondary">${this.carbs} / ${this.goals.carbs} grs.</small>
                                    </div>
                                    <div class="progress rounded-pill" style="height: 0.3em; background-color: #f0f0f0;">
                                        <div class="progress-bar bg-success rounded-pill" style="width: ${Math.round((this.carbs / this.goals.carbs) * 100)}%; transition: width 0.4s ease;"></div>
                                    </div>
                                </div>

                                <!-- GRASAS -->
                                <div>
                                    <div class="d-flex justify-content-between align-items-center mb-1">
                                        <small class="fw-semibold text-secondary">Grasas</small>
                                        <small class="fw-semibold text-secondary">${this.fats} / ${this.goals.fats} grs.</small>
                                    </div>
                                    <div class="progress rounded-pill" style="height: 0.3em; background-color: #f0f0f0;">
                                        <div class="progress-bar bg-warning rounded-pill" style="width: ${Math.round((this.fats / this.goals.fats) * 100)}%; transition: width 0.4s ease;"></div>
                                    </div>
                                </div>
                            </div>
                            
                            
                        </div>
                    </div>
                </div>
            </div>
            
            
            
            
            



        `;
    }
}

customElements.define('summary-component', SummaryComponent);
