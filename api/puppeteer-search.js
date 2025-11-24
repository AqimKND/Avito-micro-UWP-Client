// /api/puppeteer-search.js
const puppeteer = require('puppeteer');

export default async function handler(req, res) {
  const { q = 'телефон' } = req.query;
  
  console.log('🎯 Puppeteer search for:', q);
  
  let browser;
  
  try {
    // Запускаем реальный Chrome
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Настраиваем User-Agent как мобильный браузер
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15');
    
    console.log('🔍 Navigating to Avito...');
    
    // Переходим на Авито
    await page.goto(https://www.avito.ru/rossiya?q=${encodeURIComponent(q)}, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    console.log('✅ Page loaded, waiting for items...');
    
    // Ждём появления товаров (максимум 10 секунд)
    await page.waitForSelector('[data-marker="item"]', { timeout: 10000 });
    
    console.log('📦 Items found, extracting data...');
    
    // Получаем данные товаров
    const items = await page.evaluate(() => {
      const itemElements = Array.from(document.querySelectorAll('[data-marker="item"]')).slice(0, 4);
      
      return itemElements.map(item => {
        const titleEl = item.querySelector('h3');
        const imgEl = item.querySelector('img');
        const priceEl = item.querySelector('[itemprop="price"]');
        
        return {
          title: titleEl ? titleEl.innerText.trim() : 'Название не указано',
          image: imgEl ? imgEl.src : null,
          price: priceEl ? priceEl.getAttribute('content') : 'Цена не указана'
        };
      }).filter(item => item.title !== 'Название не указано');
    });
    
    console.log('🎉 Success! Found items:', items.length);
    
    res.json({ 
      success: true,
      items: items 
    });
    
  } catch (error) {
    console.error('❌ Puppeteer error:', error);
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
