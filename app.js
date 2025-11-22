// app.js - SUPER SIMPLE VERSION
console.log('🟢 app.js loaded');

class AvitoMicro {
    constructor() {
        console.log('🔧 AvitoMicro created');
        this.init();
    }

    init() {
        console.log('📌 Setting up button...');
        const button = document.getElementById('loginBtn');
        
        if (button) {
            button.addEventListener('click', () => {
                console.log('🎯 Button clicked! Redirecting to Avito...');
                this.login();
            });
            console.log('✅ Button event listener added');
        } else {
            console.error('❌ Button not found!');
        }
    }

    login() {
        const clientId = 'ZbBX2ouR4ddMtDQsvx9D';
        const redirectUri = 'https://micro.modyleprojects.ru/oauth-callback.html';
        const authUrl = 'https://avito.ru/oauth?client_id=' + clientId + 
                       '&response_type=code&redirect_uri=' + encodeURIComponent(redirectUri);
        
        console.log('🔗 Opening:', authUrl);
        window.location.href = authUrl;
    }
}

// Запуск когда страница загружена
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Starting app...');
    new AvitoMicro();
});
