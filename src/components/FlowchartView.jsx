import React, { useRef, useState, useEffect, createRef } from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';

const FlowchartView = ({ atoms, atomTypes, onAtomClick, allAtoms }) => {
  const containerRef = useRef();
  const [lines, setLines] = useState([]);
  const itemRefs = useRef(new Map());

  useEffect(() => {
    itemRefs.current.clear();
    atoms.forEach(atom => {
      itemRefs.current.set(atom.id, createRef());
    });
  }, [atoms]);

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

    // Calculate lines on mount and on atom changes
    calculateLines();

    // Recalculate on resize
    const resizeObserver = new ResizeObserver(calculateLines);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();

  }, [atoms, allAtoms]);

  const groupedAtoms = Object.keys(atomTypes).map(type => ({
    type,
    label: atomTypes[type].label,
    atoms: atoms.filter(atom => atom.type === type),
  }));

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        overflowX: 'auto',
        backgroundColor: 'white',
      }}
    >
      <Grid container spacing={5} wrap="nowrap">
        {groupedAtoms.map(({ type, label, atoms: groupAtoms }) => (
          <Grid item key={type} xs={3} sx={{ minWidth: 300 }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
              {label}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {groupAtoms.map(atom => (
                <Card
                  key={atom.id}
                  ref={itemRefs.current.get(atom.id)}
                  onClick={() => onAtomClick(atom)}
                  sx={{
                    cursor: 'pointer',
                    borderLeft: 4,
                    borderColor: atomTypes[atom.type]?.borderColor || 'grey.400',
                    '&:hover': {
                      boxShadow: 3,
                    },
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <CardContent>
                    <Typography variant="body1" fontWeight="bold">
                      {atom.title}
                    </Typography>
                    {atom.tags && (
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
                        {atom.tags.map((tag, index) => (
                          <Typography
                            key={index}
                            variant="caption"
                            sx={{
                              bgcolor: 'primary.main',
                              color: 'white',
                              px: 1,
                              py: 0.5,
                              borderRadius: '4px',
                            }}
                          >
                            {tag}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Grid>
        ))}
      </Grid>
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
            d={`M ${line.x1} ${line.y1} C ${line.x1 + 100} ${line.y1} ${line.x2 - 100} ${line.y2} ${line.x2} ${line.y2}`}
            stroke="#94a3b8"
            strokeWidth="2"
            fill="none"
          />
        ))}
      </svg>
      {atoms.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: 200 }}>
          <Typography variant="h6" color="text.secondary">
            {allAtoms.length === 0
              ? 'No atoms yet. Create your first one!'
              : 'No atoms match your search.'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FlowchartView;
