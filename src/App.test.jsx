import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the main application', () => {
    render(<App />);
    expect(screen.getByText('Atomic UX Research')).toBeInTheDocument();
  });

  it('shows the create modal when "Add Atom" is clicked', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Add Atom'));
    expect(screen.getByText('Create New Atom')).toBeInTheDocument();
  });
});
