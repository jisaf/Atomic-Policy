import React, { useState, useEffect } from 'react';
import {
  Modal, Box, Typography, Select, MenuItem, TextField, Button,
  FormControl, InputLabel, Grid, CircularProgress, Alert,
  List, ListItem, ListItemText, IconButton, Autocomplete
} from '@mui/material';
import { Link, LinkOff } from '@mui/icons-material';


const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 700,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 0,
  borderRadius: 2,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '90vh',
};

const CreateAtomModal = ({ onClose, onCreate, atomTypes, existingAtoms }) => {
  const [formData, setFormData] = useState({
    type: 'experiment',
    title: '',
    billType: 'hr',
    billNumber: '',
    congress: '119',
    billTitle: '',
    sectionTitle: '',
    content: '',
    fileReference: '',
    description: '',
    tags: '',
    linkedTo: []
  });

  const [loading, setLoading] = useState(false);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [error, setError] = useState('');
  const [manualEntry, setManualEntry] = useState(false);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);

  const handleFetchBillTitle = async () => {
    if (!formData.billNumber || !formData.billType || !formData.congress) return;
    setLoading(true);
    setError('');
    setManualEntry(false);
    setSections([]);
    setSelectedSection(null);

    try {
      const { congress, billType, billNumber } = formData;
      const response = await fetch(`/api/congress?congress=${congress}&billType=${billType}&billNumber=${billNumber}`);
      const data = await response.json();

      if (response.ok) {
        setFormData(prev => ({ ...prev, billTitle: data.title, title: `${billType.toUpperCase()}${billNumber} - ${data.title}` }));
        fetchSections(congress, billType, billNumber);
      } else {
        setError(data.error || 'Bill not found. You can enter the title manually.');
        setManualEntry(true);
        setFormData(prev => ({ ...prev, billTitle: '', title: '' }));
      }
    } catch (err) {
      setError('Failed to fetch bill title: ' + err.message);
      setManualEntry(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchSections = async (congress, billType, billNumber) => {
    setSectionsLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/congress?congress=${congress}&billType=${billType}&billNumber=${billNumber}&text=true`);
      const data = await response.json();
      if (response.ok && data.sections) {
        setSections(data.sections);
        if (data.sections.length === 0) {
          setError('No sections could be automatically extracted from this bill.');
        }
      } else {
        setError(data.error || 'Could not load sections for this bill.');
      }
    } catch (err) {
      setError('Failed to fetch bill sections: ' + err.message);
    } finally {
      setSectionsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSection) {
      setFormData(prev => ({
        ...prev,
        sectionTitle: selectedSection.header,
        content: selectedSection.content
      }));
    }
  }, [selectedSection]);

  const handleSubmit = () => {
    if (!formData.title.trim()) return;

    if (formData.type === 'experiment' && (!formData.billNumber || !formData.billTitle)) return;
    if (['fact', 'insight'].includes(formData.type) && !formData.content.trim()) return;
    if (formData.type === 'recommendation' && !formData.fileReference.trim()) return;

    const atomData = {
      type: formData.type,
      title: formData.title,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      linkedTo: formData.linkedTo
    };

    if (formData.type === 'experiment') {
      atomData.billNumber = `${formData.billType.toUpperCase()}${formData.billNumber}`;
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
    <Modal open={true} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Create New Atom</Typography>
        </Box>
        <Box sx={{ p: 3, overflowY: 'auto', spaceY: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Atom Type</InputLabel>
            <Select
              value={formData.type}
              label="Atom Type"
              onChange={(e) => setFormData({ ...formData, type: e.target.value, title: '', content: '' })}
              data-testid="atom-type-select"
            >
              {Object.entries(atomTypes).map(([key, type]) => (
                <MenuItem key={key} value={key}>{type.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {formData.type === 'experiment' ? (
            <Box sx={{ mt: 2, spaceY: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField fullWidth label="Congress" value={formData.congress} onChange={e => setFormData({...formData, congress: e.target.value})} />
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel>Bill Type</InputLabel>
                    <Select label="Bill Type" value={formData.billType} onChange={e => setFormData({...formData, billType: e.target.value})}>
                      <MenuItem value="hr">H.R.</MenuItem>
                      <MenuItem value="s">S.</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <TextField fullWidth label="Bill Number" value={formData.billNumber} onChange={e => setFormData({...formData, billNumber: e.target.value})} />
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button onClick={handleFetchBillTitle} variant="contained" sx={{ flexGrow: 1 }} disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : 'Fetch Bill Title'}
                </Button>
                <Button onClick={() => setManualEntry(!manualEntry)} variant="outlined">
                  {manualEntry ? 'Disable Manual Entry' : 'Manual Entry'}
                </Button>
              </Box>
              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
              {manualEntry ? (
                <>
                  <TextField
                    fullWidth
                    label="Bill Title"
                    placeholder="Enter Bill Title"
                    value={formData.billTitle}
                    onChange={e => setFormData({...formData, billTitle: e.target.value, title: `${formData.billType.toUpperCase()}${formData.billNumber} - ${e.target.value}`})}
                    sx={{ mt: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Atom Title"
                    placeholder="Enter Atom Title"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    sx={{ mt: 2 }}
                  />
                </>
              ) : (
                <TextField fullWidth label="Title (auto-generated)" value={formData.title} InputProps={{ readOnly: true }} sx={{ mt: 2 }} data-testid="title-auto-generated" />
              )}

              {sectionsLoading && <CircularProgress sx={{ mt: 2 }} />}
              {!manualEntry && sections.length > 0 && (
                <Autocomplete
                  sx={{ mt: 2 }}
                  options={sections}
                  getOptionLabel={(option) => `${option.number} ${option.header}`}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Box>
                        <Typography variant="subtitle2">{option.number} {option.header}</Typography>
                        <Typography variant="body2" color="text.secondary">{option.content.substring(0, 100)}...</Typography>
                      </Box>
                    </li>
                  )}
                  renderInput={(params) => <TextField {...params} label="Select a Section" />}
                  onChange={(event, newValue) => {
                    setSelectedSection(newValue);
                  }}
                  value={selectedSection}
                />
              )}

              {selectedSection && (
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  label="Section Content"
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  sx={{ mt: 2 }}
                />
              )}
            </Box>
          ) : (
            <Box sx={{ mt: 2, spaceY: 2 }}>
              <TextField fullWidth label="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} sx={{ mb: 2 }}/>
              {formData.type === 'recommendation' ? (
                <>
                  <TextField fullWidth label="File Path or URL" value={formData.fileReference} onChange={e => setFormData({...formData, fileReference: e.target.value})} sx={{ mb: 2 }} />
                  <TextField fullWidth multiline rows={4} label="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </>
              ) : (
                <TextField fullWidth multiline rows={4} label="Content" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} />
              )}
            </Box>
          )}

          <TextField fullWidth label="Tags (comma-separated)" onChange={(e) => setFormData({...formData, tags: e.target.value})} sx={{ my: 2 }}/>

          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Link to existing atoms</Typography>
            <List dense sx={{ maxHeight: 150, overflow: 'auto', border: 1, borderColor: 'divider', borderRadius: 1 }}>
              {existingAtoms.map(atom => (
                <ListItem
                  key={atom.id}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => toggleLink(atom.id)}>
                      {formData.linkedTo.includes(atom.id) ? <LinkOff color="error"/> : <Link />}
                    </IconButton>
                  }
                >
                  <ListItemText primary={atom.title} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Create</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateAtomModal;
