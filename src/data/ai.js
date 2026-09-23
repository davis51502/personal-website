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
    title: 'Start with the workflow',
    text: 'Find the repetitive, high-volume task first, such as searching data, matching records, or drafting reports. Then decide whether AI is the right tool at all.',
  },
  {
    title: 'Ground it in real data',
    text: 'Give models the schema, the documents, and the context they need, so answers come from the business data instead of guesses.',
  },
  {
    title: 'Build in guardrails',
    text: 'Validate every model output before it touches anything real: read-only queries, typed inputs, and human review where the stakes are high.',
  },
  {
    title: 'Measure the result',
    text: 'Test against real examples, track what fails, and iterate on prompts and models until the tool actually saves time.',
  },
];

export const caseStudies = [
  {
    title: 'Mini Bloomberg AI Terminal',
    kind: 'LLM · Text-to-SQL',
    problem: 'Financial data locked behind SQL is out of reach for analysts who think in questions, not queries.',
    approach:
      "Built a GPT-4o assistant that turns plain-English questions into SQL over company financials and valuations, then summarizes the results. Improved accuracy by moving from zero-shot prompting to a schema with explicit data types (e.g. 'WACC as a decimal').",
    value: 'Self-serve data access for non-technical users, with a SELECT-only guardrail so the model can never modify data.',
    stack: ['OpenAI API', 'Python', 'SQLite', 'Prompt engineering'],
    repo: 'https://github.com/davis51502/ai-db-452',
  },
  {
    title: 'Proyak: Semantic Matching',
    kind: 'Embeddings · Vector search',
    problem: "Keyword matching misses candidates whose experience is relevant but described in different words.",
    approach:
      'Generated sentence embeddings (all-MiniLM-L6-v2) for specialties and interests, stored the vectors in Supabase, and ranked matches by cosine similarity through serverless edge functions.',
    value: 'Matches candidates to employers by meaning rather than exact wording, which improves match quality in a hiring marketplace.',
    stack: ['Sentence Transformers', 'Supabase', 'Edge Functions', 'TypeScript'],
    repo: 'https://github.com/davis51502/proyak',
    url: 'https://proyak.click',
  },
  {
    title: "Parkinson's Progression Models",
    kind: 'Classical ML',
    problem: 'Clinicians need early warning of how the disease is likely to progress, using messy data spread across several sources.',
    approach:
      'Merged clinical visits, patient background, and medical events into one dataset, then compared Random Forest, Logistic Regression, and Decision Tree models over 1- and 2-year windows.',
    value: "Surfaces the key risk variables behind progression. Choosing interpretable models over an LLM was deliberate: the right tool, not the trendiest one.",
    stack: ['Python', 'scikit-learn', 'Pandas'],
  },
  {
    title: 'AI-Assisted Engineering',
    kind: 'Developer productivity',
    problem: 'Small teams need to ship and maintain production software quickly without letting quality slip.',
    approach:
      'I use AI coding agents day to day for scaffolding, refactoring, and reviews, and I verify their output with tests, CI builds, and manual checks. This site is maintained that way.',
    value: 'Faster delivery with the same bar for correctness. AI does the typing, while I own the design and the review.',
    stack: ['Claude Code', 'GitHub Actions', 'Testing'],
  },
];

export const aiArticle = {
  title: "Why AI's lazy efficiency is the next great technical debt",
  url: 'https://medium.com/@daviswollesen/why-ais-lazy-efficiency-is-the-next-great-technical-debt-7a70288b8100',
};
