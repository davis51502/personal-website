import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  window.location.hash = '';
});

test('renders name and experience on the home page', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: /davis wollesen/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /experience/i })).toBeInTheDocument();
  expect(screen.getByText(/culmination bio/i)).toBeInTheDocument();
});

test('lists projects on the projects page', () => {
  window.location.hash = '#/projects';
  render(<App />);
  expect(screen.getByText('Multiplayer Chess')).toBeInTheDocument();
  expect(screen.getByText('Mini Bloomberg')).toBeInTheDocument();
});
