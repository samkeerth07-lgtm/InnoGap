const adaptGitHubRepository = (repository) => {

  const analysis = repository.readmeAnalysis;

  return {
    id: `github-${repository.id}`,

    name: repository.name,

    type: "Open Source Project",

    icon: "cpu",

    iconBg: "bg-gray-900 text-white",

    description:
      analysis?.solution ||
      repository.description ||
      "No description available.",

    capabilities:
      analysis?.capabilities?.length
        ? analysis.capabilities
        : [
            repository.language || "Programming"
          ],

    problem:
      analysis?.problem || "",

    solution:
      analysis?.solution || "",

    technologies:
      analysis?.technologies || [],

    whatItDoes:
      analysis?.whatItDoes || [],

    sourceUrl:
      repository.html_url
  };
};

module.exports = {
  adaptGitHubRepository
};