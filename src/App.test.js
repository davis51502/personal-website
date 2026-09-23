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

test('filters projects by technology tag', () => {
  window.location.hash = '#/projects';
  render(<App />);
  const total = screen.getAllByRole('article').length;
  fireEvent.click(screen.getByRole('button', { name: 'Java' }));
  const filtered = screen.getAllByRole('article');
  expect(filtered.length).toBeLessThan(total);
  expect(screen.getByText('Multiplayer Chess')).toBeInTheDocument();
});
