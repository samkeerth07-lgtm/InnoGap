const reconstructAbstractText = (abstractInvertedIndex) => {
  if (!abstractInvertedIndex || typeof abstractInvertedIndex !== 'object') {
    return '';
  }

  const wordsWithPositions = [];

  Object.entries(abstractInvertedIndex).forEach(([word, positions]) => {
    if (!Array.isArray(positions)) {
      return;
    }

    positions.forEach((position) => {
      wordsWithPositions.push({
        position: Number(position) || 0,
        word,
      });
    });
  });

  if (wordsWithPositions.length === 0) {
    return '';
  }

  wordsWithPositions.sort((a, b) => a.position - b.position);

  return wordsWithPositions
    .map((entry) => entry.word)
    .join(' ');
};

const deduplicateOpenAlexWorks = (works) => {
  const seen = new Set();
  const uniqueWorks = [];

  for (const work of works) {
    const key = work?.id || work?.doi || work?.title || null;

    if (!key) {
      continue;
    }

    const normalizedKey = String(key).toLowerCase();

    if (seen.has(normalizedKey)) {
      continue;
    }

    seen.add(normalizedKey);
    uniqueWorks.push(work);
  }

  return uniqueWorks;
};

const searchOpenAlex = async (searchQueries = []) => {
  const allWorks = [];

  for (const query of searchQueries) {
    console.log('Searching OpenAlex for:', query);

    const url =
      `https://api.openalex.org/works?search=${encodeURIComponent(query)}&per-page=5`;

    try {
      const response = await fetch(url);

      console.log('OpenAlex status:', response.status);

      if (!response.ok) {
        console.log(
          `OpenAlex request failed for query: "${query}" with status ${response.status}`
        );
        continue;
      }

      const data = await response.json();
      const works = Array.isArray(data.results) ? data.results : [];

      console.log(`Works found for "${query}":`, works.length);

      allWorks.push(...works);
    } catch (error) {
      console.error(`OpenAlex search failed for query: "${query}"`);
      console.error(error.message);
    }
  }

  const uniqueWorks = deduplicateOpenAlexWorks(allWorks);

  console.log('Total OpenAlex works collected:', allWorks.length);
  console.log('Unique OpenAlex works after deduplication:', uniqueWorks.length);

  return uniqueWorks;
};

module.exports = {
  searchOpenAlex,
  reconstructAbstractText,
  deduplicateOpenAlexWorks,
};
