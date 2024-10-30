import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import App from '../App';

it('renders the app', () => {
  render(<App />);
  const header = screen.queryByText(/Todo/i);
  expect(header).toBeDefined();
});
