import React from 'react';

const AtomDetailModal = ({ atom, onClose, atomTypes, atoms, onLink }) => {
  if (!atom) return null;
  const typeConfig = atomTypes[atom.type];
  const linkedAtoms = (atom.linkedTo || []).map(id => atoms.find(a => a.id === id)).filter(Boolean);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">{atom.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
        </div>
        <div className="p-4 space-y-4 overflow-y-auto">
          <div className="flex items-center gap-2">
            <typeConfig.icon size={16} />
            <span className="font-medium">{typeConfig.label}</span>
          </div>
          <p className="text-gray-700">{atom.content}</p>
          <div className="flex flex-wrap gap-2">
            {atom.tags.map(tag => <span key={tag} className="bg-gray-200 px-2 py-1 rounded-full text-sm">{tag}</span>)}
          </div>
          <div>
            <h3 className="font-medium">Linked Atoms</h3>
            <ul className="list-disc pl-5">
              {linkedAtoms.map(linked => <li key={linked.id}>{linked.title}</li>)}
            </ul>
          </div>
        </div>
        <div className="p-4 border-t">
          {/* Simple linking UI for demonstration */}
          <h4 className="font-medium mb-2">Link another atom</h4>
          <select onChange={(e) => onLink(atom.id, e.target.value)} className="w-full p-2 border rounded">
            <option>Select an atom to link</option>
            {atoms.filter(a => a.id !== atom.id && !(atom.linkedTo || []).includes(a.id)).map(a => (
              <option key={a.id} value={a.id}>{a.title}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default AtomDetailModal;
