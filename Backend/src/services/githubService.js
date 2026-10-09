const {
	analyzeImplementation
} = require("../analyzers/implementationAnalyzer");

const {
	analyzeReadme
} = require("../analyzers/readmeAnalyzer");

const {
	analyzeRepositoryRelevance
} = require("../analyzers/relevanceAnalyzer");

const {
	adaptGitHubRepository
} = require("../adapters/githubAdapter");

const {
	removeDuplicateRepositories
} = require("../utils/deduplicate");

const GITHUB_API_URL = "https://api.github.com";
const MAX_RESULTS_PER_QUERY = 5;
const MAX_REPOSITORIES = 10;
const MAX_SEMANTIC_CANDIDATES = 4;

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

const searchGitHub = async (searchQueries = [], problemStatement = "", mySolution = "") => {
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

	// 1. Fetch README and files for candidates and perform deterministic quality checks
	const inspectedCandidates = await Promise.all(
		repositories.map(async (repo) => {
			const [readme, files] = await Promise.all([
				getRepositoryReadme(repo),
				getRepositoryFiles(repo)
			]);

			const trimmedReadme = typeof readme === "string" ? readme.trim() : "";
			if (trimmedReadme.length < 150) {
				return null;
			}

			const implementationAnalysis = analyzeImplementation(trimmedReadme, files);
			const hasCode = implementationAnalysis.codeAvailable || (Boolean(repo.language) && (repo.size || 0) > 0);
			if (!hasCode) {
				return null;
			}

			return {
				repository: repo,
				readme: trimmedReadme,
				implementationAnalysis
			};
		})
	);

	// 2. Cap bounded candidates for expensive semantic evaluation (max 4)
	const viableCandidates = inspectedCandidates
		.filter(Boolean)
		.slice(0, MAX_SEMANTIC_CANDIDATES);

	// 3. Perform semantic relevance evaluation and deep README analysis
	const finalResults = await Promise.all(
		viableCandidates.map(async ({ repository, readme, implementationAnalysis }) => {
			const truncatedReadme = readme.length > 4000
				? readme.slice(0, 4000)
				: readme;

			let relevance = null;
			if (problemStatement && problemStatement.trim()) {
				relevance = await analyzeRepositoryRelevance(
					problemStatement,
					mySolution,
					{
						name: repository.name,
						description: repository.description || "",
						technologies: repository.language ? [repository.language] : [],
						readmeExcerpt: truncatedReadme.slice(0, 2000)
					}
				);

				if (!relevance.relevant || relevance.score < 50) {
					console.log(
						`Skipping irrelevant repository "${repository.full_name || repository.name}": ${relevance.reason}`
					);
					return null;
				}
			}

			const readmeAnalysis = await analyzeReadme(truncatedReadme);

			const adapted = adaptGitHubRepository({
				...repository,
				readmeAnalysis,
				implementationAnalysis
			});

			return {
				...adapted,
				relevance: relevance || {
					relevant: true,
					score: 100,
					reason: "Retained based on search query match and implementation evidence."
				}
			};
		})
	);

	return finalResults.filter(Boolean);
};

module.exports = {
	searchGitHub
};
