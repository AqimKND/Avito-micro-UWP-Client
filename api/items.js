export default async function handler(req, res) {
  const { token } = req.query;
  
  const response = await fetch('https://api.avito.ru/core/v1/accounts/self/items', {
    headers: {
      'Authorization': Bearer ${token},
    },
  });
  
  const data = await response.json();
  res.json(data);
}
