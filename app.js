// app.js - Avito Search (упрощённый)
console.log('🟢 Avito Search loaded');

function AvitoSearch() {
    this.init();
}

AvitoSearch.prototype.init = function() {
    console.log('🔧 Initializing search...');
    this.setupEvents();
};

AvitoSearch.prototype.setupEvents = function() {
    var searchBtn = document.getElementById('searchBtn');
    var searchInput = document.getElementById('searchInput');
    
    if (searchBtn && searchInput) {
        var self = this;
        
        searchBtn.addEventListener('click', function() {
            self.performSearch();
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                self.performSearch();
            }
        });
        
        console.log('✅ Events setup complete');
    } else {
        console.error('❌ Search elements not found');
    }
};

AvitoSearch.prototype.performSearch = function() {
    var query = document.getElementById('searchInput').value.trim();
    
    if (!query) {
        this.showMessage('Введите запрос для поиска');
        return;
    }
    
    console.log('🔍 Searching for:', query);
    this.showLoading();
    
    var self = this;
    
    // XMLHttpRequest для совместимости
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/search?q=' + encodeURIComponent(query), true);
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                var data = JSON.parse(xhr.responseText);
                console.log('📦 Received data:', data);
                
                if (data.items && data.items.length > 0) {
                    self.displayResults(data.items, query);
                } else {
                    self.showMessage('Ничего не найдено по запросу: ' + query);
                }
            } catch (e) {
                console.error('JSON parse error:', e);
                self.showMessage('Ошибка обработки данных');
            }
        } else {
            self.showMessage('Ошибка загрузки: ' + xhr.status);
        }
    };
    
    xhr.onerror = function() {
        self.showMessage('Ошибка сети');
    };
    
    xhr.send();
};

AvitoSearch.prototype.displayResults = function(items, query) {
    var container = document.getElementById('adsList');
    
    if (!container) {
        console.error('❌ adsList container not found');
        return;
    }
    
    var html = '<div class="search-info"><p>Найдено товаров: ' + items.length + '</p></div>';
    
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        html += '<div class="item">' +
                '<h3>' + (item.title || 'Без названия') + '</h3>' +
                '<p class="price">' + (item.price || 'Цена не указана') + '</p>' +
                '</div>';
    }
    
    container.innerHTML = html;
    console.log('✅ Results displayed');
};

AvitoSearch.prototype.showLoading = function() {
    var container = document.getElementById('adsList');
    if (container) {
        container.innerHTML = '<div class="loading"><p>🔍 Поиск на Авито...</p></div>';
    }
};

AvitoSearch.prototype.showMessage = function(message) {
    var container = document.getElementById('adsList');
    if (container) {
        container.innerHTML = '<div class="message"><p>' + message + '</p></div>';
    }
};

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Starting AvitoSearch...');
    new AvitoSearch();
});
