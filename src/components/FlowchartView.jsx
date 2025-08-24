import React, { useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';

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

export default FlowchartView;
