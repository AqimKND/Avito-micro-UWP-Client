export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { code } = req.body;
    const response = await fetch('https://api.avito.ru/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.AVITO_CLIENT_ID,
        client_secret: process.env.AVITO_CLIENT_SECRET,
        code: code,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Auth failed');
    
    res.json({ access_token: data.access_token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
