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
      className={`bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:shadow-lg hover:border-blue-500 transition-all duration-300 flex flex-col justify-between h-full group`}
      onClick={() => onSelect(atom)}
    >
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full ${typeConfig.color} flex items-center justify-center`}>
              <IconComponent size={16} className="text-gray-700" />
            </div>
            <span className="text-sm font-semibold text-gray-700">{typeConfig.label}</span>
          </div>
          {linkedAtoms.length > 0 && (
            <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-blue-600 transition-colors">
              <Link2 size={14} />
              <span className="text-xs font-medium">{linkedAtoms.length}</span>
            </div>
          )}
        </div>

        <h3 className="font-bold text-gray-800 mb-2 leading-tight line-clamp-2">{atom.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{getDisplayContent()}</p>
      </div>

      <div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {atom.tags.slice(0, 3).map(tag => (
            <span key={tag} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
              <Tag size={12} />
              {tag}
            </span>
          ))}
          {atom.tags.length > 3 && (
            <span className="text-xs font-medium text-gray-500 mt-1.5">+{atom.tags.length - 3} more</span>
          )}
        </div>

        <div className="text-xs text-gray-400 font-medium">
          {new Date(atom.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
        </div>
      </div>
    </div>
  );
};

export default AtomCard;
