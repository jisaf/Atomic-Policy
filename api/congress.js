const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const CONGRESS_API_KEY = 'Z7n4T557iCNAIm9gzI5cFwuVUDhGuOaBKgNEkOQO';
const CONGRESS_API_BASE = 'https://api.congress.gov/v3';

module.exports = async (req, res) => {
  const { congress, billType, billNumber } = req.query;

  if (!congress || !billType || !billNumber) {
    return res.status(400).json({ error: 'Missing required query parameters: congress, billType, billNumber' });
  }

  const url = `${CONGRESS_API_BASE}/bill/${congress}/${billType.toLowerCase()}/${billNumber}?api_key=${CONGRESS_API_KEY}`;

  try {
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'my-app/1.0'
        }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: 'Bill not found on Congress.gov' });
      }
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    const title = data.bill?.title;

    if (!title) {
        return res.status(404).json({ error: 'Title not found in bill data.' });
    }

    res.status(200).json({ title });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch bill title from Congress.gov' });
  }
};
