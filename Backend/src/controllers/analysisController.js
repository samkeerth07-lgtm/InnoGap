const {
  analyzeRelevance
} = require("../analyzers/relevanceAnalyzer");

const {
  analyzeComparison
} = require("../analyzers/comparisonAnalyzer");

const {
  analyzeOverallResult
} = require("../analyzers/resultAnalyzer");

const {
  analyzeSimilarity
} = require("../analyzers/similarityAnalyzer");

const {
  validateProblemAnalysis
} = require("../utils/validateAnalysis");

const {
  analyzeProblem: analyzeProblemWithAI
} = require("../analyzers/problemAnalyzer");

const {
  searchGitHub
} = require("../services/githubService");

const {
  searchOpenAlex
} = require("../services/openAlexService");

const {
  analyzePaper
} = require("../analyzers/paperAnalyzer");

const {
  adaptOpenAlexWork
} = require("../adapters/openAlexAdapter");


const analyzeProblem = async (req, res) => {

  console.log("ANALYSIS CONTROLLER CALLED");

  try {

    const {
      ProblemStatement,
      MySolution
    } = req.body;


    // --------------------------------
    // 1. Validate user input
    // --------------------------------

    if (!ProblemStatement) {

      return res.status(400).json({
        error: "ProblemStatement is required"
      });

    }


    // --------------------------------
    // 2. Analyze the user's problem
    // --------------------------------

    const problemAnalysis =
      await analyzeProblemWithAI(
        ProblemStatement,
        MySolution || ""
      );


    // --------------------------------
    // 3. Validate AI analysis
    // --------------------------------

    const isValidAnalysis =
      validateProblemAnalysis(
        problemAnalysis
      );


    if (!isValidAnalysis) {

      return res.status(500).json({
        error:
          "AI returned an invalid analysis format"
      });

    }


    console.log("Problem analysis:");
    console.log(problemAnalysis);


    // --------------------------------
    // 4. Search GitHub + OpenAlex
    //    AT THE SAME TIME
    // --------------------------------

    const githubPromise =
      searchGitHub(
        problemAnalysis.searchQueries
      ).catch((error) => {

        console.error(
          "GitHub search failed:"
        );

        console.error(
          error.message
        );

        return [];

      });


    const openAlexPromise =
      searchOpenAlex(
        problemAnalysis.searchQueries
      ).catch((error) => {

        console.error(
          "OpenAlex search failed:"
        );

        console.error(
          error.message
        );

        return [];

      });


    const [
      githubResults,
      openAlexWorks
    ] = await Promise.all([
      githubPromise,
      openAlexPromise
    ]);


    // --------------------------------
    // 5. Analyze OpenAlex papers
    //    IN PARALLEL
    // --------------------------------

    let openAlexResults = [];


    try {

      const analyzedOpenAlexResults =
        await Promise.all(

          openAlexWorks.map(
            async (work) => {

              // -------------------------
              // Get paper title
              // -------------------------

              const title =
                work?.title ||
                "Untitled research paper";


              // -------------------------
              // Reconstruct abstract
              // -------------------------

              const abstractText =
                work?.abstract_inverted_index
                  ? Object.entries(
                      work.abstract_inverted_index
                    )
                      .flatMap(
                        ([word, positions]) =>
                          positions.map(
                            (position) => ({
                              position,
                              word
                            })
                          )
                      )
                      .sort(
                        (a, b) =>
                          a.position -
                          b.position
                      )
                      .map(
                        (item) =>
                          item.word
                      )
                      .join(" ")
                  : "";


              // -------------------------
              // Analyze paper with AI
              // -------------------------
              const relevance =
  await analyzeRelevance(
    ProblemStatement,
    MySolution || "",
    title,
    abstractText
  );

console.log(
  `Relevance for "${title}":`,
  relevance
);

if (!relevance.relevant) {
  console.log(
    `Skipping irrelevant paper: ${title}`
  );

  return null;
}
              const analysis =
                await analyzePaper(
                  title,
                  abstractText,
                  {
                    publicationYear:
                      work?.publication_year,

                    venue:
                      work?.host_venue
                        ?.display_name ||
                      "",

                    doi:
                      work?.doi ||
                      "",

                    type:
                      work?.type ||
                      ""
                  }
                );


              // -------------------------
              // Convert OpenAlex format
              // to InnoGap format
              // -------------------------

              const adapted =
                adaptOpenAlexWork(
                  work,
                  analysis
                );


              // -------------------------
              // Analyze similarity
              // -------------------------

              const similarity =
                await analyzeSimilarity(
                  ProblemStatement,
                  MySolution || "",
                  adapted
                );


              // -------------------------
              // Return final paper
              // -------------------------

              return {
                ...adapted,
                similarity
              };

            }
          )

        );


      openAlexResults =
        analyzedOpenAlexResults.filter(Boolean);


    } catch (error) {

      console.error(
        "OpenAlex analysis failed:"
      );

      console.error(
        error.message
      );

      openAlexResults = [];

    }


    // --------------------------------
    // 6. Combine all solutions
    // --------------------------------

    const allSolutions = [
      ...githubResults,
      ...openAlexResults
    ];


    console.log(
      "GitHub results:",
      githubResults.length
    );

    console.log(
      "OpenAlex results:",
      openAlexResults.length
    );

    console.log(
      "Combined results:",
      allSolutions.length
    );


    // --------------------------------
    // 7. Calculate overall result
    // --------------------------------

    const overallAnalysis =
      analyzeOverallResult(
        allSolutions
      );


    console.log(
      "Overall analysis:"
    );

    console.log(
      overallAnalysis
    );


    // --------------------------------
    // 8. Compare all discovered
    //    solutions with user's idea
    // --------------------------------

    const comparisonAnalysis =
      await analyzeComparison(
        ProblemStatement,
        MySolution || "",
        allSolutions
      );


    console.log(
      "Comparison analysis:"
    );

    console.log(
      comparisonAnalysis
    );


    // --------------------------------
    // 9. Build final response
    // --------------------------------

    const result = {

      status:
        "Analysis Complete",


      title:
        ProblemStatement,


      description:
        "The system analyzes your idea, searches for existing solutions, compares capabilities and identifies the gap in the current landscape.",


      overallResult:
        overallAnalysis.overallResult,


      overallResultNote:
        overallAnalysis.overallResultNote,


      proposed:
        MySolution ||
        "No proposed solution provided.",


      existingTech:
        problemAnalysis.technologies ||
        [],


      potentialGap:
        comparisonAnalysis.potentialGap ||
        "Potential gap will be identified after comparing your idea with the discovered solutions.",


      summary:
        comparisonAnalysis.summary ||
        "The system found potentially related solutions from GitHub and research sources based on the problem and solution concepts identified by the AI.",


      similarSolutions:
        allSolutions

    };


    // --------------------------------
    // 10. Send response to frontend
    // --------------------------------

    res.json(result);


  } catch (error) {

    console.error(
      "Analysis failed:"
    );

    console.error(
      error
    );


    res.status(500).json({

      error:
        "Analysis failed",

      message:
        error.message

    });

  }

};


module.exports = {
  analyzeProblem
};