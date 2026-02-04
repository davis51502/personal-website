# Natural Language to SQL: Financial Terminal Examples

### 1. Selection
**Question:** "What is the name and sector of Apple?"
**SQL:** `SELECT name, sector FROM Companies WHERE ticker = 'AAPL';`
**Status:** Worked.

### 2. Aggregation
**Question:** "What is the average revenue across all companies?"
**SQL:** `SELECT AVG(revenue) FROM Financials;`
**Status:** Worked.

### 3. Join Logic
**Question:** "Show me the revenue for Tesla."
**SQL:** `SELECT revenue FROM Financials JOIN Companies ON Financials.ticker = Companies.ticker WHERE name = 'Tesla Inc.';`
**Status:** Worked.

### 4. Sorting & Filtering
**Question:** "Top 3 companies by net income."
**SQL:** `SELECT ticker, net_income FROM Financials ORDER BY net_income DESC LIMIT 3;`
**Status:** Worked.

### 5. Complex Financial Logic
**Question:** "Which company has a WACC lower than 9% and positive upside?"
**SQL:** `SELECT ticker FROM Valuations WHERE wacc < 0.09 AND upside_percent > 0;`
**Status:** Worked.

### 6. Failed Example (The "Hallucination" Case)
**Question:** "Show me the CEO of NVIDIA."
**SQL:** `SELECT CEO FROM Companies WHERE ticker = 'NVDA';`
**Result:** **Failed.** The database schema does not include a 'CEO' column.
