export default async function handler(req, res) {
  try {
    const { token } = req.query;
    if (!token) return res.status(401).json({ error: 'Token required' });

    const response = await fetch('https://api.avito.ru/core/v1/accounts/self/items', {
      headers: {
        'Authorization': Bearer ${token},
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch ads');
    
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
