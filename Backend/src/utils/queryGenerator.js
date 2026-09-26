const generateGitHubQueries = (problemStatement) => {
  const text = problemStatement.toLowerCase();

  const keywordGroups = {
    problem: [
      "fault",
      "failure",
      "broken",
      "damage",
      "monitoring",
      "detection",
      "inspection"
    ],

    domain: [
      "street light",
      "streetlight",
      "traffic",
      "agriculture",
      "healthcare",
      "hospital",
      "water",
      "waste",
      "energy",
      "education"
    ],

    technology: [
      "iot",
      "ai",
      "machine learning",
      "computer vision",
      "sensor",
      "robot",
      "blockchain",
      "drone",
      "gps"
    ],

    action: [
      "detect",
      "monitor",
      "predict",
      "identify",
      "track",
      "alert",
      "automate"
    ]
  };

  const found = {
    problem: [],
    domain: [],
    technology: [],
    action: []
  };

  for (const category in keywordGroups) {
    for (const keyword of keywordGroups[category]) {
      if (text.includes(keyword)) {
        found[category].push(keyword);
      }
    }
  }

  console.log("Detected concepts:", found);

  const queries = [];

  if (found.domain.length && found.problem.length) {
    queries.push(
      `${found.domain[0]} ${found.problem[0]}`
    );
  }

  if (found.domain.length && found.technology.length) {
    queries.push(
      `${found.domain[0]} ${found.technology[0]}`
    );
  }

  if (found.domain.length && found.action.length) {
    queries.push(
      `${found.domain[0]} ${found.action[0]}`
    );
  }

  return [...new Set(queries)];
};

module.exports = {
  generateGitHubQueries
};