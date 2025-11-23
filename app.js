// app.js - Только названия и картинки
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
        const query = document.getElementById('searchInput').value.trim() || 'телефон';
        this.showLoading();
        
        try {
            const response = await fetch(/api/simple-proxy?q=${encodeURIComponent(query)});
            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                this.showResults(data.items, query);
            } else {
                this.showMessage('Ничего не найдено');
            }
        } catch (error) {
            this.showMessage('Ошибка поиска');
        }
    }

    showResults(items, query) {
        const container = document.getElementById('adsList');
        let html = <div class="search-info"><p>Найдено: ${items.length} товаров</p></div>;
        
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            html += 
                <div class="item-simple">
                    ${item.image ? <img src="${item.image}" alt="${item.title}" class="item-image"> : ''}
                    <div class="item-title">${item.title}</div>
                </div>
            ;
        }
        
        container.innerHTML = html;
    }

    showLoading() {
        document.getElementById('adsList').innerHTML = '<p>Поиск...</p>';
    }

    showMessage(text) {
        document.getElementById('adsList').innerHTML = <p>${text}</p>;
    }
}

// Запуск
document.addEventListener('DOMContentLoaded', function() {
    new SimpleAvito();
});
