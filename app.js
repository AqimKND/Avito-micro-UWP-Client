// app.js - Исправленная версия
class AvitoClient {
    constructor() {
        this.token = localStorage.getItem('avito_token');
        this.init();
    }

    init() {
        // Проверяем что кнопка существует перед добавлением listener
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.login());
        }
        
        this.checkAuth();
    }

    login() {
        const clientId = 'ZbBX2ouR4ddMtDQsvx9D';
        const redirectUri = 'https://avito-micro-uwp-client.vercel.app';
        const authUrl = https://avito.ru/oauth?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)};
        
        console.log('Redirecting to:', authUrl);
        window.location.href = authUrl;
    }

    async handleAuthCode(code) {
        try {
            console.log('Handling auth code:', code);
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: code })
            });
            
            const data = await response.json();
            console.log('Auth response:', data);
            
            if (data.access_token) {
                this.token = data.access_token;
                localStorage.setItem('avito_token', this.token);
                await this.loadItems();
            } else {
                console.error('No access token:', data);
            }
        } catch (error) {
            console.error('Auth error:', error);
        }
    }

    async loadItems() {
        if (!this.token) {
            console.log('No token available');
            return;
        }

        try {
            console.log('Loading items with token:', this.token.substring(0, 10) + '...');
            const response = await fetch(/api/ads?token=${encodeURIComponent(this.token)});
            const data = await response.json();
            console.log('Items response:', data);
            
            this.displayItems(data.items || []);
        } catch (error) {
            console.error('Load items error:', error);
        }
    }

    displayItems(items) {
        const container = document.getElementById('adsList');
        if (!container) {
            console.error('adsList container not found');
            return;
        }

        if (items && items.length > 0) {
            container.innerHTML = items.map(item => 
                <div class="item">
                    <h3>${item.title || 'No title'}</h3>
                    <p>${item.price || 'No price'} руб.</p>
                    <p>Status: ${item.status || 'unknown'}</p>
                </div>
            ).join('');
        } else {
            container.innerHTML = '<p>No items found</p>';
        }
    }

    checkAuth() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (code) {
            console.log('Found auth code in URL');
            this.handleAuthCode(code);
            
            // Clean URL
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
        } else if (this.token) {
            console.log('Found token in localStorage');
            this.loadItems();
        } else {
            console.log('Not authenticated');
        }
    }
}

// Инициализация когда DOM готов
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing AvitoClient...');
    window.avitoClient = new AvitoClient();
});

console.log('app.js loaded');
