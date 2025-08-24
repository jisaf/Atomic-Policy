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

  const baseInputClasses = "w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow";
  const disabledInputClasses = "bg-gray-100 cursor-not-allowed";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col transform transition-transform duration-300 scale-95" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Create New Atom</h2>
        </div>
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Atom Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Atom Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value, title: '', content: '' })}
              className={baseInputClasses}
            >
              {Object.entries(atomTypes).map(([key, type]) => (
                <option key={key} value={key}>{type.label}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">{atomTypes[formData.type].description}</p>
          </div>

          {/* Dynamic Form Fields */}
          {formData.type === 'experiment' ? (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
              <input type="text" placeholder="Search for a bill..." onChange={(e) => handleFetchBills(e.target.value)} className={baseInputClasses} />
              {loading && <p className="text-blue-600">Loading...</p>}
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <select
                className={baseInputClasses}
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
                className={baseInputClasses}
                onChange={(e) => setFormData({...formData, sectionTitle: e.target.value})}
              >
                <option>Select a section</option>
                {billSections.map(section => <option key={section.id} value={section.title}>{section.title}</option>)}
              </select>
              <input type="text" value={formData.title} readOnly placeholder="Title (auto-generated)" className={`${baseInputClasses} ${disabledInputClasses}`} />
              <textarea value={formData.content} readOnly placeholder="Content (auto-generated)" className={`${baseInputClasses} ${disabledInputClasses} h-28`}></textarea>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className={baseInputClasses}
              />
              {formData.type === 'recommendation' ? (
                <>
                  <input type="text" placeholder="File Path or URL" value={formData.fileReference} onChange={e => setFormData({...formData, fileReference: e.target.value})} className={baseInputClasses} />
                  <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className={`${baseInputClasses} h-28`}></textarea>
                </>
              ) : (
                <textarea
                  placeholder="Content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className={`${baseInputClasses} h-28`}
                ></textarea>
              )}
            </div>
          )}

          <input
            type="text"
            placeholder="Tags (comma-separated)"
            onChange={(e) => setFormData({...formData, tags: e.target.value})}
            className={baseInputClasses}
          />

          {/* Link to existing atoms */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Link to existing atoms</h3>
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1 bg-gray-50">
              {existingAtoms.map(atom => (
                <div key={atom.id} className="flex items-center justify-between p-2 hover:bg-gray-200/50 rounded-md">
                  <span className="text-sm font-medium text-gray-700">{atom.title}</span>
                  <button
                    onClick={() => toggleLink(atom.id)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${formData.linkedTo.includes(atom.id) ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    {formData.linkedTo.includes(atom.id) ? 'Linked' : 'Link'}
                  </button>
                </div>
              ))}
              {existingAtoms.length === 0 && <p className="text-sm text-gray-500 text-center p-4">No other atoms exist to link to.</p>}
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">Create Atom</button>
        </div>
      </div>
    </div>
  );
};

export default CreateAtomModal;
