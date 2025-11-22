// /api/search.js - Упрощённая версия
export default async function handler(req, res) {
  const { q = 'телефон' } = req.query;
  
  console.log('🔍 API Search requested:', q);
  
  try {
    // Простая версия - получаем HTML и парсим
    const response = await fetch(https://www.avito.ru/rossiya?q=${encodeURIComponent(q)}, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml',
      }
    });

    if (!response.ok) {
      console.error('❌ Avito response error:', response.status);
      return res.status(500).json({ 
        error: Avito returned ${response.status},
        items: [] 
      });
    }

    const html = await response.text();
    console.log('✅ HTML received, length:', html.length);
    
    // Упрощённый парсинг
    const items = [];
    
    // Ищем items в HTML
    const itemRegex = /<div[^>]*class="[^"]*iva-item-body[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
    let match;
    let count = 0;
    
    while ((match = itemRegex.exec(html)) !== null && count < 10) {
      const itemHtml = match[1];
      
      // Извлекаем заголовок
      const titleMatch = itemHtml.match(/<h3[^>]*>([^<]+)</) || 
                        itemHtml.match(/title["']?[^>]*>([^<]+)</i);
      
      // Извлекаем цену
      const priceMatch = itemHtml.match(/(\d[\d\s]*)₽/) ||
                        itemHtml.match(/price["']?[^>]*>([^<]+)</i);
      
      if (titleMatch && priceMatch) {
        items.push({
          title: titleMatch[1].trim().replace(/&quot;/g, '"'),
          price: priceMatch[1].trim() + ' ₽'
        });
        count++;
      }
    }
    
    console.log('✅ Parsed items:', items.length);
    
    if (items.length > 0) {
      res.json({ items: items });
    } else {
      res.status(404).json({ 
        error: 'No items found in HTML',
        items: [] 
      });
    }

  } catch (error) {
    console.error('❌ API Error:', error);
    res.status(500).json({ 
      error: error.message,
      items: [] 
    });
  }
}
