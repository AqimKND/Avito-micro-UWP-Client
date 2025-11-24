// /api/puppeteer-search.js - ОБНОВЛЕННЫЕ СЕЛЕКТОРЫ
const puppeteer = require('puppeteer');

module.exports = async function handler(req, res) {
  const { q = 'телефон' } = req.query;
  
  console.log('🎯 Browserless search for:', q);
  
  let browser;
  
  try {
    // Подключаемся к облачному Chrome
    browser = await puppeteer.connect({
      browserWSEndpoint: 'wss://chrome.browserless.io?token=2TTxjLh4HvCzR6E26cf97908c661c69dee073776175753ae9'
    });
    
    const page = await browser.newPage();
    
    // Настраиваем User-Agent как обычный браузер
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    console.log('🔍 Navigating to Avito...');
    
    const avitoUrl = 'https://www.avito.ru/rossiya?q=' + encodeURIComponent(q);
    await page.goto(avitoUrl, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    console.log('✅ Page loaded, extracting data...');
    
    // Пробуем разные селекторы для Авито
    const items = await page.evaluate(function() {
      // Пробуем несколько селекторов
      var selectors = [
        '[data-marker="item"]',
        '.iva-item-root',
        '.items-item',
        '[class*="item"]'
      ];
      
      var itemElements = [];
      
      // Ищем элементы по разным селекторам
      for (var i = 0; i < selectors.length; i++) {
        var elements = document.querySelectorAll(selectors[i]);
        if (elements.length > 0) {
          itemElements = Array.from(elements).slice(0, 4);
          break;
        }
      }
      
      console.log('Found elements:', itemElements.length);
      
      return itemElements.map(function(item) {
        // Пробуем разные селекторы для заголовка
        var titleEl = item.querySelector('h3') || 
                     item.querySelector('[itemprop="name"]') ||
                     item.querySelector('.title');
        
        // Пробуем разные селекторы для картинки
        var imgEl = item.querySelector('img') || 
                   item.querySelector('[data-marker*="image"]');
        
        // Пробуем разные селекторы для цены
        var priceEl = item.querySelector('[itemprop="price"]') ||
                     item.querySelector('[data-marker*="price"]') ||
                     item.querySelector('.price');
        
        var title = titleEl ? titleEl.innerText.trim() : null;
        var image = imgEl ? imgEl.src : null;
        var price = priceEl ? priceEl.getAttribute('content') || priceEl.innerText.trim() : null;
        
        // Фильтруем только валидные items
        if (title && title.length > 3) {
          return {
            title: title.substring(0, 100),
            image: image,
            price: price
          };
        }
        return null;
      }).filter(function(item) {
        return item !== null;
      });
    });
    
    console.log('🎉 Final items:', items.length);
    
    res.json({ 
      success: true,
      items: items 
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      items: [] 
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
