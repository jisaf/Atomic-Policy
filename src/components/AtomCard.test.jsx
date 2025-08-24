import React from 'react';
import { render, screen } from '@testing-library/react';
import { Beaker } from 'lucide-react';
import { describe, it, expect } from 'vitest';
import AtomCard from './AtomCard';

const atomTypes = {
  experiment: {
    label: 'Source text',
    icon: Beaker,
    color: 'bg-blue-100 border-blue-300',
    description: 'Select a specific bill section'
  }
};

const atom = {
  id: '1',
  type: 'experiment',
  title: 'Test Atom',
  content: 'This is a test atom.',
  tags: ['test', 'atom'],
  timestamp: new Date().toISOString(),
  linkedTo: []
};

describe('AtomCard', () => {
  it('renders AtomCard component', () => {
    render(<AtomCard atom={atom} atomTypes={atomTypes} onSelect={() => {}} atoms={[]} />);

    expect(screen.getByText('Test Atom')).toBeInTheDocument();
    expect(screen.getByText('This is a test atom.')).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('atom')).toBeInTheDocument();
  });
});
