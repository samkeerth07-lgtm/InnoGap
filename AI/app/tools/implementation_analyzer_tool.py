import re
from typing import Any, Dict, List
from app.schemas.solutions import ImplementationEvidence
from app.schemas.tools import ImplementationAnalyzerInput, ImplementationAnalyzerOutput
from app.tools.base import AgentTool

CODE_EXTENSIONS = re.compile(
    r"\.(js|jsx|ts|tsx|py|java|cpp|c|cs|go|rs|php|rb|swift|kt)$",
    re.IGNORECASE,
)
MARKDOWN_LINK_REGEX = re.compile(r"\[([^\]]+)\]\((https?://[^)\s]+)\)")
RAW_URL_REGEX = re.compile(r"https?://[^\s<>)]+")

DEMO_KEYWORDS = ["demo", "live demo", "try it", "try the app", "working demo"]
PROTOTYPE_KEYWORDS = ["prototype", "working prototype", "proof of concept", "poc"]
DEPLOYMENT_KEYWORDS = ["deployed", "deployment", "production", "live application", "live app"]
RUN_KEYWORDS = [
    "npm install",
    "npm start",
    "npm run",
    "python ",
    "docker compose",
    "docker run",
    "installation",
    "setup",
    "getting started",
]


def extract_urls(readme: str) -> List[Dict[str, str]]:
    links: List[Dict[str, str]] = []

    for match in MARKDOWN_LINK_REGEX.finditer(readme):
        links.append({"label": match.group(1), "url": match.group(2)})

    raw_urls = RAW_URL_REGEX.findall(readme)
    existing_urls = {l["url"] for l in links}

    for u in raw_urls:
        if u not in existing_urls:
            links.append({"label": "", "url": u})

    return links


def run_implementation_analysis(
    readme: str, files: List[str] = None
) -> ImplementationAnalyzerOutput:
    files = files or []
    text = (readme or "").lower()
    links = extract_urls(readme or "")

    code_available = any(CODE_EXTENSIONS.search(f) for f in files)
    evidence: List[ImplementationEvidence] = []

    # 1. Demo
    demo_available = False
    demo_url = None
    demo_link = next(
        (
            l
            for l in links
            if any(k in l["label"].lower() for k in DEMO_KEYWORDS)
        ),
        None,
    )

    if demo_link:
        demo_available = True
        demo_url = demo_link["url"]
        evidence.append(
            ImplementationEvidence(
                type="Demo",
                url=demo_link["url"],
                description=f"README contains a demo link: {demo_link['label']}",
            )
        )
    elif any(k in text for k in DEMO_KEYWORDS):
        evidence.append(
            ImplementationEvidence(
                type="Demo Mention",
                description="README mentions a demo, but no specific demo URL was found.",
            )
        )

    # 2. Prototype
    prototype_mentioned = False
    if any(k in text for k in PROTOTYPE_KEYWORDS):
        prototype_mentioned = True
        evidence.append(
            ImplementationEvidence(
                type="Prototype",
                description="README mentions a prototype or proof of concept.",
            )
        )

    # 3. Deployment
    deployment_mentioned = False
    deployment_url = None
    deployment_link = next(
        (
            l
            for l in links
            if any(k in l["label"].lower() for k in DEPLOYMENT_KEYWORDS)
        ),
        None,
    )

    if deployment_link:
        deployment_mentioned = True
        deployment_url = deployment_link["url"]
        evidence.append(
            ImplementationEvidence(
                type="Deployment",
                url=deployment_link["url"],
                description=f"README contains a deployment link: {deployment_link['label']}",
            )
        )
    elif any(k in text for k in DEPLOYMENT_KEYWORDS):
        deployment_mentioned = True
        evidence.append(
            ImplementationEvidence(
                type="Deployment Mention",
                description="README mentions deployment, but no specific deployment URL was found.",
            )
        )

    # 4. Run Instructions
    run_instructions_available = False
    if any(k in text for k in RUN_KEYWORDS):
        run_instructions_available = True
        evidence.append(
            ImplementationEvidence(
                type="Run Instructions",
                description="README contains instructions or commands for running the project.",
            )
        )

    # 5. Source Code
    if code_available:
        evidence.append(
            ImplementationEvidence(
                type="Source Code",
                description="Repository contains source-code files.",
            )
        )

    return ImplementationAnalyzerOutput(
        codeAvailable=code_available,
        demoAvailable=demo_available,
        demoUrl=demo_url,
        prototypeMentioned=prototype_mentioned,
        prototypeUrl=None,
        deploymentMentioned=deployment_mentioned,
        deploymentUrl=deployment_url,
        runInstructionsAvailable=run_instructions_available,
        evidence=evidence,
    )


async def _run_implementation_analyzer(
    input_data: ImplementationAnalyzerInput,
) -> ImplementationAnalyzerOutput:
    return run_implementation_analysis(input_data.readme, input_data.files)


implementation_analyzer_tool = AgentTool(
    name="implementation_analyzer_tool",
    description="Deterministic rule-based analyzer that detects code by file extensions and extracts live demo, prototype, deployment, and run-instruction URLs/mentions via regex.",
    input_schema=ImplementationAnalyzerInput,
    output_schema=ImplementationAnalyzerOutput,
    func=_run_implementation_analyzer,
)
