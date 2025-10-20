import { LitElement, html, css } from 'https://unpkg.com/lit@3.2.0/index.js?module';
import { BrowserMultiFormatReader } from 'https://cdn.jsdelivr.net/npm/@zxing/library@0.21.3/+esm'
import { MealDao } from '../components/MealDao.js'; 

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
    this.mealDao = new MealDao();
  }

  createRenderRoot() { return this; }

  async firstUpdated() {
    this.modalElement = this.querySelector('#scanModal');
    this.bsModal = new bootstrap.Modal(this.modalElement, { backdrop: 'static' });
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
        width: { ideal: 1920 },
        height: { ideal: 1080 },
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
        await videoTrack.applyConstraints({ advanced: [{ zoom: 2.0 }] });
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


    const response = await fetch(`https://world.openfoodfacts.net/api/v2/product/${code}.json`, {
      method: "GET"
    });

    const json = await response.json();
    if (json.status != 1) { return; }

    this.product = json.product;

  

    this.updateValues(this.grams);
  }


  async addMeal() {
    const meal = {
      name: this.product.product_name,
      nutriments: {
        kcal: this.displayValues.kcal,
        proteins: this.displayValues.proteins,
        carbs: this.displayValues.carbs,
        fats: this.displayValues.fats
      }
    }
    await this.mealDao.saveDailyMeal(meal);
    this.bsModal.hide();
    window.location.hash = '#home';
  }


  updateValues(grams) {
    this.grams = grams;

    const factor = this.grams / 100; // factor de escala

    this.displayValues = {
      kcal: (this.product.nutriments['energy-kcal_100g'] * factor).toFixed(1),
      proteins: (this.product.nutriments.proteins_100g * factor).toFixed(1),
      carbs: (this.product.nutriments.carbohydrates_100g * factor).toFixed(1),
      fats: (this.product.nutriments.fat_100g * factor).toFixed(1)
    };

    this.requestUpdate();
  }


  render() {
    return html`
        <h2>Escaner actualizado</h2>
        <h4>lecturas ${this.lecturas}</h4>

        <div class="scanner-container">
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
      <p class="fw-semibold">${this.product.product_name}</p>

      <div class="nutrient-values">
        <span>${this.displayValues.kcal || 0} kcal</span>
        <span>${this.displayValues.proteins || 0} P</span>
        <span>${this.displayValues.carbs || 0} Ch</span>
        <span>${this.displayValues.fats || 0} G</span>
      </div>

      <input type="number" inputmode="numeric" pattern="[0-9]*" placeholder="Cantidad en gramos" value=${this.grams} @input=${e => {this.updateValues(e.target.value)}} />

      <p>Cantidad: <span>${this.grams || 0}</span> g</p>

    </div>

    <div class="modal-footer">
      <button class="btn btn-success" @click=${() => this.addMeal()}>Añadir</button>
      <button class="btn btn-secondary" @click=${() => {this.bsModal.hide(); window.location.hash = '#home'}}>Cerrar</button>
    </div>
  </div>
</div>
      </div>
    `;
  }
}

customElements.define('scan-page', ScanPage);
