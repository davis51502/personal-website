import { render, screen, fireEvent } from '@testing-library/react';
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

test('hobbies page shows tiles and the penalty game', () => {
  window.location.hash = '#/hobbies';
  render(<App />);
  expect(screen.getByRole('tab', { name: /guitar/i })).toHaveAttribute('aria-selected', 'true');
  fireEvent.click(screen.getByRole('tab', { name: /soccer/i }));
  expect(screen.getByRole('button', { name: /shoot left/i })).toBeInTheDocument();
});
