// app.js - ТОЛЬКО реальные данные
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
            this.showError('Введите поисковый запрос');
            return;
        }

        this.showLoading();
        
        try {
            const response = await fetch(/api/search?q=${encodeURIComponent(query)});
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'API error');
            }

            if (data.items && data.items.length > 0) {
                this.displayItems(data.items);
            } else {
                this.showError('По вашему запросу ничего не найдено');
            }
        } catch (error) {
            this.showError(Ошибка: ${error.message});
        }
    }

    displayItems(items) {
        const container = document.getElementById('adsList');
        if (!container) return;

        container.innerHTML = items.map(item => 
            <div class="item">
                <h3>${this.escapeHtml(item.title)}</h3>
                <p class="price">${item.price}</p>
                ${item.url ? <a href="${item.url}" target="_blank">Открыть на Авито</a> : ''}
            </div>
        ).join('');
    }

    showLoading() {
        const container = document.getElementById('adsList');
        if (container) {
            container.innerHTML = '<p>Ищем реальные объявления на Авито...</p>';
        }
    }

    showError(message) {
        const container = document.getElementById('adsList');
        if (container) {
            container.innerHTML = <p class="error">${message}</p>;
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Запуск
document.addEventListener('DOMContentLoaded', () => {
    new AvitoSearch();
});
