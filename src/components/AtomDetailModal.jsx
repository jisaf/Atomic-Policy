import React from 'react';

const AtomDetailModal = ({ atom, onClose, atomTypes, atoms, onLink }) => {
  if (!atom) return null;
  const typeConfig = atomTypes[atom.type];
  const linkedAtoms = (atom.linkedTo || []).map(id => atoms.find(a => a.id === id)).filter(Boolean);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col transform transition-transform duration-300 scale-95" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 line-clamp-1">{atom.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">&times;</button>
        </div>
        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${typeConfig.color} flex items-center justify-center`}>
              <typeConfig.icon size={20} className="text-gray-700" />
            </div>
            <div>
              <span className="font-semibold text-gray-800">{typeConfig.label}</span>
              <p className="text-sm text-gray-500">
                Created on {new Date(atom.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="prose max-w-none text-gray-700">
            <p>{atom.content}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {atom.tags.map(tag => (
              <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium">{tag}</span>
            ))}
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3 text-lg">Linked Atoms</h3>
            <div className="space-y-2">
              {linkedAtoms.map(linked => {
                const LinkedIcon = atomTypes[linked.type].icon;
                return (
                  <div key={linked.id} className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${atomTypes[linked.type].color} flex items-center justify-center shrink-0`}>
                      <LinkedIcon size={16} className="text-gray-700" />
                    </div>
                    <span className="font-medium text-gray-700">{linked.title}</span>
                  </div>
                );
              })}
              {linkedAtoms.length === 0 && <p className="text-gray-500">No atoms linked yet.</p>}
            </div>
          </div>
        </div>
        <div className="p-5 bg-gray-50 border-t border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-2">Link another atom</h4>
          <select
            onChange={(e) => {
              if (e.target.value) onLink(atom.id, e.target.value);
            }}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            defaultValue=""
          >
            <option value="" disabled>Select an atom to link</option>
            {atoms
              .filter(a => a.id !== atom.id && !(atom.linkedTo || []).includes(a.id))
              .map(a => (
                <option key={a.id} value={a.id}>{a.title}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default AtomDetailModal;
