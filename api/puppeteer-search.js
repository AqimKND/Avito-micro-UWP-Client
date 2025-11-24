// /api/puppeteer-search.js - ФИНАЛЬНАЯ РАБОЧАЯ ВЕРСИЯ
const puppeteer = require('puppeteer');

module.exports = async function handler(req, res) {
  const { q = 'телефон' } = req.query;
  
  console.log('🎯 Browserless search for:', q);
  
  let browser;
  
  try {
    // Подключаемся к облачному Chrome с ТВОИМ КЛЮЧОМ
    browser = await puppeteer.connect({
      browserWSEndpoint: 'wss://chrome.browserless.io?token=2TTxjLh4HvCzR6E26cf97908c661c69dee073776175753ae9'
    });
    
    const page = await browser.newPage();
    
    // Настраиваем User-Agent
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15');
    
    console.log('🔍 Navigating to Avito...');
    
    const avitoUrl = 'https://www.avito.ru/rossiya?q=' + encodeURIComponent(q);
    await page.goto(avitoUrl, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    console.log('✅ Page loaded, waiting for items...');
    
    await page.waitForSelector('[data-marker="item"]', { timeout: 10000 });
    
    console.log('📦 Items found, extracting data...');
    
    const items = await page.evaluate(function() {
      var itemElements = Array.from(document.querySelectorAll('[data-marker="item"]')).slice(0, 4);
      
      return itemElements.map(function(item) {
        var titleEl = item.querySelector('h3');
        var imgEl = item.querySelector('img');
        var priceEl = item.querySelector('[itemprop="price"]');
        
        return {
          title: titleEl ? titleEl.innerText.trim() : 'Название не указано',
          image: imgEl ? imgEl.src : null,
          price: priceEl ? priceEl.getAttribute('content') : 'Цена не указана'
        };
      }).filter(function(item) {
        return item.title !== 'Название не указано';
      });
    });
    
    console.log('🎉 Success! Found items:', items.length);
    
    res.json({ 
      success: true,
      items: items 
    });
    
  } catch (error) {
    console.error('❌ Browserless error:', error);
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
