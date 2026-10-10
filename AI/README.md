# InnoGap Agentic-AI Python Backend

Welcome to the **InnoGap** Python Backend. This is a complete re-architecture of the former Node.js/Express backend into a high-performance, asynchronous Python agentic-AI system powered by **FastAPI**, **LangGraph**, and **Pydantic v2**.

---

## 1. Overview & Goal

InnoGap evaluates novel product, research, and software ideas submitted by innovators and students. By providing a **ProblemStatement** and optional **MySolution**, InnoGap:
1. Deconstructs the problem and derives search-optimized keywords.
2. Discovers real-world implementations on **GitHub** (source code, demos, and prototypes) and academic papers on **OpenAlex**.
3. Conducts deterministic checks and LLM-powered functional relevance filtering.
4. Analyzes capabilities, what-it-does actions, and computes similarity scores.
5. Deterministically determines the overall novelty verdict (`Existing`, `Partially Existing`, `Related`, or `No Similar Solution`).
6. Pinpoints the **Innovation Gap** (unaddressed features or alternative approaches).
7. Executes a **Verifier Agent** quality-gate before returning the final JSON response.

---

## 2. Tech Stack

- **Python 3.11+** (Tested on Python 3.12 / 3.13)
- **FastAPI + Uvicorn** running on port `5000`
- **LangGraph & LangChain Core** for multi-agent state graph orchestration and verify-retry routing
- **Pydantic v2** for strict schema validation across all tool inputs, outputs, and HTTP models
- **httpx (async)** for concurrent HTTP calls to GitHub and OpenAlex
- **OpenAI-compatible SDK** connected to **OpenRouter** (`https://openrouter.ai/api/v1`)
- **Pytest & Pytest-asyncio** for unit and integration testing

---

## 3. Architecture & Multi-Agent Design

```
                     HTTP POST /api/analysis
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Orchestrator Agent  │ (LangGraph StateGraph)
                    └──────────┬───────────┘
                               │
               [Step 1: problem_analyzer_tool]
                               │
              ┌────────────────┴────────────────┐
              ▼ (Concurrent: asyncio.gather)    ▼
   [Step 2a: github_search_tool]   [Step 2b: openalex_search_tool]
              └────────────────┬────────────────┘
                               │
                [Step 3: Candidate Evaluation]
              ┌────────────────┴────────────────┐
              ▼ (Repos)                         ▼ (Papers)
      relevance_filter_tool             relevance_filter_tool
              │ (Score >= 50)                   │ (Score >= 50)
      readme_analyzer_tool              paper_analyzer_tool
      implementation_analyzer_tool              │
      github_adapter                    openalex_adapter
      similarity_analyzer_tool          similarity_analyzer_tool
              └────────────────┬────────────────┘
                               │
              [Step 4: verdict_tool (Deterministic)]
                               │
              [Step 5: gap_comparison_tool (LLM)]
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Verifier Agent    │ (Audits URLs, Evidence & Ratings)
                    └──────────┬───────────┘
                               │
               Passed? ────────┴──────── No (Passes failing items for 1 re-analysis)
                  │
                  ▼
         JSON Response (with verification block)
```

### The 10 Atomic Tools
Each tool resides in its own file in `app/tools/`, defining an input schema, output schema, and tool definition:
1. `problem_analyzer_tool`: Deconstructs problem into domain, key concepts, technologies, actions, and 2–3 search queries.
2. `github_search_tool`: Searches GitHub, checks for code files, parses decoded READMEs ($\ge 150$ chars), and caps at 4 viable repos.
3. `openalex_search_tool`: Queries OpenAlex, reconstructs abstracts from inverted indices, and deduplicates papers.
4. `relevance_filter_tool`: Semantic LLM filter checking functional alignment (requires score $\ge 50$ to pass; rejects tech-buzzword false positives).
5. `paper_analyzer_tool`: Extracts problem, methodology, capabilities, and 3–6 `whatItDoes` points from research papers.
6. `readme_analyzer_tool`: Extracts problem, solution, technologies, capabilities, and `whatItDoes` points from repository READMEs.
7. `implementation_analyzer_tool`: Deterministic regex analyzer detecting code files, live demos, prototypes, deployments, and setup instructions.
8. `similarity_analyzer_tool`: Evaluates idea vs. existing solution (`High`, `Medium`, `Low`, reason, overlaps, differences).
9. `verdict_tool`: Deterministic verdict aggregator based on highest similarity level.
10. `gap_comparison_tool`: Identifies the innovation gap and synthesizes the existing technical landscape.

