import { render, screen, fireEvent, within } from '@testing-library/react';
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

test('AI page replays text-to-SQL runs, including a blocked one', async () => {
  window.location.hash = '#/ai';
  render(<App />);
  expect(screen.getByRole('heading', { name: /ai in practice/i })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /ceo of telsa/i }));
  expect(await screen.findByText(/blocked/i)).toBeInTheDocument();
});

test('each nav click adds exactly one history entry', () => {
  render(<App />);
  const primary = screen.getByRole('navigation', { name: 'Primary' });
  const before = window.history.length;
  fireEvent.click(within(primary).getByRole('link', { name: 'Projects' }));
  expect(window.history.length).toBe(before + 1);
  expect(within(primary).getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'page');
});

test('phone menu opens and closes after choosing a page', () => {
  render(<App />);
  const toggle = screen.getByRole('button', { name: /open menu/i });
  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  const menu = screen.getByRole('navigation', { name: 'Mobile' });
  fireEvent.click(within(menu).getByRole('link', { name: 'Writing' }));
  expect(screen.getByRole('button', { name: /open menu/i })).toHaveAttribute('aria-expanded', 'false');
});
