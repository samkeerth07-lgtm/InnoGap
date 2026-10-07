const {
	analyzeImplementation
} = require("../analyzers/implementationAnalyzer");

const {
	analyzeReadme
} = require("../analyzers/readmeAnalyzer");

const {
	adaptGitHubRepository
} = require("../adapters/githubAdapter");

const {
	removeDuplicateRepositories
} = require("../utils/deduplicate");

const GITHUB_API_URL = "https://api.github.com";
const MAX_RESULTS_PER_QUERY = 5;
const MAX_REPOSITORIES = 10;

const githubHeaders = (accept = "application/vnd.github+json") => {
	const headers = {
		Accept: accept,
		"X-GitHub-Api-Version": "2022-11-28"
	};

	if (process.env.GITHUB_TOKEN) {
		headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
	}

	return headers;
};

const requestJson = async (url) => {
	const response = await fetch(url, {
		headers: githubHeaders()
	});

	if (!response.ok) {
		throw new Error(`GitHub request failed with status ${response.status}`);
	}

	return response.json();
};

const getRepositoryReadme = async (repository) => {
	try {
		const data = await requestJson(
			`${GITHUB_API_URL}/repos/${repository.full_name}/readme`
		);

		if (data.encoding !== "base64" || !data.content) {
			return "";
		}

		return Buffer.from(data.content, "base64").toString("utf8");
	} catch (error) {
		console.warn(`Could not read README for ${repository.full_name}: ${error.message}`);
		return "";
	}
};

const getRepositoryFiles = async (repository) => {
	try {
		const branch = encodeURIComponent(repository.default_branch || "main");
		const data = await requestJson(
			`${GITHUB_API_URL}/repos/${repository.full_name}/git/trees/${branch}?recursive=1`
		);

		return (data.tree || [])
			.filter((entry) => entry.type === "blob")
			.map((entry) => entry.path);
	} catch (error) {
		console.warn(`Could not read files for ${repository.full_name}: ${error.message}`);
		return [];
	}
};

const searchRepositories = async (query) => {
	try {
		const params = new URLSearchParams({
			q: query,
			sort: "stars",
			order: "desc",
			per_page: String(MAX_RESULTS_PER_QUERY)
		});
		const data = await requestJson(
			`${GITHUB_API_URL}/search/repositories?${params}`
		);

		return data.items || [];
	} catch (error) {
		console.warn(`GitHub search failed for "${query}": ${error.message}`);
		return [];
	}
};

const analyzeRepository = async (repository) => {
	const [readme, files] = await Promise.all([
		getRepositoryReadme(repository),
		getRepositoryFiles(repository)
	]);

	const readmeAnalysis = await analyzeReadme(readme);
	const implementationAnalysis = analyzeImplementation(readme, files);

	return adaptGitHubRepository({
		...repository,
		readmeAnalysis,
		implementationAnalysis
	});
};

const searchGitHub = async (searchQueries = []) => {
	if (!Array.isArray(searchQueries)) {
		return [];
	}

	const queries = [...new Set(
		searchQueries.filter((query) => typeof query === "string" && query.trim())
	)];

	if (!queries.length) {
		return [];
	}

	const searchResults = await Promise.all(
		queries.map(searchRepositories)
	);
	const repositories = removeDuplicateRepositories(searchResults.flat())
		.slice(0, MAX_REPOSITORIES);

	return Promise.all(repositories.map(analyzeRepository));
};

module.exports = {
	searchGitHub
};
