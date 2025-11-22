class AvitoClient {
    constructor() {
        this.token = localStorage.getItem('avito_token');
        this.init();
    }

    init() {
        document.getElementById('loginBtn').addEventListener('click', () => this.login());
        this.checkAuth();
    }

    login() {
        const clientId = 'ZbBX2ouR4ddMtDQsvx9D';
        const redirectUri = 'https://ваш-сайт.vercel.app/auth-callback.html';
        window.location.href = https://avito.ru/oauth?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri};
    }

    async handleAuthCode(code) {
        const response = await fetch('/api/auth', {
            method: 'POST',
            body: JSON.stringify({ code })
        });
        const data = await response.json();
        
        this.token = data.access_token;
        localStorage.setItem('avito_token', this.token);
        this.loadItems();
    }

    async loadItems() {
        const response = await fetch(/api/items?token=${this.token});
        const data = await response.json();
        this.displayItems(data.items);
    }

    displayItems(items) {
        const container = document.getElementById('adsList');
        container.innerHTML = items.map(item => 
            <div class="item">
                <h3>${item.title}</h3>
                <p>${item.price} руб.</p>
            </div>
        ).join('');
    }

    checkAuth() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code) this.handleAuthCode(code);
        else if (this.token) this.loadItems();
    }
}

new AvitoClient();
