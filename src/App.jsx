import React, { useState } from 'react';
import { Search, Plus, Grid3X3, GitBranch, Beaker, FileText, Lightbulb, Target } from 'lucide-react';

import AtomCard from './components/AtomCard';
import FlowchartView from './components/FlowchartView';
import CreateAtomModal from './components/CreateAtomModal';
import AtomDetailModal from './components/AtomDetailModal';

const AtomicUXApp = () => {
  const [atoms, setAtoms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAtom, setSelectedAtom] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const atomTypes = {
    experiment: {
      label: 'Source text',
      icon: Beaker,
      color: 'bg-blue-100 border-blue-300',
      description: 'Select a specific bill section'
    },
    fact: {
      label: 'Plain language interpretation',
      icon: FileText,
      color: 'bg-green-100 border-green-300',
      description: 'Explain in simple terms'
    },
    insight: {
      label: 'Pseudo code',
      icon: Lightbulb,
      color: 'bg-yellow-100 border-yellow-300',
      description: 'Your interpretation in code-like logic'
    },
    recommendation: {
      label: 'Implementation',
      icon: Target,
      color: 'bg-purple-100 border-purple-300',
      description: 'Reference to actual implementation'
    }
  };

  const filteredAtoms = atoms.filter(atom => {
    const matchesSearch = atom.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (atom.content && atom.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         atom.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || atom.type === selectedType;
    return matchesSearch && matchesType;
  });

  const createAtom = (atomData) => {
    const newAtom = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...atomData
    };
    setAtoms([...atoms, newAtom]);
    setShowCreateModal(false);
  };

  const linkAtoms = (fromId, toId) => {
    setAtoms(atoms.map(atom => {
      if (atom.id === fromId) {
        return { ...atom, linkedTo: [...(atom.linkedTo || []), toId] };
      }
      return atom;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-800">Atomic Policy</h1>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <Grid3X3 size={16} />
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('flowchart')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
                    viewMode === 'flowchart' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <GitBranch size={16} />
                  Flow
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center gap-2 transition-all"
            >
              <Plus size={18} />
              <span>Add Atom</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full sm:w-auto">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search atoms by title, content, or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          >
            <option value="all">All Types</option>
            {Object.entries(atomTypes).map(([key, type]) => (
              <option key={key} value={key}>{type.label}</option>
            ))}
          </select>
        </div>

        {/* Atom Views */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAtoms.map(atom => (
              <AtomCard
                key={atom.id}
                atom={atom}
                atomTypes={atomTypes}
                onSelect={setSelectedAtom}
                atoms={atoms}
              />
            ))}
            {filteredAtoms.length === 0 && (
              <div className="col-span-full text-center py-16 text-gray-500">
                <h3 className="text-lg font-medium">{atoms.length === 0 ? "No atoms yet. Create your first one!" : "No atoms match your search."}</h3>
                <p className="text-sm mt-1">{atoms.length > 0 && "Try adjusting your search or filters."}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <FlowchartView
              atoms={filteredAtoms}
              atomTypes={atomTypes}
              onAtomClick={setSelectedAtom}
              allAtoms={atoms}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      {showCreateModal && (
        <CreateAtomModal
          onClose={() => setShowCreateModal(false)}
          onCreate={createAtom}
          atomTypes={atomTypes}
          existingAtoms={atoms}
        />
      )}

      {selectedAtom && (
        <AtomDetailModal
          atom={selectedAtom}
          onClose={() => setSelectedAtom(null)}
          atomTypes={atomTypes}
          atoms={atoms}
          onLink={linkAtoms}
        />
      )}
    </div>
  );
};

export default AtomicUXApp;
