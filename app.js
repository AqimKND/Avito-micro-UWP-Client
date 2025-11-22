// app.js - Fixed version
class AvitoMicro {
    constructor() {
        console.log('🚀 AvitoMicro constructor called');
        this.accessToken = localStorage.getItem('avito_access_token');
        this.isAuthenticated = !!this.accessToken;
        this.init();
    }

    init() {
        console.log('🔧 Initializing AvitoMicro...');
        this.bindEvents();
        this.checkAuthStatus();
        this.updateUI();
    }

    bindEvents() {
        console.log('📌 Binding events...');
        const loginBtn = document.getElementById('loginBtn');
        
        if (loginBtn) {
            console.log('✅ Login button found, adding event listener');
            loginBtn.addEventListener('click', () => {
                console.log('🎯 Login button clicked!');
                this.handleAuth();
            });
        } else {
            console.error('❌ Login button not found!');
        }

        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                console.log('🔄 Refresh button clicked');
                this.loadAds();
            });
        }
        
        this.handleOAuthCallback();
    }

    handleAuth() {
        console.log('🔐 Handling auth...');
        if (this.isAuthenticated) {
            console.log('👋 Logging out');
            this.logout();
        } else {
            console.log('🚪 Logging in');
            this.login();
        }
    }

    login() {
        console.log('🔑 Starting OAuth flow...');
        const clientId = 'ZbBX2ouR4ddMtDQsvx9D';
        const redirectUri = encodeURIComponent('https://micro.modyleprojects.ru/oauth-callback.html');
        const authUrl = https://avito.ru/oauth?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri};
        
        console.log('📍 Redirect URL:', authUrl);
        this.showStatus('Перенаправление в Авито...', 'info');
        
        setTimeout(() => {
            console.log('🌐 Redirecting to Avito...');
            window.location.href = authUrl;
        }, 1000);
    }

    logout() {
        this.accessToken = null;
        this.isAuthenticated = false;
        localStorage.removeItem('avito_access_token');
        this.showStatus('Вы вышли из системы', 'info');
        this.updateUI();
        this.clearAds();
    }

    handleOAuthCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const authCode = urlParams.get('code');
        
        if (authCode) {
            this.showStatus('Получаем доступ...', 'info');
            this.exchangeCodeForToken(authCode);
            
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
        }
    }

    async exchangeCodeForToken(code) {
        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error);
            }

            this.accessToken = data.access_token;
            this.isAuthenticated = true;
            localStorage.setItem('avito_access_token', this.accessToken);
            
            this.showStatus('Успешная авторизация!', 'success');
            this.updateUI();
            await this.loadAds();
            
        } catch (error) {
            this.showStatus('Ошибка авторизации: ' + error.message, 'error');
        }
    }

    async loadAds() {
        if (!this.isAuthenticated) {
            this.showStatus('Сначала войдите в систему', 'error');
            return;
        }
        try {
            this.showStatus('Загружаем объявления...', 'info');
            
            const response = await fetch(/api/ads?token=${encodeURIComponent(this.accessToken)});
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error);
            }

            this.displayRealAds(data.items);
            this.showStatus(Загружено ${data.items ? data.items.length : 0} объявлений, 'success');
            
        } catch (error) {
            this.showStatus('Ошибка загрузки: ' + error.message, 'error');
        }
    }

    displayRealAds(ads) {
        const adsList = document.getElementById('adsList');
        
        if (!ads || ads.length === 0) {
            adsList.innerHTML = '<div class="empty-state"><p>Объявления не найдены</p></div>';
            return;
        }

        adsList.innerHTML = ads.map(ad => 
            <div class="ad-item">
                <div class="ad-title">${ad.title || 'Без названия'}</div>
                <div class="ad-price">${ad.price ? ad.price + ' руб.' : 'Цена не указана'}</div>
                <div class="ad-status">${ad.status || 'Неизвестно'}</div>
            </div>
        ).join('');
    }

    clearAds() {
        const adsList = document.getElementById('adsList');
        adsList.innerHTML = '<div class="empty-state"><p>Войдите в аккаунт, чтобы увидеть ваши объявления</p></div>';
    }

    updateUI() {
        const loginBtn = document.getElementById('loginBtn');
        const refreshBtn = document.getElementById('refreshBtn');
        const authStatus = document.getElementById('authStatus');

        if (this.isAuthenticated) {
            loginBtn.textContent = 'Выйти';
            loginBtn.className = 'btn btn-secondary';
            refreshBtn.disabled = false;
            authStatus.textContent = 'Авторизован';
            authStatus.className = 'status-text status-success';
        } else {
            loginBtn.textContent = 'Войти через Авито';
            loginBtn.className = 'btn btn-primary';
            refreshBtn.disabled = true;
            authStatus.textContent = '';
            authStatus.className = 'status-text';
        }
    }

    checkAuthStatus() {
        if (this.isAuthenticated) {
            this.showStatus('Авторизован', 'success');
            this.loadAds();
        }
    }

    showStatus(message, type = 'info') {
        console.log(📢 Status [${type}]: ${message});
        const statusEl = document.getElementById('authStatus');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.className = status-text status-${type};
        }
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    console.log('🟢 DOM loaded, initializing app...');
    window.avitoApp = new AvitoMicro();
    console.log('✅ App initialized successfully!');
});

console.log('🟡 app.js loaded, waiting for DOM...');
