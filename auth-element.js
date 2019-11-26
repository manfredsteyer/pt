import * as auth from './auth-utils.js';

class LoginElement extends HTMLElement {

    config = {
        domain: '',
        clientId: '',
    }

    constructor() {
        super();

        this.attachShadow({mode: 'open'});

        this.shadowRoot.innerHTML = `
            <button id="login">Login</button>
            <button id="logout">Logout</button>
            <span id="info"></span>
        `;
    }

    connectedCallback() {
        const login = this.shadowRoot.getElementById('login');
        const logout = this.shadowRoot.getElementById('logout');

        login.addEventListener('click', () => {
            auth.login();
        });

        logout.addEventListener('click', () => {
            auth.logout();
        });
    }

    static get observedAttributes() {return ['domain', 'clientid']; }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'domain') {
            this.config.domain = newValue;
        }
        else if (name === 'clientid') {
            this.config.clientId = newValue;
        }

        if (this.config.domain && this.config.clientId) {
            auth.init(this.config).then(user => {
                console.debug('user', user);
                if (!user) return;
                const info = this.shadowRoot.getElementById('info');
                info.innerHTML = `
                    <span>Logged in as ${user.name} </span>
                    <img width="100" src="${user.picture}">
                `;

            })
        }
    }


}



customElements.define('auth-element', LoginElement);