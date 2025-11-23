// /api/simple-proxy.js - Простой прокси для названий и картинок
export default async function handler(req, res) {
  const { q = 'телефон' } = req.query;
  
  console.log('🔄 Simple proxy search:', q);
  
  try {
    // Получаем HTML Авито
    const response = await fetch(https://www.avito.ru/rossiya?q=${encodeURIComponent(q)}, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      }
    });

    if (!response.ok) {
      return res.status(500).json({ items: [] });
    }

    const html = await response.text();
    const items = [];
    
    // ПРОСТОЙ парсинг - только названия и картинки
    let index = 0;
    while (index < html.length && items.length < 10) {
      // Ищем заголовок
      const titleStart = html.indexOf('<h3', index);
      if (titleStart === -1) break;
      
      const titleEnd = html.indexOf('</h3>', titleStart);
      if (titleEnd === -1) break;
      
      const titleHtml = html.substring(titleStart, titleEnd + 5);
      const titleMatch = titleHtml.match(/>([^<]+)</);
      
      // Ищем картинку
      const imgStart = html.indexOf('<img', titleEnd);
      if (imgStart === -1) break;
      
      const imgEnd = html.indexOf('>', imgStart);
      const imgHtml = html.substring(imgStart, imgEnd);
      const srcMatch = imgHtml.match(/src="([^"]+)"/);
      
      if (titleMatch && srcMatch) {
        items.push({
          title: titleMatch[1].trim(),
          image: srcMatch[1].startsWith('http') ? srcMatch[1] : https:${srcMatch[1]}
        });
      }
      
      index = imgEnd;
    }
    
    console.log('✅ Found items:', items.length);
    res.json({ items });
    
  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.json({ items: [] });
  }
}
