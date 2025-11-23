import { LitElement, html } from 'lit';
import { BrowserMultiFormatReader } from '@zxing/library';
import { ApiService } from './ApiService';
import { Dao } from './Dao';

export class ScanComponent extends LitElement {
    lecturas: number;
    stream: MediaStream | null;
    codeReader: BrowserMultiFormatReader | null;
    scannedCode: string;
    grams: number;
    dao: Dao;
    apiService: ApiService;

    constructor() {
        super();
        this.lecturas = 0;
        this.stream = null;
        this.codeReader = new BrowserMultiFormatReader();
        this.scannedCode = '';
        this.grams = 100;
        this.dao = Dao.getInstance();
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
    }


    async startScanner() {

        if (this.stream) {
            this.stopScanner();
        }

        const constraints = {
            video: {
                facingMode: 'environment', // cámara trasera
                width: { ideal: 1920 },
                height: { ideal: 1080 },
                focusMode: 'continuous',   // no todos los navegadores lo soportan
            }
        };

        const videoElement = this.querySelector('video');
        if (!videoElement) return;
        this.stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElement.srcObject = this.stream;
        await videoElement.play();

        const [videoTrack] = this.stream.getVideoTracks();

        // Aplicamos zoom si el dispositivo lo soporta
        const capabilities = videoTrack.getCapabilities() as any;
        if (capabilities.zoom) {
            try {
                await videoTrack.applyConstraints({ advanced: [{ zoom: 2.0 } as any] });
            } catch (err) {
            }
        }

        let lastCode: string | null = null;
        let consecutiveCount = 0;
        const requiredReads = 3;

        // Inicia el scanner continuo
        if (this.codeReader) {
            this.codeReader.decodeFromVideoDevice(null, videoElement, (result: any, err: any) => {
                if (err) {
                    return;
                }
                if (!result) return;

                const code = result.getText();
                this.lecturas++;

                if (code === lastCode) {
                    consecutiveCount++;
                } else {
                    lastCode = code;
                    consecutiveCount = 1;
                }

                if (consecutiveCount >= requiredReads) {
                    this.onDetection(code);
                    if (this.codeReader) this.codeReader.reset();
                }
            });
        }
    }

    async onDetection(code: string) {
        this.scannedCode = code;
        await this.fetchInfo(code);
        this.requestUpdate();
    }


    async fetchInfo(code: string) {
        this.stopScanner();
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
            this.dispatchEvent(
                new CustomEvent('product-scanned', {
                    detail: null,
                    bubbles: true,
                    composed: true
                })
            );
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


    stopScanner() {
        if (this.codeReader) {
            this.codeReader.reset();
            this.codeReader = null;
        }

        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }

        const videoElement = this.querySelector('video');
        if (videoElement) {
            videoElement.srcObject = null;
        }
    }


    render() {
        return html`

            <div class="scanner-overlay">
                <div class="scanner-box">
                    <!-- Botón cerrar -->
                    <button class="close-btn" @click=${() => { this.stopScanner(); this.dispatchEvent(new CustomEvent('close-scanner')) }}>✕</button>

                    <!-- Mensaje -->
                    <div class="text-secondary mb-1" style="font-weight: 300; font-size: 0.9em">Acerca un código de barras</div>

                    <!-- Video del scanner -->
                    <div class="scanner-container">
                        <video autoplay muted playsinline></video>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('scan-component', ScanComponent);
