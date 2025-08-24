const express = require('express');
const { XMLParser } = require('fast-xml-parser');

const app = express();
const port = 3001;

app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

app.get('/govinfo', async (req, res) => {
  const { congress, billType, billNumber } = req.query;

  if (!congress || !billType || !billNumber) {
    return res.status(400).json({ error: 'Missing required query parameters: congress, billType, billNumber' });
  }

  const url = `https://www.govinfo.gov/bulkdata/BILLSTATUS/${congress}/${billType.toLowerCase()}/BILLSTATUS-${congress}${billType.toLowerCase()}${billNumber}.xml`;

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: 'Bill not found' });
      }
      throw new Error(`API Error: ${response.status}`);
    }

    const xmlText = await response.text();
    const parser = new XMLParser();
    const jsonObj = parser.parse(xmlText);

    let title = '';

    if (jsonObj.billStatus && jsonObj.billStatus.bill && jsonObj.billStatus.bill.titles && jsonObj.billStatus.bill.titles.item) {
        const titles = Array.isArray(jsonObj.billStatus.bill.titles.item) ? jsonObj.billStatus.bill.titles.item : [jsonObj.billStatus.bill.titles.item];
        const officialTitleItem = titles.find(t => t.titleType === 'Official Title as Introduced');
        if (officialTitleItem) {
            title = officialTitleItem.title;
        } else {
            const shortTitleItem = titles.find(t => t.titleType && t.titleType.includes('Short Title'));
            if (shortTitleItem) {
                title = shortTitleItem.title;
            }
        }
    }

    if (!title && jsonObj.billStatus && jsonObj.billStatus.bill && jsonObj.billStatus.bill.title) {
        title = jsonObj.billStatus.bill.title;
    }

    if (!title) {
        return res.status(404).json({ error: 'Title not found in bill XML.' });
    }

    res.status(200).json({ title });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch bill title' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
