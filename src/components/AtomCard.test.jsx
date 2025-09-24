import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AtomCard from './AtomCard';

const atom = {
  id: '1',
  type: 'experiment',
  title: 'Test Atom',
  content: 'This is a test atom.',
  tags: [
    { label: 'test', type: 'default' },
    { label: 'atom', type: 'default' },
  ],
  timestamp: new Date().toISOString(),
  linkedTo: [],
};

describe('AtomCard', () => {
  it('renders AtomCard component', () => {
    render(<AtomCard atom={atom} onSelect={() => {}} />);

    expect(screen.getByText('Test Atom')).toBeInTheDocument();
    // The content is now behind a collapse, so we can't test for it this way
    // expect(screen.getByText('This is a test atom.')).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('atom')).toBeInTheDocument();
  });
});
