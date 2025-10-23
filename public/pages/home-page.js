import {LitElement, html, css} from 'https://unpkg.com/lit@3.2.0/index.js?module';
import {Dao} from '../components/Dao.js';
import { SummaryComponent } from '../components/summary-component.js';
import { JournalService } from "../components/JournalService.js";

export class HomePage extends LitElement {

    constructor() {
        super();
        this.dao = new Dao();
        this.journalService = new JournalService();
        this.journal = [];
    }

    createRenderRoot() {
        return this;
    }

    async firstUpdated() {
        this.journal = await this.journalService.getJournal();
        this.requestUpdate();
    }

    render() {
        return html`

            <div class="container px-0">
                
                <summary-component></summary-component>
                
                    ${this.journal.map(
                            journalEntry => html`
                                
                                <div>
                                    <span class="badge rounded-pill text-bg-light text-secondary" style="font-weight: 600">${journalEntry.group}</span>
                                </div>
                                <div class="list-group list-group-flush my-2 striped-list">
                                    
                                
                                    ${journalEntry.entries.map(
                                        entry => html`
                                            
                                    <a href="#" class="list-group-item list-group-item-action d-flex flex-column py-1"
                                       aria-current="true">
                                        <div class="d-flex w-100 justify-content-between align-items-start">
                                            <div>
                                                <h6 style="font-weight: 400; font-size: 0.80em">${entry.name}</h6>
                                            </div>
                                            <small class="opacity-50 text-nowrap">${entry.grams} grs.</small>
                                        </div>
    
                                        <table class="meal-values w-100">
                                            <tbody>
                                            <tr>
                                                <td><strong style="font-weight: 400">${entry.nutriments.kcals}</strong>
                                                    kcals
                                                </td>
                                                <td><strong style="font-weight: 400">${entry.nutriments.proteins}</strong>
                                                    Prot.
                                                </td>
                                                <td><strong style="font-weight: 400">${entry.nutriments.carbs}</strong>
                                                    Carb.
                                                </td>
                                                <td><strong style="font-weight: 400">${entry.nutriments.fats}</strong>
                                                    Grasas
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </a>
                                            
                                    `)}
                                    
                                    <div class="d-flex justify-content-center pt-2">
                                        <a class="link-offset-2 link-underline link-underline-opacity-0"
                                           style="font-weight: 300; font-size: 0.80em"
                                           @click=${(e) => { e.preventDefault(); window.location.hash = `#recents?group=${journalEntry.group}`}}>Agregar alimento</a>
                                    </div>
                            `)}

                </div>

            </div>
            </div>
        `;
    }
}

customElements.define('home-page', HomePage);
