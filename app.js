// app.js - Исправленная версия
class AvitoClient {
    constructor() {
        console.log('🟢 AvitoClient created');
        this.token = localStorage.getItem('avito_token');
        this.init();
    }

    init() {
        console.log('🔧 Initializing...');
        
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            console.log('✅ Login button found');
            loginBtn.addEventListener('click', () => {
                console.log('🎯 Login button clicked');
                this.login();
            });
        } else {
            console.error('❌ Login button not found!');
        }
        
        this.checkAuth();
    }

    login() {
        console.log('🔑 Starting login process...');
        
        const clientId = 'ZbBX2ouR4ddMtDQsvx9D';
        const redirectUri = 'https://avito-micro-uwp-client.vercel.app';
        
        console.log('📍 Redirect URI:', redirectUri);
        
        // Без encodeURIComponent - просто конкатенация
        const authUrl = 'https://avito.ru/oauth?client_id=' + clientId + 
                       '&response_type=code&redirect_uri=' + redirectUri;
        
        console.log('🌐 Full auth URL:', authUrl);
        window.location.href = authUrl;
    }

    async handleAuthCode(code) {
        console.log('🔄 Handling auth code:', code);
        // ... остальной код без изменений
    }

    // ... остальные методы без изменений
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM loaded, starting app...');
    new AvitoClient();
});

console.log('📄 app.js loaded');
