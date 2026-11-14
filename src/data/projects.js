const projects = [
  {
    title: 'AI Portfolio Race',
    description:
      'A live experiment where Claude, ChatGPT, and Gemini manage 15 simulated $100K portfolios across 60 large-cap US stocks. An automated pipeline feeds each model identical prices and headlines, rebalances weekly with trading costs, benchmarks every portfolio against the S&P 500 daily, and values an options book with Black-Scholes and live implied volatility.',
    path: '/race',
    repo: 'https://github.com/davis51502/ai-race-data',
    tags: ['Python', 'LLMs', 'Options', 'Finance'],
    details: { notes: 'Running since Sep 2026 · as of Nov 6, value-style traders lead at up to +8.3% vs. the S&P 500’s –4.3%' },
  },
  {
    title: 'K1Flow',
    description:
      'A tax document tool built for Hall Law Group. It extracts Schedule K-1 and 1099 data from PDFs with an LLM, redacting SSNs and EINs before any text reaches the model, then runs rule-based checks (capital-account roll-forward, cross-foots) and gives CPAs a side-by-side review screen, role-based access with an audit log, and Excel export for CCH Axcess import.',
    tags: ['Python', 'PostgreSQL', 'LLMs', 'Client work'],
    details: { notes: 'Sep 2026 · in use at the firm, where CPAs now verify AI-extracted fields instead of attorneys reviewing by hand · private client code' },
  },
  {
    title: 'Mini Bloomberg',
    description:
      'A portfolio and investment research tool built to explore company fundamentals, valuations, and financial context in a more structured, decision-useful workflow.',
    url: 'https://investment-terminal-dusky.vercel.app/',
    repo: 'https://github.com/davis51502/investmentTerminal',
    tags: ['React', 'Python', 'Supabase', 'APIs', 'Finance'],
  },
  {
    title: "Predictions for Parkinson's",
    description:
      "A Python model of Parkinson's disease progression built from clinical visit, patient background, and medical event data. Random Forest and Logistic Regression models evaluate patient trajectories and identify the key risk variables that give early warning.",
    tags: ['Python', 'Machine Learning'],
    details: { notes: 'Research project, May–Aug 2024 · code available on request' },
  },
  {
    title: 'Proyak',
    description: 'Professional job board that uses verified credentials to connect employers with qualified candidates and create strong matches.',
    url: 'https://proyak.click',
    repo: 'https://github.com/davis51502/proyak',
    tags: ['React', 'TypeScript', 'Python', 'Supabase'],
  },
  {
    title: 'Multiplayer Chess',
    description:
      'Full-stack chess application with a client/server architecture: HTTP and WebSocket networking, database persistence, unit testing, and a command-line client.',
    repo: 'https://github.com/davis51502/chess',
    tags: ['Java', 'SQL', 'WebSockets'],
  },
  {
    title: 'Realty Website',
    description: 'A realtor website designed to showcase property listings and facilitate client interactions.',
    url: 'https://suemckinleyrealtor.com',
    repo: 'https://github.com/davis51502/suemckinleyrealtor',
    tags: ['React', 'Client work'],
  },
  {
    title: 'Scrapbooking Website',
    description: 'Scrapbooking website to share and preserve memories with friends and family.',
    url: 'https://scrapbookimpressions.org',
    repo: 'https://github.com/davis51502/scrapbooking-yeah',
    tags: ['React', 'Client work'],
  },
  {
    title: 'BYU CS Classes Guide',
    description: 'A guide for navigating BYU computer science courses, with class breakdowns and planning help for students choosing their path through the program.',
    url: 'https://davis51502.github.io/byu-cs-guide/#home',
    repo: 'https://github.com/davis51502/byu-cs-guide',
    tags: ['React'],
  },
];

export const socials = [
  { name: 'GitHub', url: 'https://github.com/davis51502' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/davis-wollesen/' },
  { name: 'Medium', url: 'https://medium.com/@daviswollesen' },
];

export default projects;
