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
};

export const BENCHMARK_COLOR = '#6e6e73';

export const raceRules = [
  'Every trader starts with $100,000 of simulated money.',
  'Each model runs the same five personalities with identical prompts, market data, and headlines.',
  'Once a week, after Friday’s close, every trader picks a new portfolio. Trades fill at Monday’s open.',
  'Only 60 well-known US stocks are allowed. No shorting, no leverage, at most 25% in one stock (50% for YOLO).',
  'Every trade costs 0.1%, so churning the portfolio has a price.',
  'The S&P 500 line is $100,000 put into SPY on day one and never touched.',
];
