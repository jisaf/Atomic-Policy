const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { XMLParser } = require('fast-xml-parser');

const CONGRESS_API_KEY = 'Z7n4T557iCNAIm9gzI5cFwuVUDhGuOaBKgNEkOQO';
const CONGRESS_API_BASE = 'https://api.congress.gov/v3';

const fetchWithHeaders = (url) => fetch(url, {
  headers: { 'User-Agent': 'my-app/1.0' }
});

const parseSections = (xmlText) => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    textNodeName: "#text",
    allowBooleanAttributes: true
  });
  const jsonObj = parser.parse(xmlText);

  const sections = [];

  const mainRoot = jsonObj['bill-status'] || jsonObj['resolution-status'] || jsonObj.bill;
  const billRoot = mainRoot?.bill;

  if (!billRoot) return [];

  const traverse = (node) => {
    if (node.section) {
      const sectionArray = Array.isArray(node.section) ? node.section : [node.section];
      sectionArray.forEach(section => {
        const header = section.header || '';
        const number = section.enum || '';
        let textContent = '';

        const extractText = (subNode) => {
          if (typeof subNode === 'string') {
            textContent += subNode + ' ';
          } else if (subNode['#text']) {
            textContent += subNode['#text'] + ' ';
          } else if (typeof subNode === 'object' && subNode !== null) {
            Object.values(subNode).forEach(extractText);
          }
        };

        if (section.text) {
          extractText(section.text);
        } else if (section.header && section.enum) {
          // This is a placeholder for sections that have a header and enum but no direct text
          textContent = header;
        }

        if (number && header) {
          sections.push({
            id: section['@_id'] || `section-${number}`,
            number: number,
            header: header.trim(),
            content: textContent.trim(),
          });
        }
      });
    }
    // Continue traversal
    Object.values(node).forEach(value => {
      if (typeof value === 'object' && value !== null) {
        traverse(value);
      }
    });
  };

  traverse(billRoot);
  return sections;
};

module.exports = async (req, res) => {
  const { congress, billType, billNumber, text: fetchText } = req.query;

  if (!congress || !billType || !billNumber) {
    return res.status(400).json({ error: 'Missing required query parameters: congress, billType, billNumber' });
  }

  const billUrl = `${CONGRESS_API_BASE}/bill/${congress}/${billType.toLowerCase()}/${billNumber}?api_key=${CONGRESS_API_KEY}`;

  try {
    if (fetchText) {
      const textUrl = `${CONGRESS_API_BASE}/bill/${congress}/${billType.toLowerCase()}/${billNumber}/text?api_key=${CONGRESS_API_KEY}`;
      const textResponse = await fetchWithHeaders(textUrl);
      if (!textResponse.ok) throw new Error(`API Error: ${textResponse.status}`);

      const textData = await textResponse.json();
      const latestVersion = textData.textVersions?.[0];
      const xmlFormat = latestVersion?.formats.find(f => f.type === 'Formatted XML');

      if (!xmlFormat) {
        return res.status(404).json({ error: 'XML version not found for this bill.' });
      }

      const xmlResponse = await fetchWithHeaders(xmlFormat.url);
      if (!xmlResponse.ok) throw new Error(`API Error: ${xmlResponse.status}`);

      const xmlText = await xmlResponse.text();
      const sections = parseSections(xmlText);

      return res.status(200).json({ sections });
    }

    const response = await fetchWithHeaders(billUrl);
    if (!response.ok) {
      if (response.status === 404) return res.status(404).json({ error: 'Bill not found on Congress.gov' });
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
    res.status(500).json({ error: 'Failed to fetch data from Congress.gov' });
  }
};