---

## 4. Setup & Running

### Step 1: Environment Setup
Inside the `AI` directory, create a virtual environment and install dependencies:

```bash
cd AI
uv venv
.venv\Scripts\activate   # Windows (or: source .venv/bin/activate on Linux/macOS)
uv pip install -r requirements.txt
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:

```bash
copy .env.example .env   # Windows (or: cp .env.example .env on Linux/macOS)
```

Fill in your configuration:
```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=openrouter/free

# Optional: provides 5,000 req/hr on GitHub API
GITHUB_TOKEN=your_github_token_here

HOST=0.0.0.0
PORT=5000
```

### Step 3: Run the Development Server
Start the Uvicorn ASGI server:

```bash
uvicorn app.main:app --port 5000 --reload
```

Server endpoints:
- Swagger Documentation: `http://localhost:5000/docs`
- Health Check: `http://localhost:5000/api/health`
- Analysis Endpoint: `http://localhost:5000/api/analysis`

---

## 5. Running Tests

Run the test suite for all deterministic analyzers, deduplication algorithms, and abstract reconstruction:

```bash
pytest -v tests
```

---

## 6. API Contract & Example cURL

### Request
```bash
curl -X POST "http://localhost:5000/api/analysis" \
  -H "Content-Type: application/json" \
  -d '{
    "ProblemStatement": "Inefficient streetlight power consumption and delayed fault reporting in smart cities.",
    "MySolution": "An IoT-enabled mesh network of sensors that dynamically dims streetlights based on pedestrian presence and transmits automated fault tickets via LoRaWAN."
  }'
```

### Response
```json
{
  "status": "Analysis Complete",
  "title": "Inefficient streetlight power consumption and delayed fault reporting in smart cities.",
  "description": "The system analyzes your idea, searches for existing solutions, compares capabilities and identifies the gap in the current landscape.",
  "overallResult": "Existing",
  "overallResultNote": "At least one analyzed source appears to address a highly similar problem or solution area.",
  "proposed": "An IoT-enabled mesh network of sensors...",
  "existingTech": ["IoT", "LoRaWAN", "Sensors"],
  "potentialGap": "Existing solutions utilize cellular GSM instead of low-power LoRaWAN mesh networking...",
  "summary": "Discovered several open source repositories and IEEE papers addressing smart streetlight monitoring.",
  "similarSolutions": [
    {
      "id": "github-123456",
      "name": "smart-street-light-iot",
      "type": "Open Source Project",
      "problem": "Manual detection of street light failures",
      "solution": "Automated street light control with sensor feedback",
      "technologies": ["C++", "Arduino", "LoRa"],
      "capabilities": ["Fault detection", "Dimming"],
      "whatItDoes": ["Detects faulty bulbs", "Sends telemetry alerts"],
      "sourceUrl": "https://github.com/example/smart-street-light-iot",
      "implementation": {
        "codeAvailable": true,
        "demoAvailable": false,
        "demoUrl": null,
        "prototypeMentioned": true,
        "deploymentMentioned": false,
        "deploymentUrl": null,
        "runInstructionsAvailable": true,
        "evidence": [...]
      },
      "similarity": {
        "similarity": "High",
        "reason": "Direct overlap in IoT-based streetlight fault detection and telemetry.",
        "overlap": ["IoT telemetry", "Fault detection"],
        "differences": ["Uses cellular GSM rather than dynamic mesh routing"]
      }
    }
  ],
  "verification": {
    "passed": true,
    "checks": [
      "All solutions provide valid HTTP/HTTPS source URLs.",
      "All solutions have non-empty similarity explanation reasons.",
      "All High and Medium similarity ratings are grounded by evidence.",
      "Overall verdict correctly conforms to deterministic rules.",
      "Potential innovation gap is present and adequately formulated."
    ],
    "confidence": 1.0,
    "evidence": [
      {
        "solutionId": "github-123456",
        "sourceUrl": "https://github.com/example/smart-street-light-iot",
        "supportingSnippet": "Automated street light control with sensor feedback..."
      }
    ],
    "warnings": []
  }
}
```
