import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Link as LinkIcon, LinkOff as LinkOffIcon } from '@mui/icons-material';

const CreateAtomModal = ({ onClose, onCreate, atomTypes, existingAtoms }) => {
  const [formData, setFormData] = useState({
    type: 'experiment',
    title: '',
    content: '',
    fileReference: '',
    description: '',
    tags: '',
    linkedTo: [],
    congress: '118',
    billType: 'hr',
    billNumber: '',
    billTitle: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = e => {
    setFormData(prev => ({
      ...prev,
      type: e.target.value,
      title: '',
      content: '',
      fileReference: '',
      description: '',
    }));
  };

  const handleFetchBillTitle = async () => {
    if (!formData.billNumber || !formData.billType || !formData.congress) return;
    setLoading(true);
    setError('');
    try {
      const { congress, billType, billNumber } = formData;
      // This is a placeholder for the actual API call.
      // In a real scenario, you would fetch from a server-side endpoint.
      // const response = await fetch(`/api/govinfo?congress=${congress}&billType=${billType}&billNumber=${billNumber}`);
      // const data = await response.json();
      const data = { title: `A bill to do something great for the ${billNumber}th time.` };
      const response = { ok: true };

      if (response.ok) {
        setFormData(prev => ({ ...prev, billTitle: data.title, title: `${billType.toUpperCase()}${billNumber} - ${data.title}` }));
      } else {
        setError(data.error || 'Bill not found.');
        setFormData(prev => ({ ...prev, billTitle: '', title: '' }));
      }
    } catch (err) {
      setError('Failed to fetch bill title: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) return;
    if (formData.type === 'experiment' && (!formData.billNumber || !formData.billTitle)) return;
    if (['fact', 'insight'].includes(formData.type) && !formData.content.trim()) return;
    if (formData.type === 'recommendation' && !formData.fileReference.trim()) return;

    const atomData = {
      type: formData.type,
      title: formData.title,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      linkedTo: formData.linkedTo,
    };

    if (formData.type === 'experiment') {
      atomData.congress = formData.congress;
      atomData.billType = formData.billType;
      atomData.billNumber = formData.billNumber;
      atomData.billTitle = formData.billTitle;
      atomData.content = formData.content; // This might be auto-populated later
    } else if (['fact', 'insight'].includes(formData.type)) {
      atomData.content = formData.content;
    } else if (formData.type === 'recommendation') {
      atomData.fileReference = formData.fileReference;
      atomData.description = formData.description;
      atomData.content = `Implementation: ${formData.fileReference} - ${formData.description}`;
    }

    onCreate(atomData);
  };

  const toggleLink = atomId => {
    setFormData(prev => ({
      ...prev,
      linkedTo: prev.linkedTo.includes(atomId)
        ? prev.linkedTo.filter(id => id !== atomId)
        : [...prev.linkedTo, atomId],
    }));
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Create New Atom</DialogTitle>
      <DialogContent dividers>
        <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="atom-type-label">Atom Type</InputLabel>
            <Select
              labelId="atom-type-label"
              value={formData.type}
              label="Atom Type"
              onChange={handleTypeChange}
            >
              {Object.entries(atomTypes).map(([key, type]) => (
                <MenuItem key={key} value={key}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {formData.type === 'experiment' && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField name="congress" label="Congress" value={formData.congress} onChange={handleChange} sx={{ width: '100px' }} />
              <TextField name="billType" label="Bill Type" value={formData.billType} onChange={handleChange} sx={{ width: '100px' }} />
              <TextField name="billNumber" label="Bill Number" value={formData.billNumber} onChange={handleChange} sx={{ flexGrow: 1 }} />
              <Button onClick={handleFetchBillTitle} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Fetch Title'}
              </Button>
            </Box>
          )}

          <TextField
            name="title"
            label="Title"
            fullWidth
            value={formData.title}
            onChange={handleChange}
            InputProps={{
              readOnly: formData.type === 'experiment',
            }}
          />

          {error && <Alert severity="error">{error}</Alert>}

          {formData.type === 'recommendation' ? (
            <>
              <TextField
                name="fileReference"
                label="File Path or URL"
                fullWidth
                value={formData.fileReference}
                onChange={handleChange}
              />
              <TextField
                name="description"
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
              />
            </>
          ) : (
            <TextField
              name="content"
              label="Content"
              fullWidth
              multiline
              rows={4}
              value={formData.content}
              onChange={handleChange}
              placeholder={formData.type === 'experiment' ? 'Will be auto-populated with bill text later' : ''}
            />
          )}

          <TextField
            name="tags"
            label="Tags (comma-separated)"
            fullWidth
            value={formData.tags}
            onChange={handleChange}
          />

          <Box>
            <Typography variant="h6" gutterBottom>
              Link to existing atoms
            </Typography>
            <List dense sx={{ maxHeight: 200, overflow: 'auto', border: '1px solid #ccc', borderRadius: 1 }}>
              {existingAtoms.map(atom => (
                <ListItem
                  key={atom.id}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => toggleLink(atom.id)}>
                      {formData.linkedTo.includes(atom.id) ? <LinkOffIcon /> : <LinkIcon />}
                    </IconButton>
                  }
                >
                  <ListItemText primary={atom.title} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateAtomModal;
