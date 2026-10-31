from typing import List


def get_paper_relevance_prompt(
    problem_statement: str,
    my_solution: str,
    title: str,
    abstract: str
) -> str:
    return f"""You are a relevance filter for InnoGap.

Your job is to decide whether a research paper is genuinely
related to the user's problem and proposed solution.

USER PROBLEM:
{problem_statement}

USER PROPOSED SOLUTION:
{my_solution or "No proposed solution provided"}

RESEARCH PAPER TITLE:
{title}

RESEARCH PAPER ABSTRACT:
{abstract}

Return ONLY valid JSON.

Use exactly this structure:

{{
  "relevant": true,
  "score": 0,
  "reason": ""
}}

Rules:

1. "relevant" must be either true or false.
2. "score" must be an integer from 0 to 100. Set relevant to true when score is 50 or higher.
3. The paper should be considered relevant when it has
meaningful overlap with the user's actual problem,
objective, use case, or proposed solution.
4. Give more importance to:
- the real-world problem
- the target users or environment
- the objective
- the functionality
- the type of system being proposed
5. The proposed solution is important.
A paper should not be considered relevant just because
it uses similar technologies.
6. Technologies such as:
- AI
- machine learning
- IoT
- sensors
- computer vision
- deep learning
are NOT enough by themselves to make a paper relevant.
7. For example, if the user is solving room availability
using occupancy detection, a paper about plant detection
using computer vision is NOT relevant.
8. A paper about detecting room occupancy using sensors
is relevant even if it uses different technologies.
9. A paper about occupancy detection for energy management
may be related, but should only be considered relevant if
there is meaningful overlap with the user's actual problem
or proposed solution.
10. Do not judge patentability, ownership, or originality.
11. Do not invent information.
12. Keep the reason short and specific.
"""


def get_repository_relevance_prompt(
    problem_statement: str,
    my_solution: str,
    name: str,
    description: str,
    technologies: List[str],
    readme_excerpt: str
) -> str:
    tech_str = ", ".join(technologies) if technologies else "None"
    return f"""You are a relevance filter for InnoGap.

Your job is to decide whether an open-source GitHub repository is genuinely related to the student's problem and proposed solution.

STUDENT PROBLEM:
{problem_statement}

STUDENT PROPOSED SOLUTION:
{my_solution or "No proposed solution provided"}

GITHUB REPOSITORY NAME:
{name}

GITHUB REPOSITORY DESCRIPTION:
{description or "No description provided"}

DETECTED TECHNOLOGIES:
{tech_str}

README EXCERPT:
{readme_excerpt}

Return ONLY valid JSON.

Use exactly this structure:

{{
  "relevant": true,
  "score": 0,
  "reason": ""
}}

Rules:
1. "relevant" must be true or false. Set relevant to true when score is 50 or higher.
2. "score" must be an integer from 0 to 100 representing the degree of functional and problem relevance.
3. Judge functional and problem alignment, NOT superficial keyword overlap.
4. Give high relevance (score 70-100) if the repository addresses the same core problem, builds a similar type of system, or solves a closely related challenge.
5. Give moderate relevance (score 50-69) if the repository addresses a related domain or provides key functional mechanisms applicable to the student's idea.
6. Give low relevance (score 0-49, relevant: false) if:
   - The repository merely shares generic tech buzzwords (e.g. IoT, AI, Python, React, sensors) but solves a completely unrelated problem.
   - For example: if the student is solving street light failure detection, a general IoT home automation switch or a computer-vision plant disease detector is NOT relevant.
7. Do not judge patentability or legal originality.
8. Keep the reason concise (1-2 sentences).
"""
