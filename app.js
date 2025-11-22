// app.js - Avito Search (только поиск)
class AvitoSearch {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('searchInput');
        
        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', () => this.search());
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.search();
            });
        }
    }

    async search() {
        const query = document.getElementById('searchInput').value.trim();
        if (!query) {
            this.showMessage('Введите поисковый запрос', 'error');
            return;
        }

        this.showLoading();
        
        try {
            const response = await fetch(/api/search?q=${encodeURIComponent(query)});
            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                this.displayItems(data.items, query);
            } else {
                this.showMessage('По вашему запросу ничего не найдено', 'info');
            }
        } catch (error) {
            this.showMessage('Ошибка поиска. Попробуйте другой запрос', 'error');
        }
    }

    displayItems(items, query) {
        const container = document.getElementById('adsList');
        container.innerHTML = 
            <div class="search-info">
                <p>Найдено ${items.length} товаров по запросу: "<strong>${query}</strong>"</p>
            </div>
            ${items.map(item => 
                <div class="item">
                    <h3>${item.title}</h3>
                    <p class="price">${item.price}</p>
                    ${item.url ? <a href="${item.url}" target="_blank" class="avito-link">Открыть на Авито</a> : ''}
                </div>
            ).join('')}
        ;
    }

    showLoading() {
        const container = document.getElementById('adsList');
        container.innerHTML = '<div class="loading"><p>🔍 Ищем товары на Авито...</p></div>';
    }

    showMessage(message, type) {
        const container = document.getElementById('adsList');
        container.innerHTML = <div class="message ${type}"><p>${message}</p></div>;
    }
}

// Запуск
document.addEventListener('DOMContentLoaded', () => {
    new AvitoSearch();
});
