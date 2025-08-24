import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  TextField,
  Select,
  MenuItem,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  GridView as GridViewIcon,
  AccountTree as AccountTreeIcon,
  Science as ScienceIcon,
  Notes as NotesIcon,
  Code as CodeIcon,
  TrackChanges as TrackChangesIcon,
} from '@mui/icons-material';

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
      icon: ScienceIcon,
      description: 'Select a specific bill section',
    },
    fact: {
      label: 'Plain language interpretation',
      icon: NotesIcon,
      description: 'Explain in simple terms',
    },
    insight: {
      label: 'Pseudo code',
      icon: CodeIcon,
      description: 'Your interpretation in code-like logic',
    },
    recommendation: {
      label: 'Implementation',
      icon: TrackChangesIcon,
      description: 'Reference to actual implementation',
    },
  };

  const filteredAtoms = atoms.filter(atom => {
    const matchesSearch =
      atom.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (atom.content && atom.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
      atom.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || atom.type === selectedType;
    return matchesSearch && matchesType;
  });

  const createAtom = atomData => {
    const newAtom = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...atomData,
    };
    setAtoms([...atoms, newAtom]);
    setShowCreateModal(false);
  };

  const linkAtoms = (fromId, toId) => {
    setAtoms(
      atoms.map(atom => {
        if (atom.id === fromId) {
          return { ...atom, linkedTo: [...(atom.linkedTo || []), toId] };
        }
        return atom;
      })
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Analytics />
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Atomic UX Research
          </Typography>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newViewMode) => setViewMode(newViewMode)}
            aria-label="view mode"
          >
            <ToggleButton value="grid" aria-label="grid view">
              <GridViewIcon />
            </ToggleButton>
            <ToggleButton value="flowchart" aria-label="flowchart view">
              <AccountTreeIcon />
            </ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowCreateModal(true)}
            sx={{ ml: 2 }}
          >
            Add Atom
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            variant="outlined"
            placeholder="Search atoms..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, maxWidth: 400 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            variant="outlined"
          >
            <MenuItem value="all">All Types</MenuItem>
            {Object.entries(atomTypes).map(([key, type]) => (
              <MenuItem key={key} value={key}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {viewMode === 'grid' ? (
          <Grid container spacing={2}>
            {filteredAtoms.map(atom => (
              <Grid key={atom.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <AtomCard
                  atom={atom}
                  atomTypes={atomTypes}
                  onSelect={setSelectedAtom}
                  atoms={atoms}
                />
              </Grid>
            ))}
            {filteredAtoms.length === 0 && (
              <Grid size={{ xs: 12 }} sx={{ textAlign: 'center', py: 8 }}>
                <Typography color="text.secondary">
                  {atoms.length === 0 ? 'No atoms yet. Create your first one!' : 'No atoms match your search.'}
                </Typography>
              </Grid>
            )}
          </Grid>
        ) : (
          <FlowchartView
            atoms={filteredAtoms}
            atomTypes={atomTypes}
            onAtomClick={setSelectedAtom}
            allAtoms={atoms}
          />
        )}
      </Container>

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
    </Box>
  );
};

export default AtomicUXApp;
