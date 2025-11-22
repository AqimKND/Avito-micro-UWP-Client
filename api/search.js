// /api/search.js - РЕАЛЬНЫЙ парсинг Авито
export default async function handler(req, res) {
  const { q = 'телефон' } = req.query;
  
  try {
    // Парсим реальную HTML страницу Авито
    const response = await fetch(https://www.avito.ru/rossiya?q=${encodeURIComponent(q)}, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(HTTP error! status: ${response.status});
    }

    const html = await response.text();
    
    // Парсим реальные объявления из HTML
    const items = this.parseAvitoHTML(html);
    
    if (items.length > 0) {
      res.json({ items: items.slice(0, 10) }); // Первые 10 результатов
    } else {
      throw new Error('No items found in HTML');
    }

  } catch (error) {
    // ЕСЛИ не получилось - возвращаем ошибку, НЕ демо-данные
    res.status(500).json({ 
      error: Failed to fetch real data: ${error.message},
      items: [] 
    });
  }
}

// Реальный парсинг HTML Авито
function parseAvitoHTML(html) {
  const items = [];
  
  // Ищем структуры данных в HTML
  const scriptRegex = /window\.initialData\s*=\s*({.*?});/;
  const match = html.match(scriptRegex);
  
  if (match && match[1]) {
    try {
      const data = JSON.parse(match[1]);
      // Извлекаем items из структуры Авито
      const catalogItems = data?.catalog?.items || [];
      
      catalogItems.forEach(item => {
        if (item?.title && item?.price) {
          items.push({
            title: item.title,
            price: item.price + ' ₽',
            url: item.url ? https://avito.ru${item.url} : null
          });
        }
      });
    } catch (e) {
      console.error('JSON parse error:', e);
    }
  }
  
  // Если не нашли в JSON, парсим обычный HTML
  if (items.length === 0) {
    const itemRegex = /<div[^>]*class="[^"]*iva-item-body[^"]*"[^>]*>([\s\S]*?)<\/div>/g;
    let match;
    
    while ((match = itemRegex.exec(html)) !== null && items.length < 10) {
      const itemHtml = match[1];
      const titleMatch = itemHtml.match(/<h3[^>]*>([^<]*)<\/h3>/);
      const priceMatch = itemHtml.match(/(\d[\d\s]*)\s*₽/);
      
      if (titleMatch && priceMatch) {
        items.push({
          title: titleMatch[1].trim(),
          price: priceMatch[1].trim() + ' ₽'
        });
      }
    }
  }
  
  return items;
}
