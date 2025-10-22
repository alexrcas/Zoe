import {LitElement, html, css} from 'https://unpkg.com/lit@3.2.0/index.js?module';
import {BrowserMultiFormatReader} from 'https://cdn.jsdelivr.net/npm/@zxing/library@0.21.3/+esm'
import {ApiService} from './ApiService.js';
import {Dao} from './Dao.js';

export class ScanComponent extends LitElement {

    constructor() {
        super();
        this.lecturas = 0;
        this.codeReader = new BrowserMultiFormatReader();
        this.scannedCode = '';
        this.grams = 100;
        this.dao = new Dao();
        this.apiService = new ApiService();
    }

    createRenderRoot() {
        return this;
    }

    async firstUpdated() {
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
    }


    async fetchInfo(code) {

        const localProduct = await this.dao.findProductByBarcode(code);
        if (localProduct) {
            this.dispatchEvent(
                new CustomEvent('product-scanned', {
                    detail: localProduct,
                    bubbles: true,
                    composed: true
                })
            );
            return;
        }

        const apiProduct = await this.apiService.findByBarcode(code);
        if (!apiProduct) {
            return;
        }

        this.dispatchEvent(
            new CustomEvent('product-scanned', {
                detail: apiProduct,
                bubbles: true,
                composed: true
            })
        );
    }



    render() {
        return html`
            
        <div class="scanner-container">
            <video autoplay muted playsinline style="border-radius: 5px"></video>
        </div>
        `;
    }
}

customElements.define('scan-component', ScanComponent);
