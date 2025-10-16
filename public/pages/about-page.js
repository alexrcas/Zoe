import { LitElement, html, css } from 'https://unpkg.com/lit@3.2.0/index.js?module';


export class AboutPage extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 1rem;
    }
  `;

  render() {
    return html`
      <div class="container">
        <div class="card mb-3" style="width: 18rem;">
          <img src="https://picsum.photos/300/200" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">About</h5>
            <p class="card-text">Texto de ejemplo en la página de inicio.</p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('about-page', AboutPage);
