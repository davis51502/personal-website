import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Race from './Race';

const history = [['2026-09-28', 100000], ['2026-09-29', 100500]];
const trader = (model, persona, fees, ret) => ({
  id: `${model}:${persona}`, model, persona, cash: 0, cash_weight: 0,
  holdings: [{ ticker: 'NVDA', name: 'NVIDIA', value: 100000, weight: 1, gain_pct: 1 }],
  trades: 10, fees, value: 100000 * (1 + ret / 100), return_pct: ret,
  day_change_pct: 0.1, max_drawdown_pct: -0.5, history,
});
const model = (id, label, ret) => ({
  id, label, name: `${label} Model`, model_id: id, api_cost: 0.5, failed_decisions: 0,
  value: 100000, return_pct: ret, day_change_pct: 0, max_drawdown_pct: 0, history,
});

// Includes a newly added persona that only one model trades yet, which must not crash the page.
const fixture = {
  status: 'live', start_date: '2026-09-28', as_of: '2026-09-29', starting_cash: 100000, next_decision: '2026-10-02',
  models: [model('claude', 'Claude', 1), model('chatgpt', 'ChatGPT', 2), model('gemini', 'Gemini', 0.5)],
  personas: [
    { id: 'value', label: 'Value Investor', emoji: '🧓', blurb: 'Patient.', max_weight: 0.25 },
    { id: 'growth', label: 'Growth Chaser', emoji: '🚀', blurb: 'Fast.', max_weight: 0.25 },
    { id: 'derivatives', label: 'Options Trader', emoji: '🎯', blurb: 'Options only.', max_weight: 0.25 },
  ],
  benchmark: { ticker: 'SPY', label: 'S&P 500', value: 100800, return_pct: 0.8, day_change_pct: 0, max_drawdown_pct: 0, history },
  traders: [
    trader('claude', 'value', 100, 1), trader('claude', 'growth', 150, 1),
    trader('chatgpt', 'value', 300, 2), trader('chatgpt', 'growth', 200, 2),
    trader('gemini', 'value', 400, 0.5), trader('gemini', 'growth', 500, 0.5), trader('gemini', 'derivatives', 250, 3),
  ],
  feed: [],
};

beforeEach(() => {
  global.ResizeObserver = class { observe() {} disconnect() {} };
  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(fixture) }));
});

test('shows trading fees per model, marking the lowest', async () => {
  render(<MemoryRouter><Race /></MemoryRouter>);
  const row = (await screen.findByRole('rowheader', { name: 'Fees paid' })).closest('tr');
  const cells = within(row).getAllByRole('cell');
  // Claude $250, ChatGPT $500, Gemini $1,150 (columns follow the data's model order).
  expect(cells.map((c) => c.textContent)).toEqual(['$250 🏆', '$500', '$1,150']);
});

test('per-model view lists fees and tolerates personas some models lack', async () => {
  render(<MemoryRouter><Race /></MemoryRouter>);
  fireEvent.click(await screen.findByRole('tab', { name: /claude/i }));
  expect(screen.getByRole('heading', { name: /Claude Model’s 2 traders/ })).toBeInTheDocument();
  expect(screen.getAllByText(/−0\.10 pts/).length).toBeGreaterThan(0); // $100 on $100k

  fireEvent.click(screen.getByRole('tab', { name: /gemini/i }));
  expect(screen.getByRole('heading', { name: /Gemini Model’s 3 traders/ })).toBeInTheDocument();
});

const optionsTrader = (model, ret) => ({
  ...trader(model, 'options', 120, ret),
  api_cost: 0.1, failed_decisions: 0, cash: 40000, cash_weight: 0.4,
  holdings: [{
    ticker: 'NVDA261218C00220000', label: 'NVDA $220 call · Dec 18', underlying: 'NVDA', kind: 'call',
    strike: 220, expiry: '2026-12-18', days_left: 80, contracts: 10, value: 60000, weight: 0.6, gain_pct: 12.5,
  }],
});

const withDesk = {
  ...fixture,
  options_desk: {
    status: 'live', start_date: '2026-09-28',
    persona: { id: 'options', label: 'Options Trader', emoji: '🎯', blurb: 'Calls and puts only.', max_weight: 0.25 },
    benchmark: fixture.benchmark,
    traders: [optionsTrader('claude', 4), optionsTrader('chatgpt', -2), optionsTrader('gemini', 1)],
    expirations: [{ date: '2026-09-29', trader: 'gemini:options', model: 'gemini', label: 'SPY $700 put · Sep 29', value: 0, worthless: true }],
  },
  feed: [
    { id: 1, trader: 'claude:options', model: 'claude', persona: 'options', decided: '2026-09-25', executed: '2026-09-28',
      status: 'executed', summary: 'Buying NVDA calls.', reasoning: 'Because.', fees: 600,
      changes: [{ ticker: 'NVDA261218C00220000', label: 'NVDA $220 call · Dec 18', from: 0, to: 0.6 }] },
    { id: 2, trader: 'claude:value', model: 'claude', persona: 'value', decided: '2026-09-25', executed: '2026-09-28',
      status: 'executed', summary: 'Buying moats.', reasoning: 'Because.', fees: 100, changes: [] },
  ],
};

test('options desk tab shows each AI\'s contracts and keeps its trades out of the stock feed', async () => {
  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(withDesk) }));
  render(<MemoryRouter><Race /></MemoryRouter>);

  // The main race feed only has the stock trader.
  expect(await screen.findByText('“Buying moats.”')).toBeInTheDocument();
  expect(screen.queryByText('“Buying NVDA calls.”')).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('tab', { name: /options desk/i }));
  const book = screen.getByRole('list', { name: 'Claude option positions' });
  expect(within(book).getByText(/NVDA \$220/)).toBeInTheDocument();
  expect(screen.getByText(/SPY \$700 put · Sep 29 worthless/)).toBeInTheDocument();
  expect(screen.getAllByText('“Buying NVDA calls.”').length).toBeGreaterThan(0);
  expect(screen.queryByText('“Buying moats.”')).not.toBeInTheDocument();
  expect(screen.getByText('NVDA $220 call · Dec 18 0→60%')).toBeInTheDocument();
});

test('race data without an options desk shows no options tab', async () => {
  render(<MemoryRouter><Race /></MemoryRouter>);
  await screen.findByRole('tab', { name: /claude/i });
  expect(screen.queryByRole('tab', { name: /options desk/i })).not.toBeInTheDocument();
});
