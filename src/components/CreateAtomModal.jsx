import React, { useState, useEffect } from 'react';
import { fetchBills, fetchBillText } from '../api/congress';

const CreateAtomModal = ({ onClose, onCreate, atomTypes, existingAtoms }) => {
  const [formData, setFormData] = useState({
    type: 'experiment',
    title: '',
    billNumber: '',
    billTitle: '',
    sectionTitle: '',
    content: '',
    fileReference: '',
    description: '',
    tags: '',
    linkedTo: []
  });

  const [bills, setBills] = useState([]);
  const [billSections, setBillSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetchBills = async (searchTerm = '') => {
    setLoading(true);
    setError('');
    try {
      const billsData = await fetchBills(searchTerm);
      setBills(billsData);
    } catch (err) {
      setError('Failed to fetch bills: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchBillText = async (billType, billNumber, billTitle) => {
    setLoading(true);
    try {
      const sections = await fetchBillText(billType, billNumber, billTitle);
      setBillSections(sections);
    } catch (err) {
      setError('Failed to fetch bill text: ' + err.message);
      setBillSections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchBills();
  }, []);

  useEffect(() => {
    if (formData.type === 'experiment' && formData.billNumber && formData.sectionTitle) {
      const selectedSection = billSections.find(s => s.title === formData.sectionTitle);
      if (selectedSection) {
        setFormData(prev => ({
          ...prev,
          content: selectedSection.content,
          title: `${formData.billNumber} - ${formData.sectionTitle}`
        }));
      }
    }
  }, [formData.billNumber, formData.sectionTitle, formData.type, billSections]);

  const handleSubmit = () => {
    if (!formData.title.trim()) return;

    if (formData.type === 'experiment' && (!formData.billNumber || !formData.sectionTitle)) return;
    if (['fact', 'insight'].includes(formData.type) && !formData.content.trim()) return;
    if (formData.type === 'recommendation' && !formData.fileReference.trim()) return;

    const atomData = {
      type: formData.type,
      title: formData.title,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      linkedTo: formData.linkedTo
    };

    if (formData.type === 'experiment') {
      atomData.billNumber = formData.billNumber;
      atomData.billTitle = formData.billTitle;
      atomData.sectionTitle = formData.sectionTitle;
      atomData.content = formData.content;
    } else if (['fact', 'insight'].includes(formData.type)) {
      atomData.content = formData.content;
    } else if (formData.type === 'recommendation') {
      atomData.fileReference = formData.fileReference;
      atomData.description = formData.description;
      atomData.content = `Implementation: ${formData.fileReference} - ${formData.description}`;
    }

    onCreate(atomData);
  };

  const toggleLink = (atomId) => {
    const linked = formData.linkedTo.includes(atomId);
    setFormData({
      ...formData,
      linkedTo: linked
        ? formData.linkedTo.filter(id => id !== atomId)
        : [...formData.linkedTo, atomId]
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Create New Atom</h2>
        </div>
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Atom Type Selector */}
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value, title: '', content: '' })}
            className="w-full p-2 border rounded"
          >
            {Object.entries(atomTypes).map(([key, type]) => (
              <option key={key} value={key}>{type.label}</option>
            ))}
          </select>

          {/* Dynamic Form Fields */}
          {formData.type === 'experiment' ? (
            <div className="space-y-2">
              <input type="text" placeholder="Search for a bill..." onChange={(e) => handleFetchBills(e.target.value)} className="w-full p-2 border rounded" />
              {loading && <p>Loading...</p>}
              {error && <p className="text-red-500">{error}</p>}
              <select
                className="w-full p-2 border rounded"
                onChange={(e) => {
                  const [billType, billNumber, billTitle] = e.target.value.split('|');
                  setFormData({...formData, billNumber: `${billType}${billNumber}`, billTitle});
                  handleFetchBillText(billType, billNumber, billTitle);
                }}
              >
                <option>Select a bill</option>
                {bills.map(bill => <option key={bill.number} value={`${bill.type}|${bill.number}|${bill.title}`}>{bill.title}</option>)}
              </select>
              <select
                className="w-full p-2 border rounded"
                onChange={(e) => setFormData({...formData, sectionTitle: e.target.value})}
              >
                <option>Select a section</option>
                {billSections.map(section => <option key={section.id} value={section.title}>{section.title}</option>)}
              </select>
              <input type="text" value={formData.title} readOnly placeholder="Title (auto-generated)" className="w-full p-2 border rounded bg-gray-100" />
              <textarea value={formData.content} readOnly placeholder="Content (auto-generated)" className="w-full p-2 border rounded bg-gray-100 h-24"></textarea>
            </div>
          ) : (
            <>
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-2 border rounded"
              />
              {formData.type === 'recommendation' ? (
                <>
                  <input type="text" placeholder="File Path or URL" value={formData.fileReference} onChange={e => setFormData({...formData, fileReference: e.target.value})} className="w-full p-2 border rounded" />
                  <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded h-24"></textarea>
                </>
              ) : (
                <textarea
                  placeholder="Content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full p-2 border rounded h-24"
                ></textarea>
              )}
            </>
          )}

          <input
            type="text"
            placeholder="Tags (comma-separated)"
            onChange={(e) => setFormData({...formData, tags: e.target.value})}
            className="w-full p-2 border rounded"
          />

          {/* Link to existing atoms */}
          <div>
            <h3 className="font-medium mb-2">Link to existing atoms</h3>
            <div className="max-h-40 overflow-y-auto border rounded p-2 space-y-1">
              {existingAtoms.map(atom => (
                <div key={atom.id} className="flex items-center justify-between p-1 hover:bg-gray-100 rounded">
                  <span>{atom.title}</span>
                  <button
                    onClick={() => toggleLink(atom.id)}
                    className={`px-2 py-0.5 text-xs rounded ${formData.linkedTo.includes(atom.id) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    {formData.linkedTo.includes(atom.id) ? 'Linked' : 'Link'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded bg-blue-600 text-white">Create</button>
        </div>
      </div>
    </div>
  );
};

export default CreateAtomModal;
