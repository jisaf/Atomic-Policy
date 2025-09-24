import React, { useRef, useState, useEffect, createRef } from 'react';
import { Box, Typography } from '@mui/material';
import AtomCard from './AtomCard';
import Column from './Column';

const FlowchartView = ({ atoms, filteredAtoms, atomTypes, onAtomClick }) => {
  const containerRef = useRef();
  const [lines, setLines] = useState([]);
  const itemRefs = useRef(new Map());

  useEffect(() => {
    itemRefs.current.clear();
    filteredAtoms.forEach(atom => {
      itemRefs.current.set(atom.id, createRef());
    });
  }, [filteredAtoms]);

  useEffect(() => {
    const calculateLines = () => {
      if (!containerRef.current) return;

      const newLines = [];
      const containerRect = containerRef.current.getBoundingClientRect();

      atoms.forEach(atom => {
        if (atom.linkedTo) {
          atom.linkedTo.forEach(linkedId => {
            const sourceNode = itemRefs.current.get(atom.id)?.current;
            const targetNode = itemRefs.current.get(linkedId)?.current;

            if (sourceNode && targetNode) {
              const sourceRect = sourceNode.getBoundingClientRect();
              const targetRect = targetNode.getBoundingClientRect();

              newLines.push({
                x1: sourceRect.right - containerRect.left,
                y1: sourceRect.top + sourceRect.height / 2 - containerRect.top,
                x2: targetRect.left - containerRect.left,
                y2: targetRect.top + targetRect.height / 2 - containerRect.top,
                key: `${atom.id}-${linkedId}`,
              });
            }
          });
        }
      });
      setLines(newLines);
    };

    calculateLines();
    const resizeObserver = new ResizeObserver(calculateLines);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [atoms, filteredAtoms]);

  const columns = {
    facts: filteredAtoms.filter(atom => atom.type === 'experiment'),
    insights: filteredAtoms.filter(atom => atom.type === 'fact'),
    recommendations: filteredAtoms.filter(atom => atom.type === 'insight'),
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        display: 'flex',
        gap: 2,
        p: 2,
        overflowX: 'auto',
        minHeight: 'calc(100vh - 200px)',
        alignItems: 'flex-start',
      }}
    >
      <Column title="FACTS">
        {columns.facts.map(atom => (
          <AtomCard
            key={atom.id}
            ref={itemRefs.current.get(atom.id)}
            atom={atom}
            atomTypes={atomTypes}
            onSelect={onAtomClick}
            atoms={atoms}
            isExpanded={true}
          />
        ))}
      </Column>
      <Column title="INSIGHTS">
        {columns.insights.map(atom => (
          <AtomCard
            key={atom.id}
            ref={itemRefs.current.get(atom.id)}
            atom={atom}
            atomTypes={atomTypes}
            onSelect={onAtomClick}
            atoms={atoms}
          />
        ))}
      </Column>
      <Column title="RECOMMENDATION">
        {columns.recommendations.map(atom => (
          <AtomCard
            key={atom.id}
            ref={itemRefs.current.get(atom.id)}
            atom={atom}
            atomTypes={atomTypes}
            onSelect={onAtomClick}
            atoms={atoms}
          />
        ))}
      </Column>
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {lines.map(line => (
          <path
            key={line.key}
            d={`M ${line.x1} ${line.y1} C ${line.x1 + 60} ${line.y1} ${line.x2 - 60} ${line.y2} ${line.x2} ${line.y2}`}
            stroke="#94a3b8"
            strokeWidth="2"
            fill="none"
          />
        ))}
      </svg>
      {filteredAtoms.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: 200, width: '100%' }}>
          <Typography variant="h6" color="text.secondary">
            {atoms.length === 0
              ? 'No atoms yet. Create your first one!'
              : 'No atoms match your search.'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FlowchartView;
