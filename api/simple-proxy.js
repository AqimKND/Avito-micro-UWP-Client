// /api/simple-proxy.js - РЕАЛЬНЫЕ данные, 4 карточки
export default async function handler(req, res) {
  const { q = 'телефон' } = req.query;
  
  console.log('🎯 Real simple search:', q);
  
  try {
    // Реальный запрос к Авито
    const response = await fetch('https://www.avito.ru/rossiya?q=' + encodeURIComponent(q));
    
    if (!response.ok) {
      return res.json({ items: [] });
    }

    const html = await response.text();
    const items = [];
    
    // ПРОСТЕЙШИЙ парсинг - только 4 первых результата
    let position = 0;
    
    for (let i = 0; i < 4; i++) {
      // Ищем следующий заголовок
      const titleStart = html.indexOf('<h3', position);
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
          title: titleMatch[1].trim().substring(0, 50), // обрезаем длинные названия
          image: srcMatch[1].startsWith('http') ? srcMatch[1] : 'https:' + srcMatch[1]
        });
      }
      
      position = imgEnd;
    }
    
    console.log('✅ Real items found:', items.length);
    res.json({ items: items });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.json({ items: [] });
  }
}
