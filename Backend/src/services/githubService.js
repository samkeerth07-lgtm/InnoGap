const {
  analyzeReadme
} = require("../analyzers/readmeAnalyzer");

const fetchGitHubReadme = async (owner, repo) => {
  const url =
    `https://api.github.com/repos/${owner}/${repo}/readme`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.raw+json"
    }
  });

  if (!response.ok) {
    console.log(
      `README not available for ${owner}/${repo}`
    );

    return "";
  }

  return await response.text();
};


const {
  removeDuplicateRepositories
} = require("../utils/deduplicate");


const {
  adaptGitHubRepository
} = require("../adapters/githubAdapter");


const searchGitHub = async (searchQueries) => {

  let allRepositories = [];

  for (const query of searchQueries) {

    console.log("Searching GitHub for:", query);

    const url =
      `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}`;

    const response = await fetch(url);

    console.log("GitHub status:", response.status);

    if (!response.ok) {
      throw new Error(
        `GitHub API request failed: ${response.status}`
      );
    }

    const data = await response.json();

    console.log(
      `Repositories found for "${query}":`,
      data.total_count
    );


    // Get only the first 3 repositories
    const repositories = data.items.slice(0, 3);


    // Fetch README for each repository
    for (const repository of repositories) {
      const readme = await fetchGitHubReadme(
  repository.owner.login,
  repository.name
);

// Skip repositories without a README
if (!readme || !readme.trim()) {
  console.log(
    `Skipping ${repository.name} - no README found`
  );

  continue;
}

repository.readme = readme;

const readmeAnalysis =
  await analyzeReadme(readme);

// Skip repositories whose README could not be analyzed
if (!readmeAnalysis) {
  console.log(
    `Skipping ${repository.name} - README analysis failed`
  );

  continue;
}

repository.readmeAnalysis = readmeAnalysis;
    }
    console.log(
    `README analysis for ${repository.name}:`,
    readmeAnalysis
  );


    // Add repositories after README is fetched
    allRepositories.push(...repositories);
  }


  console.log(
    "Total repositories collected:",
    allRepositories.length
  );


  // Remove duplicate repositories
  const uniqueRepositories =
    removeDuplicateRepositories(allRepositories);

  console.log(
    "Unique repositories:",
    uniqueRepositories.length
  );


  // Convert GitHub format into InnoGap format
  const adaptedRepositories =
    uniqueRepositories.map(
      adaptGitHubRepository
    );


  return adaptedRepositories;
};


module.exports = {
  searchGitHub
};