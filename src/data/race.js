// The AI Portfolio Race runs on my server and publishes its results here after every market close.
export const RACE_DATA_URL =
  process.env.REACT_APP_RACE_DATA_URL ||
  'https://raw.githubusercontent.com/davis51502/ai-race-data/main/race.json';

// Chart colors. Validated for colorblind separation on a white surface;
// models lean on brand hues so they read at a glance.
export const MODEL_COLORS = {
  claude: '#e34948',
  chatgpt: '#008300',
  gemini: '#4a3aa7',
};

export const PERSONA_COLORS = {
  value: '#2a78d6',
  growth: '#eb6834',
  news: '#1baf7a',
  contrarian: '#eda100',
  yolo: '#e87ba4',
  // Reserved for the planned options/derivatives trader; shows up once the engine publishes it.
  derivatives: '#00838f',
};

export const BENCHMARK_COLOR = '#6e6e73';

export const raceRules = [
  'Every trader starts with $100,000 of simulated money.',
  'Each model runs the same five personalities with identical prompts, market data, and headlines.',
  'Once a week, after Friday’s close, every trader picks a new portfolio. Trades fill at Monday’s open.',
  'Only 60 well-known US stocks are allowed. No shorting, no leverage, at most 25% in one stock (50% for YOLO).',
  'Every stock trade costs 0.1% and every options trade 1% (roughly the bid-ask spread), so churning the portfolio has a price. Fees are shown for every trader.',
  'The S&P 500 line is $100,000 put into SPY on day one and never touched.',
];

export const optionsRules = [
  'Each model also runs one options-only trader with its own $100,000. It can buy calls and puts on 20 big stocks and ETFs, but never sell options or hold stock, so the most it can lose is what it paid.',
  'Contracts are valued daily with the Black-Scholes model, using the stock’s real price and each contract’s implied volatility from the live options market.',
  'Contracts held to expiry settle for their intrinsic value in cash. Out of the money means worthless.',
  'The Options Desk started later than the main race, so its S&P 500 line starts on its own first day.',
];
