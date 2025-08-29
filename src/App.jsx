import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import {
  Search,
  Plus,
  Grid3X3,
  GitBranch,
  Beaker,
  FileText,
  Lightbulb,
  Target
} from 'lucide-react';
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  Grid,
} from '@mui/material';

import AtomCard from './components/AtomCard';
import FlowchartView from './components/FlowchartView';
import CreateAtomModal from './components/CreateAtomModal';
import AtomDetailModal from './components/AtomDetailModal';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3b82f6',
    },
    secondary: {
      main: '#64748b',
    },
    background: {
      default: '#f8fafc',
    },
  },
});

const AtomicUXApp = () => {
  const [atoms, setAtoms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAtom, setSelectedAtom] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [lastBill, setLastBill] = useState(null);
  const [lastAtom, setLastAtom] = useState(null);

  const atomTypes = {
    experiment: {
      label: 'Source text',
      icon: Beaker,
      color: 'primary.light',
      borderColor: 'primary.main',
      description: 'Select a specific bill section',
    },
    fact: {
      label: 'Plain language interpretation',
      icon: FileText,
      color: 'success.light',
      borderColor: 'success.main',
      description: 'Explain in simple terms',
    },
    insight: {
      label: 'Pseudo code',
      icon: Lightbulb,
      color: 'warning.light',
      borderColor: 'warning.main',
      description: 'Your interpretation in code-like logic',
    },
    recommendation: {
      label: 'Implementation',
      icon: Target,
      color: 'secondary.light',
      borderColor: 'secondary.main',
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

  const createAtom = (atomData) => {
    const newAtom = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...atomData,
    };
    if (atomData.type === 'experiment') {
      setLastBill({
        billType: atomData.billType,
        billNumber: atomData.billNumber,
        congress: atomData.congress,
      });
    }
    setAtoms([...atoms, newAtom]);
    setLastAtom(newAtom);
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

  const handleViewModeChange = (event, newViewMode) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Analytics />
        <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: 'white' }}>
          <Container maxWidth="xl">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                Atomic UX Research
              </Typography>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewModeChange}
                aria-label="view mode"
                size="small"
              >
                <ToggleButton value="grid" aria-label="grid view">
                  <Grid3X3 size={14} />
                  <Box component="span" sx={{ ml: 1 }}>Grid</Box>
                </ToggleButton>
                <ToggleButton value="flowchart" aria-label="flowchart view">
                  <GitBranch size={14} />
                  <Box component="span" sx={{ ml: 1 }}>Flow</Box>
                </ToggleButton>
              </ToggleButtonGroup>
              <Button
                variant="contained"
                startIcon={<Plus size={16} />}
                onClick={() => setShowCreateModal(true)}
                sx={{ ml: 2 }}
              >
                Add Atom
              </Button>
            </Toolbar>
          </Container>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder="Search atoms..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ flexGrow: 1, maxWidth: 400 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} />
                  </InputAdornment>
                ),
              }}
            />
            <Select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              size="small"
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
                <Grid item key={atom.id} xs={12} sm={6} md={4} lg={3}>
                  <AtomCard
                    atom={atom}
                    atomTypes={atomTypes}
                    onSelect={setSelectedAtom}
                    atoms={atoms}
                  />
                </Grid>
              ))}
              {filteredAtoms.length === 0 && (
                <Grid item xs={12}>
                  <Typography align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    {atoms.length === 0
                      ? 'No atoms yet. Create your first one!'
                      : 'No atoms match your search.'}
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
            key={Date.now()}
            onClose={() => setShowCreateModal(false)}
            onCreate={createAtom}
            atomTypes={atomTypes}
            existingAtoms={atoms}
            lastBill={lastBill}
            lastAtom={lastAtom}
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
    </ThemeProvider>
  );
};

export default AtomicUXApp;
