const removeDuplicateRepositories = (repositories) => {
  const uniqueRepositories = [];
  const seenIds = new Set();

  for (const repository of repositories) {
    if (!seenIds.has(repository.id)) {
      seenIds.add(repository.id);
      uniqueRepositories.push(repository);
    }
  }

  return uniqueRepositories;
};

module.exports = {
  removeDuplicateRepositories
};