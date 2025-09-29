import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import ReactFlow, { Background, Controls, MiniMap } from '@xyflow/react';
import AtomCard from './AtomCard';

import '@xyflow/react/dist/style.css';

const nodeTypes = {
  atom: AtomCard,
};

const FlowchartView = ({ atoms, filteredAtoms, atomTypes, onAtomClick }) => {
  const { nodes, edges } = useMemo(() => {
    const groupedAtoms = Object.keys(atomTypes).reduce((acc, type) => {
      acc[type] = filteredAtoms.filter(atom => atom.type === type);
      return acc;
    }, {});

    const initialNodes = [];
    const initialEdges = [];
    const columnWidth = 350;
    const nodeHeight = 400;

    Object.keys(groupedAtoms).forEach((type, colIndex) => {
      groupedAtoms[type].forEach((atom, rowIndex) => {
        initialNodes.push({
          id: atom.id,
          type: 'atom',
          position: { x: colIndex * columnWidth, y: rowIndex * nodeHeight },
          data: { atom, atomTypes, onAtomClick, isNode: true },
        });

        if (atom.linkedTo) {
          atom.linkedTo.forEach(linkedId => {
            initialEdges.push({
              id: `${atom.id}-${linkedId}`,
              source: atom.id,
              target: linkedId,
              animated: true,
              style: { stroke: '#475569', strokeWidth: 2 },
            });
          });
        }
      });
    });

    return { nodes: initialNodes, edges: initialEdges };
  }, [filteredAtoms, atomTypes, onAtomClick]);

  if (filteredAtoms.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: 200 }}>
        <Typography variant="h6" color="text.secondary">
          {atoms.length === 0
            ? 'No atoms yet. Create your first one!'
            : 'No atoms match your search.'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '80vh',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        backgroundColor: 'white',
      }}
    >
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </Box>
  );
};

export default FlowchartView;