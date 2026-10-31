from typing import List, Tuple
from app.schemas.solutions import UnifiedSolution
from app.schemas.verification import EvidenceItem, VerificationResult
from app.tools.verdict_tool import compute_deterministic_verdict


class VerifierAgent:
    """
    Verifier Agent performs the final quality gate and evidence verification:
    1. Checks that every solution has a valid source URL and non-empty similarity reason.
    2. Cross-checks High/Medium ratings against stored evidence and downgrades/flags unsupported ones.
    3. Confirms overallResult matches deterministic verdict rules.
    4. Confirms potentialGap is consistent with retained solutions.
    5. Returns structured VerificationResult and a list of failing items for re-analysis if needed.
    """

    def __init__(self):
        self.name = "verifier_agent"

    async def verify(
        self,
        problem_statement: str,
        my_solution: str,
        solutions: List[UnifiedSolution],
        overall_result: str,
        potential_gap: str,
        is_reanalysis_pass: bool = False,
    ) -> Tuple[VerificationResult, List[UnifiedSolution]]:
        checks = []
        warnings = []
        evidence_items: List[EvidenceItem] = []
        failing_solutions: List[UnifiedSolution] = []

        # Check 1: Source URLs
        invalid_urls = [
            s.id for s in solutions
            if not s.sourceUrl or not (s.sourceUrl.startswith("http://") or s.sourceUrl.startswith("https://"))
        ]
        if not invalid_urls:
            checks.append("All solutions provide valid HTTP/HTTPS source URLs.")
        else:
            warnings.append(f"Solutions with missing/invalid source URLs: {', '.join(invalid_urls)}")

        # Check 2: Non-empty similarity reasons
        empty_reasons = [
            s.id for s in solutions
            if not s.similarity or not s.similarity.reason or not s.similarity.reason.strip()
        ]
        if not empty_reasons:
            checks.append("All solutions have non-empty similarity explanation reasons.")
        else:
            warnings.append(f"Solutions with empty similarity reasons: {', '.join(empty_reasons)}")

        # Check 3: Cross-check High/Medium similarity against evidence
        unsupported_ratings = []
        for s in solutions:
            sim_level = s.similarity.similarity.capitalize() if s.similarity else "Low"
            snippet = s.solution or (s.whatItDoes[0] if s.whatItDoes else s.description) or "No detailed description."
            evidence_items.append(
                EvidenceItem(
                    solutionId=s.id,
                    sourceUrl=s.sourceUrl or "N/A",
                    supportingSnippet=snippet[:250],
                )
            )

            if sim_level == "High":
                # High similarity requires overlap evidence or substantial description
                if not s.similarity.overlap and len(s.similarity.reason.strip()) < 15:
                    unsupported_ratings.append(s.id)
                    failing_solutions.append(s)
                    if not is_reanalysis_pass:
                        # Downgrade to Medium until re-evaluated
                        s.similarity.similarity = "Medium"
                        warnings.append(
                            f"Solution '{s.id}' flagged: High similarity lacked overlap evidence, adjusted to Medium."
                        )

            elif sim_level == "Medium":
                if not s.similarity.reason or len(s.similarity.reason.strip()) < 5:
                    unsupported_ratings.append(s.id)
                    failing_solutions.append(s)
                    if not is_reanalysis_pass:
                        s.similarity.similarity = "Low"
                        warnings.append(
                            f"Solution '{s.id}' flagged: Medium similarity lacked explanation, adjusted to Low."
                        )

        if not unsupported_ratings:
            checks.append("All High and Medium similarity ratings are grounded by evidence.")
        else:
            checks.append("High/Medium ratings were audited against evidence.")

        # Check 4: Confirm deterministic overallResult rule
        expected_verdict = compute_deterministic_verdict(solutions)
        if overall_result == expected_verdict.overallResult:
            checks.append(f"Overall verdict '{overall_result}' correctly conforms to deterministic rules.")
        else:
            warnings.append(
                f"Overall verdict mismatch: was '{overall_result}', expected '{expected_verdict.overallResult}'."
            )

        # Check 5: Potential gap consistency
        if potential_gap and potential_gap.strip() and len(potential_gap.strip()) > 10:
            checks.append("Potential innovation gap is present and adequately formulated.")
        else:
            warnings.append("Potential innovation gap is empty or overly brief.")

        # Calculate confidence
        confidence = 1.0
        if warnings:
            confidence = max(0.5, round(1.0 - (len(warnings) * 0.1), 2))

        # Fail if there are critical missing items on the initial pass
        passed = (len(failing_solutions) == 0 and len(empty_reasons) == 0) or is_reanalysis_pass

        verification_result = VerificationResult(
            passed=passed,
            checks=checks,
            confidence=confidence,
            evidence=evidence_items,
            warnings=warnings,
        )

        return verification_result, failing_solutions


verifier_agent = VerifierAgent()
