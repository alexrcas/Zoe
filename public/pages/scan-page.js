import {LitElement, html, css} from 'https://unpkg.com/lit@3.2.0/index.js?module';
import {BrowserMultiFormatReader} from 'https://cdn.jsdelivr.net/npm/@zxing/library@0.21.3/+esm'
import {ApiService} from '../components/ApiService.js';
import {Dao} from '../components/Dao.js';

export class ScanPage extends LitElement {

    constructor() {
        super();
        this.lecturas = 0;
        this.codeReader = new BrowserMultiFormatReader();
        this.scannedCode = '';
        this.product = {};
        this.bsModal = null;
        this.grams = 100;
        this.displayValues = {};
        this.dao = new Dao();
        this.apiService = new ApiService();
    }

    createRenderRoot() {
        return this;
    }

    async firstUpdated() {
        this.modalElement = this.querySelector('#scanModal');
        this.bsModal = new bootstrap.Modal(this.modalElement, {backdrop: 'static'});
        this.startScanner();
    }


    disconnectedCallback() {
        super.disconnectedCallback();
        this.codeReader.reset();
    }


    async startScanner() {

        const constraints = {
            video: {
                facingMode: 'environment', // cámara trasera
                width: {ideal: 1920},
                height: {ideal: 1080},
                focusMode: 'continuous',   // no todos los navegadores lo soportan
            }
        };

        const videoElement = this.querySelector('video');
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElement.srcObject = stream;
        await videoElement.play();

        const [videoTrack] = stream.getVideoTracks();

        // Aplicamos zoom si el dispositivo lo soporta
        if (videoTrack.getCapabilities().zoom) {
            try {
                await videoTrack.applyConstraints({advanced: [{zoom: 2.0}]});
            } catch (err) {
            }
        }

        let lastCode = null;
        let consecutiveCount = 0;
        const requiredReads = 3;

        // Inicia el scanner continuo
        this.codeReader.decodeFromVideoDevice(undefined, videoElement, (result, err) => {
            if (err) {
                return;
            }

            const code = result.text;
            this.lecturas++;

            if (code === lastCode) {
                consecutiveCount++;
            } else {
                lastCode = code;
                consecutiveCount = 1;
            }

            if (consecutiveCount >= requiredReads) {
                this.onDetection(code);
                this.codeReader.reset();
            }
        });
    }


    async onDetection(code) {
        this.scannedCode = code;
        await this.fetchInfo(code);
        this.requestUpdate();
        this.bsModal.show();
    }


    async fetchInfo(code) {

        const localProduct = await this.dao.findProductByBarcode(code);
        if (localProduct) {
            this.product = localProduct;
            this.updateValues(this.grams);
            return;
        }

        const apiProduct = await this.apiService.findByBarcode(code);
        if (!apiProduct) {
            return;
        }
        this.product = apiProduct;
        this.updateValues(this.grams);
    }


    async addEntry() {
        const entry = {
            name: this.product.name,
            grams: this.grams,
            code: this.scannedCode,
            nutriments: {
                kcals: this.displayValues.kcals,
                proteins: this.displayValues.proteins,
                carbs: this.displayValues.carbs,
                fats: this.displayValues.fats
            }
        }
        await this.dao.saveEntry(entry);
        await this.dao.saveProduct(this.product)
        this.bsModal.hide();
        window.location.hash = '#home';
    }


    updateValues(grams) {
        this.grams = grams;

        const factor = this.grams / 100; // factor de escala

        this.displayValues = {
            kcals: (this.product.nutriments.kcals * factor).toFixed(1),
            proteins: (this.product.nutriments.proteins * factor).toFixed(1),
            carbs: (this.product.nutriments.carbs * factor).toFixed(1),
            fats: (this.product.nutriments.fats * factor).toFixed(1)
        };

        this.requestUpdate();
    }


    render() {
        return html`
            
            <div class="container" style="height:100%; background: black">
                
            
                <div class="scanner-container" style="padding-top: 50%">
                    <video autoplay muted playsinline></video>
                </div>
    
                <div class="modal fade" id="scanModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Código Escaneado</h5>
                                <button type="button" class="btn-close" @click=${() => this.bsModal.hide()}></button>
                            </div>
    
                            <div class="modal-body">
                                <p class="fw-semibold">${this.product.name}</p>
    
                                <div class="nutrient-values">
                                    <span>${this.displayValues.kcals || 0} kcals</span>
                                    <span>${this.displayValues.proteins || 0} P</span>
                                    <span>${this.displayValues.carbs || 0} Ch</span>
                                    <span>${this.displayValues.fats || 0} G</span>
                                </div>
    
                                <input type="number" inputmode="numeric" pattern="[0-9]*" placeholder="Cantidad en gramos"
                                       value=${this.grams} @input=${e => {
                                    this.updateValues(e.target.value)
                                }}/>
    
                                <p>Cantidad: <span>${this.grams || 0}</span> g</p>
    
                            </div>
    
                            <div class="modal-footer">
                                <button class="btn btn-success" @click=${() => this.addEntry()}>Añadir</button>
                                <button class="btn btn-secondary" @click=${() => {
                                    this.bsModal.hide();
                                    window.location.hash = '#home'
                                }}>Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('scan-page', ScanPage);
