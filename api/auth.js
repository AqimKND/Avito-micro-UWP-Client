export default async function handler(req, res) {
  const { code } = req.body;
  
  const response = await fetch('https://api.avito.ru/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.AVITO_CLIENT_ID,
      client_secret: process.env.AVITO_CLIENT_SECRET,
      code: code,
    }),
  });
  
  const data = await response.json();
  res.json(data);
}
