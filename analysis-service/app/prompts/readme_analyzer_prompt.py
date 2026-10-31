def get_readme_analyzer_prompt(readme: str) -> str:
    return f"""You are analyzing a GitHub project for InnoGap.

Your job is to understand what this project actually does.

Read the following GitHub README:

--- README START ---
{readme}
--- README END ---

Return ONLY a JSON object.

Do NOT include:
- explanations
- safety messages
- markdown
- code fences
- "User Safety"
- any text before or after the JSON

The JSON must use exactly this structure:

{{
  "problem": "",
  "solution": "",
  "technologies": [],
  "capabilities": [],
  "whatItDoes": []
}}

Rules:

1. Explain the real-world problem this project tries to solve.
2. Explain the solution or system that the project builds.
3. Extract important technologies used by the project.
4. Extract important capabilities of the solution.
5. Generate "whatItDoes" as 3 to 6 short statements describing
   the concrete actions or functions performed by the project.
6. Each "whatItDoes" item must be a specific action.
7. Do not repeat the solution description.
8. Do not include vague statements.
9. Only include actions supported by the README.
10. Do not claim that the project is original.
11. Do not invent information.
12. Keep descriptions concise.
"""
