import React from 'react';
import { Link2, Tag } from 'lucide-react';

const AtomCard = ({ atom, atomTypes, onSelect, atoms }) => {
  const typeConfig = atomTypes[atom.type];
  const IconComponent = typeConfig.icon;
  const linkedAtoms = (atom.linkedTo || []).map(id => atoms.find(a => a.id === id)).filter(Boolean);

  const getDisplayContent = () => {
    if (atom.type === 'experiment' && atom.billNumber && atom.sectionTitle) {
      return `${atom.billNumber} - ${atom.sectionTitle}`;
    } else if (atom.type === 'recommendation' && atom.fileReference) {
      return `📁 ${atom.fileReference}${atom.description ? ` - ${atom.description}` : ''}`;
    }
    return atom.content;
  };

  return (
    <div
      className={`${typeConfig.color} rounded-lg border-2 p-4 cursor-pointer hover:shadow-md transition-shadow`}
      onClick={() => onSelect(atom)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <IconComponent size={16} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-600">{typeConfig.label}</span>
        </div>
        {linkedAtoms.length > 0 && (
          <div className="flex items-center gap-1 text-gray-500">
            <Link2 size={14} />
            <span className="text-xs">{linkedAtoms.length}</span>
          </div>
        )}
      </div>

      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{atom.title}</h3>
      <p className="text-gray-700 text-sm mb-3 line-clamp-3">{getDisplayContent()}</p>

      <div className="flex flex-wrap gap-1 mb-2">
        {atom.tags.slice(0, 3).map(tag => (
          <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-white/50 rounded text-xs">
            <Tag size={10} />
            {tag}
          </span>
        ))}
        {atom.tags.length > 3 && (
          <span className="text-xs text-gray-500">+{atom.tags.length - 3} more</span>
        )}
      </div>

      <div className="text-xs text-gray-500">
        {new Date(atom.timestamp).toLocaleDateString()}
      </div>
    </div>
  );
};

export default AtomCard;
