// Recorded runs from the Mini Bloomberg AI Terminal (github.com/davis51502/ai-db-452).
// Questions and SQL come from the repo's examples.md; results are those queries run against its sample database.
export const sqlDemo = [
  {
    question: 'What is the name and sector of Apple?',
    skill: 'Selection',
    sql: "SELECT name, sector FROM Companies WHERE ticker = 'AAPL';",
    columns: ['name', 'sector'],
    rows: [['Apple Inc.', 'Technology']],
  },
  {
    question: 'What is the average revenue across all companies?',
    skill: 'Aggregation',
    sql: 'SELECT AVG(revenue) AS average_revenue FROM Financials;',
    columns: ['average_revenue'],
    rows: [['183,333.33']],
  },
  {
    question: 'Show me the revenue for Tesla.',
    skill: 'Joins',
    sql: "SELECT revenue FROM Financials JOIN Companies ON Financials.ticker = Companies.ticker WHERE name = 'Tesla Inc.';",
    columns: ['revenue'],
    rows: [['96,000']],
  },
  {
    question: 'Top 3 companies by net income.',
    skill: 'Sorting',
    sql: 'SELECT c.ticker, c.name, f.net_income FROM Companies c JOIN Financials f ON c.ticker = f.ticker ORDER BY f.net_income DESC LIMIT 3;',
    columns: ['ticker', 'name', 'net_income'],
    rows: [
      ['AAPL', 'Apple Inc.', '99,000'],
      ['NVDA', 'NVIDIA Corp.', '29,000'],
      ['TSLA', 'Tesla Inc.', '15,000'],
    ],
  },
  {
    question: 'Which company has a WACC lower than 9% and positive upside?',
    skill: 'Financial logic',
    sql: 'SELECT name FROM Companies JOIN Valuations ON Companies.ticker = Valuations.ticker WHERE Valuations.wacc < 0.09 AND Valuations.upside_percent > 0;',
    columns: ['name'],
    rows: [['Apple Inc.']],
  },
  {
    question: 'who is the CEO of telsa.',
    skill: 'Out of scope',
    sql: "I'm sorry, I can only provide SQL query responses related to the given database schema.",
    blocked: 'Not a safe SELECT statement, so the query was never run.',
  },
];

export const approach = [
  {
    title: 'Start with the work',
    text: 'I look for the task someone does over and over, like digging through data, matching records or drafting the same report. Sometimes the answer is a plain script and no AI at all.',
  },
  {
    title: 'Give it the real data',
    text: "A model that hasn't seen the schema or the documents will guess. I hand it both, so its answers come from the business's own data.",
  },
  {
    title: 'Check everything it writes',
    text: 'Nothing a model produces runs unchecked. Queries are read-only, inputs are typed, and a person reviews anything that matters.',
  },
  {
    title: 'See if it helped',
    text: "I test against real examples and keep a list of what fails. If the tool doesn't save anyone time, it isn't finished.",
  },
];

export const caseStudies = [
  {
    title: 'Mini Bloomberg AI Terminal',
    kind: 'LLM · Text-to-SQL',
    problem: 'Analysts ask questions in English, but the financial data sits in a database that only answers SQL.',
    approach:
      'I built an assistant on GPT-4o that turns a plain-English question into SQL over company financials and valuations, runs it, and sums up the result. Accuracy was poor until I gave the model the schema with explicit data types, such as WACC stored as a decimal.',
    value: "People who don't write SQL can look things up themselves. The tool only runs SELECT statements, so the model can't change any data.",
    stack: ['OpenAI API', 'Python', 'SQLite', 'Prompt engineering'],
    repo: 'https://github.com/davis51502/ai-db-452',
  },
  {
    title: 'Proyak: Semantic Matching',
    kind: 'Embeddings · Vector search',
    problem: 'Keyword search misses good candidates who describe the same experience in different words.',
    approach:
      'I turned each specialty and interest into a sentence embedding (all-MiniLM-L6-v2), stored the vectors in Supabase, and ranked matches by cosine similarity in serverless edge functions.',
    value: 'Candidates and employers get matched on what they mean, even when their wording differs.',
    stack: ['Sentence Transformers', 'Supabase', 'Edge Functions', 'TypeScript'],
    repo: 'https://github.com/davis51502/proyak',
    url: 'https://proyak.click',
  },
  {
    title: "Parkinson's Progression Models",
    kind: 'Classical ML',
    problem: "Clinicians want early warning of how a patient's disease will progress, and the data is messy and split across several sources.",
    approach:
      'I merged clinical visits, patient background and medical events into one dataset, then compared Random Forest, Logistic Regression and Decision Tree models over 1- and 2-year windows.',
    value: 'The models point to the variables that best predict progression. I picked interpretable models over an LLM on purpose, since the point was to see which variables drive the prediction.',
    stack: ['Python', 'scikit-learn', 'Pandas'],
  },
  {
    title: 'AI-Assisted Engineering',
    kind: 'Developer productivity',
    problem: 'A small team has to ship and maintain production software quickly without quality slipping.',
    approach:
      'I use AI coding agents every day for scaffolding, refactoring and reviews. I check what they write with tests, CI builds and my own read-through. This site is maintained that way.',
    value: 'I ship faster and hold the code to the same standard. The design decisions and the final review are still mine.',
    stack: ['Claude Code', 'GitHub Actions', 'Testing'],
  },
];

export const aiArticle = {
  title: "Why AI's lazy efficiency is the next great technical debt",
  url: 'https://medium.com/@daviswollesen/why-ais-lazy-efficiency-is-the-next-great-technical-debt-7a70288b8100',
};
