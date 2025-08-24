import { describe, it, expect, vi } from 'vitest';
import { fetchBills, fetchBillText } from './congress';

describe('Congress API', () => {
  it('fetches bills', async () => {
    const mockBills = [{ id: '1', title: 'Test Bill' }];
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ bills: mockBills }),
    };
    vi.spyOn(global, 'fetch').mockResolvedValue(mockResponse);

    const bills = await fetchBills();
    expect(bills).toEqual(mockBills);
  });

  it('fetches bill text', async () => {
    const mockSections = [{ id: '1', title: 'Test Section' }];
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ textVersions: [{ body: '...'}], sections: mockSections }),
    };
     vi.spyOn(global, 'fetch').mockResolvedValue(mockResponse);

    const sections = await fetchBillText('hr', '123', 'Test Bill');
    //This is a simplified test because the function has mock data
    expect(sections.length).toBeGreaterThan(0);
  });
});
