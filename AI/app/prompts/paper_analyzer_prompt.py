import json
from typing import Any, Dict


def get_paper_analyzer_prompt(paper_info: Dict[str, Any]) -> str:
    paper_context = json.dumps(paper_info, indent=2)
    return f"""You are analyzing a research paper for InnoGap.

Your job is to understand the technical problem, the research approach,
its method or solution, and the capabilities it provides.

Do NOT determine legal novelty, patentability, or ownership.
Only analyze technical and functional similarity.

Paper information:
{paper_context}

Return ONLY valid JSON.

Use exactly this structure:

{{
  "problem": "",
  "solution": "",
  "technologies": [],
  "capabilities": [],
  "whatItDoes": []
}}

Rules:
1. Identify the problem addressed by the research.
2. Explain the proposed solution, method, model, system, or technical approach.
3. Extract technologies/algorithms/models only when supported by the available paper information.
4. Extract important capabilities.
5. Generate 3 to 6 concrete "whatItDoes" actions.
6. Do not invent information.
7. Do not claim the research is original.
8. Do not determine patentability or legal novelty.
9. Keep the response concise.
10. Return ONLY JSON.
11. No markdown.
12. No code fences.
13. No text before or after the JSON.
"""
