from typing import List


def get_similarity_analyzer_prompt(
    problem_statement: str,
    my_solution: str,
    existing_problem: str,
    existing_solution: str,
    existing_technologies: List[str]
) -> str:
    tech_str = ", ".join(existing_technologies) if existing_technologies else "None"
    return f"""You are analyzing an innovation idea for InnoGap.

Your task is to compare the user's idea with an existing project.

Do NOT decide legal ownership or patent novelty.

Focus only on whether the existing project appears to solve
the same or a related problem.

USER PROBLEM:
{problem_statement}

USER PROPOSED SOLUTION:
{my_solution or "No proposed solution provided"}

EXISTING PROJECT PROBLEM:
{existing_problem}

EXISTING PROJECT SOLUTION:
{existing_solution}

EXISTING PROJECT TECHNOLOGIES:
{tech_str}

Return ONLY valid JSON.

Use exactly this structure:

{{
  "similarity": "",
  "reason": "",
  "overlap": [],
  "differences": []
}}

Rules:

1. similarity must be one of:
   "High"
   "Medium"
   "Low"

2. "reason" should briefly explain why the similarity
   level was assigned.

3. "overlap" should contain important concepts or
   capabilities shared by both solutions.

4. "differences" should contain important differences
   between the user's proposed solution and the existing project.

5. Do not claim that either idea is original.

6. Do not invent information.

7. Keep the response concise.
"""
