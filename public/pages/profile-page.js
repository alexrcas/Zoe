import {LitElement, html, css} from 'https://unpkg.com/lit@3.2.0/index.js?module';


class ProfilePage extends LitElement {

    createRenderRoot() { return this; }


    async firstUpdated() {
        console.log('firstUpdated');
    }


    render() {

        return html`

            <div class="container">
                <h5 class="pt-2 pb-0 mb-0">Perfil</h5>
            </div>
            
        `

    }

}

customElements.define('profile-page', ProfilePage);