// app.js - Исправленная версия для отображения карточек
class SimpleAvito {
    constructor() {
        this.init();
    }

    init() {
        this.setupEvents();
    }

    setupEvents() {
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('searchInput');
        
        if (searchBtn && searchInput) {
            const self = this;
            
            searchBtn.addEventListener('click', function() {
                self.search();
            });
            
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') self.search();
            });
        }
    }

    async search() {
        const query = document.getElementById('searchInput').value.trim();
        if (!query) {
            this.showMessage('Введите запрос для поиска');
            return;
        }
        
        this.showLoading();
        
        try {
            const response = await fetch('/api/simple-proxy?q=' + encodeURIComponent(query));
            const data = await response.json();
            
            console.log('📦 Received data:', data); // Добавим логирование
            
            if (data.items && data.items.length > 0) {
                this.showResults(data.items, query);
            } else {
                this.showMessage('Ничего не найдено по запросу: ' + query);
            }
        } catch (error) {
            this.showMessage('Ошибка поиска: ' + error.message);
        }
    }

    showResults(items, query) {
        const container = document.getElementById('adsList');
        
        let html = '<div class="search-info"><p>Найдено товаров: ' + items.length + '</p></div>';
        
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const imageHtml = item.image ? 
                '<img src="' + item.image + '" alt="" class="item-image">' : 
                '<div class="no-image">📷</div>';
            
            html += '<div class="item-card">' +
                    '<div class="item-image-container">' + imageHtml + '</div>' +
                    '<div class="item-title">' + (item.title || 'Без названия') + '</div>' +
                    '</div>';
        }
        
        container.innerHTML = html;
    }

    showLoading() {
        const container = document.getElementById('adsList');
        if (container) {
            container.innerHTML = '<p>🔍 Поиск на Авито...</p>';
        }
    }

    showMessage(text) {
        const container = document.getElementById('adsList');
        if (container) {
            container.innerHTML = '<p>' + text + '</p>';
        }
    }
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    new SimpleAvito();
});
