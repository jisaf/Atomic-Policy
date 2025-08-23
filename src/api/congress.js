const CONGRESS_API_KEY = 'Z7n4T557iCNAIm9gzI5cFwuVUDhGuOaBKgNEkOQO';
const CONGRESS_API_BASE = 'https://api.congress.gov/v3';

export const fetchBills = async (searchTerm = '') => {
  try {
    const params = new URLSearchParams({
      api_key: CONGRESS_API_KEY,
      format: 'json',
      limit: '20'
    });

    if (searchTerm) {
      params.append('search', searchTerm);
    }

    const response = await fetch(`${CONGRESS_API_BASE}/bill/119?${params}`);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.bills || [];
  } catch (err) {
    console.error('Bills API Error:', err);
    throw err;
  }
};

export const fetchBillText = async (billType, billNumber, billTitle, congress = '119') => {
  try {
    const params = new URLSearchParams({
      api_key: CONGRESS_API_KEY,
      format: 'json'
    });

    const response = await fetch(`${CONGRESS_API_BASE}/bill/${congress}/${billType}/${billNumber}/text?${params}`);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    // Parse sections from bill text (simplified parsing)
    const sections = [];
    if (data.textVersions && data.textVersions.length > 0) {
      // Use the latest version
      const latestVersion = data.textVersions[0];

      // Create mock sections for demonstration (real implementation would parse XML)
      sections.push(
        { id: 'short-title', title: 'Short Title', content: `${billTitle} - Short Title Section` },
        { id: 'findings', title: 'Findings', content: `Findings section of ${billTitle}` },
        { id: 'definitions', title: 'Definitions', content: `Definitions section of ${billTitle}` }
      );
    }

    return sections;
  } catch (err) {
    console.error('Bill Text API Error:', err);
    throw err;
  }
};
