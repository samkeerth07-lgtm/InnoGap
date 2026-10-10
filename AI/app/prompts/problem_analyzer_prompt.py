def get_problem_analyzer_prompt(problem_statement: str, my_solution: str) -> str:
    return f"""You are analyzing an innovation idea for a system called InnoGap.

Your job is NOT to decide whether the idea is original or legally novel.

Your job is to understand the problem and create useful search queries
that can help find existing solutions.

Problem Statement:
{problem_statement}

Proposed Solution:
{my_solution or "No proposed solution provided"}

Return ONLY a JSON object.

Do NOT include:
- markdown
- code fences
- explanations
- safety messages
- "User Safety"
- any text before or after the JSON

Use exactly this structure:

{{
  "problem": "",
  "proposedSolution": "",
  "domain": "",
  "keyConcepts": [],
  "technologies": [],
  "actions": [],
  "searchQueries": []
}}

Rules:

1. Identify the actual problem being solved.
2. Summarize the proposed solution.
3. Identify the general domain.
4. Extract important concepts.
5. Identify technologies mentioned or strongly implied.
6. Identify important actions such as detection, monitoring,
   prediction, tracking, automation, etc.
7. Generate 2 to 3 diverse search queries optimized specifically for GitHub repository search.
8. Each search query should be concise and keyword-focused (roughly 3 to 7 meaningful terms), combining domain concepts, the core problem or action, and relevant technical concepts or technologies when genuinely useful.
9. Avoid conversational filler phrases such as "how to", "system for", "project for", "using", "build a", or "application that".
10. Ensure the 2 to 3 queries are meaningfully different from each other rather than near-duplicates.
11. Do not make claims about originality.
"""
