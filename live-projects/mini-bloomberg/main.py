import sqlite3
import os
from openai import OpenAI

# 1. SETUP & CONFIGURATION
# Replace with your actual key - remember not to share this on Discord!
os.environ["OPENAI_API_KEY"] = "your-api-key-here"
client = OpenAI()

DB_NAME = "bloomberg_mini.db"

SCHEMA_PROMPT = """
Table: Companies
- ticker (TEXT, Primary Key): The stock symbol (e.g., 'AAPL')
- name (TEXT): Full company name
- sector (TEXT): Industry sector

Table: Financials
- id (INTEGER, Primary Key)
- ticker (TEXT, Foreign Key -> Companies.ticker)
- revenue (REAL): Total annual revenue
- net_income (REAL): Total annual profit
- fcf (REAL): Free Cash Flow
- period_end_date (TEXT): Date of the filing

Table: Valuations
- ticker (TEXT, Primary Key, Foreign Key -> Companies.ticker)
- implied_value (REAL): Calculated DCF share price
- wacc (REAL): Weighted Average Cost of Capital (as a decimal, e.g., 0.08)
- upside_percent (REAL): Percentage difference to current price
"""

# 2. DATABASE INITIALIZATION
def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute("CREATE TABLE IF NOT EXISTS Companies (ticker TEXT PRIMARY KEY, name TEXT, sector TEXT)")
    cursor.execute("CREATE TABLE IF NOT EXISTS Financials (id INTEGER PRIMARY KEY, ticker TEXT, revenue REAL, net_income REAL, fcf REAL, period_end_date TEXT, FOREIGN KEY(ticker) REFERENCES Companies(ticker))")
    cursor.execute("CREATE TABLE IF NOT EXISTS Valuations (ticker TEXT PRIMARY KEY, implied_value REAL, wacc REAL, upside_percent REAL, FOREIGN KEY(ticker) REFERENCES Companies(ticker))")
    
    # Seed data
    companies = [('AAPL', 'Apple Inc.', 'Technology'), ('TSLA', 'Tesla Inc.', 'Automotive'), ('NVDA', 'NVIDIA Corp.', 'Technology')]
    financials = [
        (1, 'AAPL', 394000, 99000, 111000, '2025-09-30'),
        (2, 'TSLA', 96000, 15000, 7500, '2025-12-31'),
        (3, 'NVDA', 60000, 29000, 26000, '2025-10-30')
    ]
    vals = [('AAPL', 215.0, 0.08, 12.0), ('TSLA', 180.0, 0.10, -5.0), ('NVDA', 900.0, 0.09, 15.5)]
    
    cursor.executemany("INSERT OR REPLACE INTO Companies VALUES (?,?,?)", companies)
    cursor.executemany("INSERT OR REPLACE INTO Financials VALUES (?,?,?,?,?,?)", financials)
    cursor.executemany("INSERT OR REPLACE INTO Valuations VALUES (?,?,?,?)", vals)
    
    conn.commit()
    conn.close()

# 3. AI LOGIC
def ask_ai_for_sql(question):
    # This is a "Zero-Shot" prompt strategy
    sys_msg = f"You are a SQL expert. Use this schema: {SCHEMA_PROMPT}. Return ONLY the SQL query for SQLite."
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": sys_msg},
            {"role": "user", "content": question}
        ]
    )
    return response.choices[0].message.content.replace("```sql", "").replace("```", "").strip()

def ask_ai_for_friendly_answer(question, sql_query, results):
    prompt = f"User asked: {question}\nSQL used: {sql_query}\nResults: {results}\nGive a friendly, concise answer."
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

# 4. EXECUTION
def main():
    init_db()
    print("--- Mini-Bloomberg AI Terminal ---")
    user_q = input("Question (e.g. 'Which tech company has the most upside?'): ")
    
    try:
        sql = ask_ai_for_sql(user_q)
        print(f"\n[Generated SQL]: {sql}")
        
        conn = sqlite3.connect(DB_NAME)
        res = conn.execute(sql).fetchall()
        conn.close()
        
        friendly = ask_ai_for_friendly_answer(user_q, sql, res)
        print(f"\n[AI Answer]: {friendly}")
    except Exception as e:
        print(f"\n[Error]: {e}")

if __name__ == "__main__":
    main()
