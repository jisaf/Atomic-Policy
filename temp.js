import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Link2, Tag, FileText, Lightbulb, Target, Beaker, Grid3X3, GitBranch } from 'lucide-react';
import * as d3 from 'd3';

// Congress API configuration
const CONGRESS_API_KEY = 'Z7n4T557iCNAIm9gzI5cFwuVUDhGuOaBKgNEkOQO';
const CONGRESS_API_BASE = 'https://api.congress.gov/v3';

// Simple state management without external libraries (following React best practices)
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
                         atom.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

const FlowchartView = ({ atoms, atomTypes, onAtomClick, allAtoms }) => {
  const svgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      const container = svgRef.current?.parentElement;
      if (container) {
        setDimensions({
          width: container.offsetWidth,
          height: Math.max(600, container.offsetHeight)
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!atoms.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr('width', dimensions.width).attr('height', dimensions.height);

    // Create links data
    const links = [];
    const linkSet = new Set();

    atoms.forEach(atom => {
      (atom.linkedTo || []).forEach(linkedId => {
        const linkedAtom = allAtoms.find(a => a.id === linkedId);
        if (linkedAtom && atoms.find(a => a.id === linkedId)) {
          const linkKey = [atom.id, linkedId].sort().join('-');
          if (!linkSet.has(linkKey)) {
            links.push({ source: atom.id, target: linkedId });
            linkSet.add(linkKey);
          }
        }
      });
    });

    // Prepare nodes
    const nodes = atoms.map(atom => ({
      id: atom.id,
      ...atom,
      x: dimensions.width / 2 + (Math.random() - 0.5) * 100,
      y: dimensions.height / 2 + (Math.random() - 0.5) * 100
    }));

    // Force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(200).strength(0.5))
      .force('charge', d3.forceManyBody().strength(-800))
      .force('center', d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force('collision', d3.forceCollide().radius(120));

    // Create links
    const linkElements = svg.selectAll('.link')
      .data(links)
      .enter().append('line')
      .attr('class', 'link')
      .attr('stroke', '#666')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6);

    // Drag functions
    const dragStarted = (event, d) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    };

    const dragged = (event, d) => {
      d.fx = event.x;
      d.fy = event.y;
    };

    const dragEnded = (event, d) => {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    };

    // Create node groups
    const cardNodes = svg.selectAll('.node')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .call(d3.drag()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded))
      .on('click', (event, d) => onAtomClick(d));

    // Add card backgrounds
    cardNodes.append('rect')
      .attr('x', -90)
      .attr('y', -40)
      .attr('width', 180)
      .attr('height', 80)
      .attr('rx', 8)
      .attr('fill', d => {
        const colors = {
          experiment: '#dbeafe',
          fact: '#dcfce7',
          insight: '#fef3c7',
          recommendation: '#e9d5ff'
        };
        return colors[d.type] || '#f3f4f6';
      })
      .attr('stroke', d => {
        const colors = {
          experiment: '#3b82f6',
          fact: '#10b981',
          insight: '#f59e0b',
          recommendation: '#8b5cf6'
        };
        return colors[d.type] || '#6b7280';
      })
      .attr('stroke-width', 2);

    // Add text content
    cardNodes.append('text')
      .attr('x', -85)
      .attr('y', -25)
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('fill', '#6b7280')
      .text(d => atomTypes[d.type].label.toUpperCase());

    cardNodes.append('text')
      .attr('x', -85)
      .attr('y', -8)
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', '#374151')
      .style('pointer-events', 'none')
      .text(d => d.title.length > 20 ? d.title.substring(0, 20) + '...' : d.title);

    // Update positions on tick
    simulation.on('tick', () => {
      linkElements
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      cardNodes.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    return () => simulation.stop();
  }, [atoms, allAtoms, dimensions, onAtomClick, atomTypes]);

  return (
    <div className="w-full h-[600px] border border-gray-200 rounded-lg bg-white relative overflow-hidden">
      {atoms.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          {allAtoms.length === 0 ? "No atoms yet. Create your first one!" : "No atoms match your search."}
        </div>
      ) : (
        <>
          <svg ref={svgRef} className="w-full h-full" />
          <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg text-xs">
            <div className="font-medium mb-2">Legend</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 rounded bg-blue-200 border border-blue-400"></div>
                <span>Source text</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 rounded bg-green-200 border border-green-400"></div>
                <span>Plain language interpretation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 rounded bg-yellow-200 border border-yellow-400"></div>
                <span>Pseudo code</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 rounded bg-purple-200 border border-purple-400"></div>
                <span>Implementation</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t text-gray-600">
              <div>🔴 Connections</div>
              <div className="mt-1">Drag cards to rearrange</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

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

  // Congress API functions
  const fetchBills = async (searchTerm = '') => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        api_key: CONGRESS_API_KEY,
        format: 'json',
        limit: '20'
      });
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`${CONGRESS_API_BASE}/bill/119?${params}`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      setBills(data.bills || []);
    } catch (err) {
      setError('Failed to fetch bills: ' + err.message);
      console.error('Bills API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBillText = async (billType, billNumber, congress = '119') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        api_key: CONGRESS_API_KEY,
        format: 'json'
      });

      const response = await fetch(`${CONGRESS_API_BASE}/bill/${congress}/${billType}/${billNumber}/text?${params}`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Parse sections from bill text (simplified parsing)
      const sections = [];
      if (data.textVersions && data.textVersions.length > 0) {
        // Use the latest version
        const latestVersion = data.textVersions[0];
        
        // Create mock sections for demonstration (real implementation would parse XML)
        sections.push(
          { id: 'short-title', title: 'Short Title', content: `${formData.billTitle} - Short Title Section` },
          { id: 'findings', title: 'Findings', content: `Findings section of ${formData.billTitle}` },
          { id: 'definitions', title: 'Definitions', content: `Definitions section of ${formData.billTitle}` }
        );
      }
      
      setBillSections(sections);
    } catch (err) {
      setError('Failed to fetch bill text: ' + err.message);
      console.error('Bill Text API Error:', err);
      setBillSections([]);
    } finally {
      setLoading(false);
    }
  };

  // Load bills on component mount
  useEffect(() => {
    fetchBills();
  }, []);

  // Auto-populate content when bill and section are selected
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
      <div className="bg-white
