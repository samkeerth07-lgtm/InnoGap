require("dotenv").config();

const OpenAI = require("openai");

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY
});

const analyzeComparison = async (
  problemStatement,
  mySolution,
  existingSolutions
) => {

  const simplifiedSolutions =
    existingSolutions.map((solution) => ({
      name: solution.name,
      problem: solution.problem,
      solution: solution.solution,
      technologies: solution.technologies,
      similarity: solution.similarity
    }));

  const prompt = `
You are the final comparison analyzer for InnoGap.

InnoGap helps students understand whether similar solutions
already exist for their problem.

Your task is to compare the user's proposed idea with the
existing solutions discovered during the analysis.

IMPORTANT:

You are NOT determining:
- patentability
- legal novelty
- ownership
- intellectual property rights

You are only analyzing the technical and functional
similarities and differences.

USER PROBLEM:
${problemStatement}

USER PROPOSED SOLUTION:
${mySolution}

EXISTING SOLUTIONS:
${JSON.stringify(simplifiedSolutions, null, 2)}

Return ONLY valid JSON.

Use exactly this structure:

{
  "potentialGap": "",
  "summary": ""
}

Rules for "summary":

1. Summarize what kinds of existing solutions were found.
2. Mention the main approaches used by those solutions.
3. Explain how they relate to the user's proposed solution.
4. Keep it concise.
5. Do not claim that the user's idea is original.

Rules for "potentialGap":

1. Identify meaningful differences between the user's
   proposed solution and the existing solutions.
2. Focus on functionality, approach, technology,
   target use case, or implementation.
3. If there is no clear difference, say that no clear
   gap was identified from the analyzed sources.
4. Do not invent features or capabilities.
5. Do not claim legal or patent novelty.
6. Keep it concise.

Do not include:
- markdown
- code fences
- explanations outside JSON
- safety messages
- any text before or after the JSON
`;

  try {

    const response =
      await client.chat.completions.create({
        model: "openrouter/free",

        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      });

    let text =
      response.choices[0].message.content;

    console.log("Comparison AI response:");
    console.log(text);

    text = text
  .replace(/```json/gi, "")
  .replace(/```/g, "")
  .trim();

const start = text.indexOf("{");
const end = text.lastIndexOf("}");

if (start === -1 || end === -1) {
  throw new Error(
    "Comparison AI response does not contain valid JSON"
  );
}

const jsonText = text.substring(start, end + 1);

try {
  return JSON.parse(jsonText);
} catch (parseError) {
  console.error("Invalid comparison JSON:");
  console.error(jsonText);

  throw new Error(
    "Comparison AI returned malformed JSON"
  );
}

  } catch (error) {

    console.error(
      "Comparison analysis failed:"
    );

    console.error(error.message);

    return {
      potentialGap:
        "A clear gap could not be determined from the analyzed sources.",

      summary:
        "Related solutions were found and analyzed, but the comparison could not be completed."
    };
  }
};

module.exports = {
  analyzeComparison
};