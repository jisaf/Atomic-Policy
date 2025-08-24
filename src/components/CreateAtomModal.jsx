import React, { useState } from 'react';

const CreateAtomModal = ({ onClose, onCreate, atomTypes, existingAtoms }) => {
  const [formData, setFormData] = useState({
    type: 'experiment',
    title: '',
    billType: 'hr',
    billNumber: '',
    congress: '119',
    billTitle: '',
    sectionTitle: '',
    content: '',
    fileReference: '',
    description: '',
    tags: '',
    linkedTo: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetchBillTitle = async () => {
    if (!formData.billNumber || !formData.billType || !formData.congress) return;
    setLoading(true);
    setError('');
    try {
      const { congress, billType, billNumber } = formData;
      const response = await fetch(`/api/govinfo?congress=${congress}&billType=${billType}&billNumber=${billNumber}`);
      const data = await response.json();

      if (response.ok) {
        setFormData(prev => ({ ...prev, billTitle: data.title, title: `${billType.toUpperCase()}${billNumber} - ${data.title}` }));
      } else {
        setError(data.error || 'Bill not found.');
        setFormData(prev => ({ ...prev, billTitle: '', title: '' }));
      }
    } catch (err) {
      setError('Failed to fetch bill title: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) return;

    if (formData.type === 'experiment' && (!formData.billNumber || !formData.billTitle)) return;
    if (['fact', 'insight'].includes(formData.type) && !formData.content.trim()) return;
    if (formData.type === 'recommendation' && !formData.fileReference.trim()) return;

    const atomData = {
      type: formData.type,
      title: formData.title,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      linkedTo: formData.linkedTo
    };

    if (formData.type === 'experiment') {
      atomData.billNumber = `${formData.billType.toUpperCase()}${formData.billNumber}`;
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
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Congress (e.g., 119)"
                  value={formData.congress}
                  onChange={e => setFormData({...formData, congress: e.target.value})}
                  className="p-2 border rounded"
                />
                <select
                  value={formData.billType}
                  onChange={e => setFormData({...formData, billType: e.target.value})}
                  className="p-2 border rounded"
                >
                  <option value="hr">H.R.</option>
                  <option value="s">S.</option>
                </select>
                <input
                  type="text"
                  placeholder="Bill Number"
                  value={formData.billNumber}
                  onChange={e => setFormData({...formData, billNumber: e.target.value})}
                  className="p-2 border rounded"
                />
              </div>
              <button onClick={handleFetchBillTitle} className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Fetch Bill Title</button>
              {loading && <p>Loading...</p>}
              {error && <p className="text-red-500">{error}</p>}
              <input type="text" value={formData.title} readOnly placeholder="Title (auto-generated)" className="w-full p-2 border rounded bg-gray-100" />
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
