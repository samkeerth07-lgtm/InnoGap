const validateProblemAnalysis = (analysis) => {
  if (!analysis || typeof analysis !== "object") {
    return false;
  }

  if (
    !Array.isArray(analysis.searchQueries) ||
    analysis.searchQueries.length === 0
  ) {
    return false;
  }

  if (
    !Array.isArray(analysis.keyConcepts)
  ) {
    return false;
  }

  if (
    !Array.isArray(analysis.technologies)
  ) {
    return false;
  }

  if (
    !Array.isArray(analysis.actions)
  ) {
    return false;
  }

  return true;
};

module.exports = {
  validateProblemAnalysis
};