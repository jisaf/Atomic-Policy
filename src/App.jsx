import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
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
    <div className="min-h-screen bg-gray-50">
      <Analytics />
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">Atomic UX Research</h1>
              <div className="flex bg-gray-100 rounded-md p-1 ml-4">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <Grid3X3 size={14} />
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('flowchart')}
                  className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${
                    viewMode === 'flowchart' ? 'bg-white shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <GitBranch size={14} />
                  Flow
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus size={16} /> Add Atom
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="mb-6 flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search atoms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            {Object.entries(atomTypes).map(([key, type]) => (
              <option key={key} value={key}>{type.label}</option>
            ))}
          </select>
        </div>

        {/* Atom Cards Grid or Flowchart */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
              <div className="col-span-full text-center py-12 text-gray-500">
                {atoms.length === 0 ? "No atoms yet. Create your first one!" : "No atoms match your search."}
              </div>
            )}
          </div>
        ) : (
          <FlowchartView
            atoms={filteredAtoms}
            atomTypes={atomTypes}
            onAtomClick={setSelectedAtom}
            allAtoms={atoms}
          />
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateAtomModal
          onClose={() => setShowCreateModal(false)}
          onCreate={createAtom}
          atomTypes={atomTypes}
          existingAtoms={atoms}
        />
      )}

      {/* Detail Modal */}
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
