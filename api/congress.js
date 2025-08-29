const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { XMLParser } = require('fast-xml-parser');
const { htmlToText } = require('html-to-text');
const PDFParser = require("pdf2json");

const CONGRESS_API_KEY = 'Z7n4T557iCNAIm9gzI5cFwuVUDhGuOaBKgNEkOQO';
const CONGRESS_API_BASE = 'https://api.congress.gov/v3';

const fetchWithHeaders = (url) => fetch(url, {
  headers: { 'User-Agent': 'my-app/1.0' }
});

const parseSectionsFromText = (text) => {
  const sections = [];
  // This regex is a best-effort approach to capture common section formats.
  const regex = /SEC\.\s*(\w+)\.\s*(.*?)\n\n([\s\S]*?)(?=\n\nSEC\.|\n\n\s*TITLE|\n\n\s*DIVISION|$)/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    sections.push({
      id: `section-${match[1]}`,
      number: `Sec. ${match[1]}`,
      header: match[2].trim(),
      content: match[3].trim(),
    });
  }
  return sections;
};

const parseSectionsFromXml = (xmlText) => {
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
        textNodeName: "#text",
        allowBooleanAttributes: true,
        parseNodeValue: true,
        trimValues: true,
    });
    const jsonObj = parser.parse(xmlText);

    const sections = [];
    const mainRoot = jsonObj.bill || jsonObj['bill-status'] || jsonObj['resolution-status'];
    const billRoot = mainRoot?.bill || mainRoot;

    if (!billRoot) return [];

    const getText = (node) => {
        if (!node) return '';
        if (typeof node === 'string') return node;
        if (node['#text']) return node['#text'];

        let text = '';
        const findText = (n) => {
            if (typeof n === 'string') {
                text += n + ' ';
            } else if (n && n['#text']) {
                text += n['#text'] + ' ';
            } else if (typeof n === 'object' && n !== null) {
                // Exclude header and enum from this deep search to avoid duplication
                Object.keys(n).forEach(key => {
                    if (key !== 'header' && key !== 'enum') {
                        findText(n[key]);
                    }
                });
            }
        };
        findText(node);
        return text;
    };

    const traverse = (node) => {
        if (node && node.section) {
            const sectionArray = Array.isArray(node.section) ? node.section : [node.section];
            sectionArray.forEach(section => {
                if (section && section.enum) {
                    const headerText = getText(section.header);
                    // The content is the full text of the section node, minus the header.
                    const contentText = getText(section);

                    if (headerText) {
                        sections.push({
                            id: section['@_id'] || `section-${section.enum}`,
                            number: String(section.enum),
                            header: headerText.trim(),
                            content: contentText.trim(),
                        });
                    }
                }
            });
        }
        // Continue traversal
        if (typeof node === 'object' && node !== null) {
            Object.values(node).forEach(value => {
                if (typeof value === 'object' && value !== null) {
                    traverse(value);
                }
            });
        }
    };

    traverse(billRoot);
    return sections;
};

module.exports = async (req, res) => {
  const { congress, billType, billNumber, text: fetchText } = req.query;

  if (!congress || !billType || !billNumber) {
    return res.status(400).json({ error: 'Missing required query parameters: congress, billType, billNumber' });
  }

  try {
    if (fetchText) {
      const textUrl = `${CONGRESS_API_BASE}/bill/${congress}/${billType.toLowerCase()}/${billNumber}/text?api_key=${CONGRESS_API_KEY}`;
      const textResponse = await fetchWithHeaders(textUrl);
      if (!textResponse.ok) throw new Error(`API Error fetching text versions: ${textResponse.status}`);

      const textData = await textResponse.json();
      const latestVersion = textData.textVersions?.[0];

      if (!latestVersion) {
        return res.status(404).json({ error: 'No text versions found for this bill.' });
      }

      const xmlFormat = latestVersion.formats.find(f => f.type === 'Formatted XML');
      const htmlFormat = latestVersion.formats.find(f => f.type === 'Formatted Text');
      const pdfFormat = latestVersion.formats.find(f => f.type === 'PDF');

      let sections = [];
      let formatUsed = null;

      if (xmlFormat) {
          const xmlResponse = await fetchWithHeaders(xmlFormat.url);
          if (xmlResponse.ok) {
              const xmlText = await xmlResponse.text();
              sections = parseSectionsFromXml(xmlText);
              if (sections.length > 0) formatUsed = 'XML';
          }
      }

      if (sections.length === 0 && htmlFormat) {
        const htmlResponse = await fetchWithHeaders(htmlFormat.url);
        if (htmlResponse.ok) {
          const html = await htmlResponse.text();
          const text = htmlToText(html, { wordwrap: false, selectors: [{ selector: 'a', options: { ignoreHref: true } }] });
          sections = parseSectionsFromText(text);
          if (sections.length > 0) formatUsed = 'HTML';
        }
      }

      if (sections.length === 0 && pdfFormat) {
        const pdfResponse = await fetchWithHeaders(pdfFormat.url);
        if (pdfResponse.ok) {
            const pdfBuffer = await pdfResponse.arrayBuffer();
            const pdfParser = new PDFParser();

            const pdfText = await new Promise((resolve, reject) => {
                pdfParser.on("pdfParser_dataError", errData => reject(new Error(errData.parserError)));
                pdfParser.on("pdfParser_dataReady", pdfData => {
                    resolve(pdfParser.getRawTextContent());
                });
                pdfParser.parseBuffer(Buffer.from(pdfBuffer));
            });

            sections = parseSectionsFromText(pdfText);
            if (sections.length > 0) formatUsed = 'PDF';
        }
      }

      if (sections.length === 0) {
        return res.status(404).json({ error: 'Could not extract sections from the bill. The format may be unsupported or the bill may not contain structured sections.' });
      }

      return res.status(200).json({ sections, formatUsed });
    }

    // Original logic to fetch just the title
    const billUrl = `${CONGRESS_API_BASE}/bill/${congress}/${billType.toLowerCase()}/${billNumber}?api_key=${CONGRESS_API_KEY}`;
    const response = await fetchWithHeaders(billUrl);
    if (!response.ok) {
      if (response.status === 404) return res.status(404).json({ error: 'Bill not found on Congress.gov' });
      throw new Error(`API Error fetching bill title: ${response.status}`);
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
