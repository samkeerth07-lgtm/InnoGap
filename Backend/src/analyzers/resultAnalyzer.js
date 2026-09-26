const analyzeOverallResult = (solutions) => {

  if (!solutions || solutions.length === 0) {
    return {
      overallResult: "No Similar Solution",
      overallResultNote:
        "No related solutions were found in the sources analyzed."
    };
  }

  const similarityLevels = solutions
    .map((solution) => solution.similarity?.similarity)
    .filter(Boolean);

  const highCount =
    similarityLevels.filter(
      (level) => level === "High"
    ).length;

  const mediumCount =
    similarityLevels.filter(
      (level) => level === "Medium"
    ).length;

  const lowCount =
    similarityLevels.filter(
      (level) => level === "Low"
    ).length;

  if (highCount > 0) {
    return {
      overallResult: "Existing",
      overallResultNote:
        "At least one analyzed source appears to address a highly similar problem or solution area."
    };
  }

  if (mediumCount > 0) {
    return {
      overallResult: "Partially Existing",
      overallResultNote:
        "Related solutions were found, but the analyzed sources do not appear to completely match the proposed solution."
    };
  }

  if (lowCount > 0) {
    return {
      overallResult: "Related",
      overallResultNote:
        "Related projects were found, but the analyzed solutions have limited similarity to the proposed idea."
    };
  }

  return {
    overallResult: "No Similar Solution",
    overallResultNote:
      "No meaningful similarity could be determined from the analyzed sources."
  };
};

module.exports = {
  analyzeOverallResult
};