const adaptOpenAlexWork = (work, paperAnalysis = null) => {
  const title = work?.title || "Untitled research paper";
  const doiValue = typeof work?.doi === "string"
    ? work.doi.replace(/^https?:\/\/doi\.org\//i, "")
    : "";

  const sourceUrl = doiValue
    ? `https://doi.org/${doiValue}`
    : work?.ids?.openalex || work?.url || "";

  const analysis = paperAnalysis || {};

  return {
    id: `openalex-${work?.id || title}`,
    name: title,
    type: "Research Paper",
    icon: "brain",
    iconBg: "bg-violet-100 text-violet-700",
    description:
      analysis.solution ||
      work?.display_name ||
      "No description available.",
    capabilities: analysis.capabilities || [],
    problem: analysis.problem || "",
    solution: analysis.solution || "",
    technologies: analysis.technologies || [],
    whatItDoes: analysis.whatItDoes || [],
    sourceUrl,
  };
};

module.exports = {
  adaptOpenAlexWork,
};
