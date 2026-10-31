import pytest
from app.tools.implementation_analyzer_tool import run_implementation_analysis


def test_implementation_analyzer_full_features():
    readme = """
    # Smart Room System

    ## Live Demo
    Check out the [Live Demo](https://example.com/demo) for details.

    ## Deployment
    The application is deployed at [Production App](https://app.example.com).

    ## Prototype
    This project is a working prototype proof of concept.

    ## Installation & Setup
    ```bash
    npm install
    npm start
    ```
    """
    files = ["README.md", "package.json", "src/server.js", "src/client.ts"]

    result = run_implementation_analysis(readme, files)

    assert result.codeAvailable is True
    assert result.demoAvailable is True
    assert result.demoUrl == "https://example.com/demo"
    assert result.prototypeMentioned is True
    assert result.deploymentMentioned is True
    assert result.deploymentUrl == "https://app.example.com"
    assert result.runInstructionsAvailable is True
    assert len(result.evidence) >= 5


def test_implementation_analyzer_empty():
    result = run_implementation_analysis("", [])
    assert result.codeAvailable is False
    assert result.demoAvailable is False
    assert result.demoUrl is None
    assert result.prototypeMentioned is False
    assert result.deploymentMentioned is False
    assert result.runInstructionsAvailable is False
    assert len(result.evidence) == 0


def test_implementation_analyzer_python_files():
    readme = "Run via python main.py"
    files = ["main.py", "requirements.txt"]
    result = run_implementation_analysis(readme, files)
    assert result.codeAvailable is True
    assert result.runInstructionsAvailable is True
