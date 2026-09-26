require("dotenv").config();

const OpenAI = require("openai");

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY
});

const analyzeSimilarity = async (
  problemStatement,
  mySolution,
  existingSolution
) => {

  const prompt = `
You are analyzing an innovation idea for InnoGap.

Your task is to compare the user's idea with an existing project.

Do NOT decide legal ownership or patent novelty.

Focus only on whether the existing project appears to solve
the same or a related problem.

USER PROBLEM:
${problemStatement}

USER PROPOSED SOLUTION:
${mySolution}

EXISTING PROJECT PROBLEM:
${existingSolution.problem}

EXISTING PROJECT SOLUTION:
${existingSolution.solution}

EXISTING PROJECT TECHNOLOGIES:
${existingSolution.technologies.join(", ")}

Return ONLY valid JSON.

Use exactly this structure:

{
  "similarity": "",
  "reason": "",
  "overlap": [],
  "differences": []
}

Rules:

1. similarity must be one of:
   "High"
   "Medium"
   "Low"

2. "reason" should briefly explain why the similarity
   level was assigned.

3. "overlap" should contain important concepts or
   capabilities shared by both solutions.

4. "differences" should contain important differences
   between the user's proposed solution and the existing project.

5. Do not claim that either idea is original.

6. Do not invent information.

7. Keep the response concise.
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

    console.log("Similarity AI response:");
    console.log(text);

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error(
        "Similarity AI response does not contain valid JSON"
      );
    }

    const jsonText =
      text.substring(start, end + 1);

    return JSON.parse(jsonText);

  } catch (error) {

    console.error(
      "Similarity analysis failed:"
    );

    console.error(error.message);

    return {
      similarity: "Low",
      reason: "Similarity analysis could not be completed.",
      overlap: [],
      differences: []
    };
  }
};

module.exports = {
  analyzeSimilarity
};