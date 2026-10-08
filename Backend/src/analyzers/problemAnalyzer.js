require("dotenv").config();

const OpenAI = require("openai");

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY
});


const analyzeProblem = async (
  problemStatement,
  mySolution
) => {

  const prompt = `
You are analyzing an innovation idea for a system called InnoGap.

Your job is NOT to decide whether the idea is original or legally novel.

Your job is to understand the problem and create useful search queries
that can help find existing solutions.

Problem Statement:
${problemStatement}

Proposed Solution:
${mySolution}

Return ONLY a JSON object.

Do NOT include:
- markdown
- code fences
- explanations
- safety messages
- "User Safety"
- any text before or after the JSON

Use exactly this structure:

{
  "problem": "",
  "proposedSolution": "",
  "domain": "",
  "keyConcepts": [],
  "technologies": [],
  "actions": [],
  "searchQueries": []
}

Rules:

1. Identify the actual problem being solved.
2. Summarize the proposed solution.
3. Identify the general domain.
4. Extract important concepts.
5. Identify technologies mentioned or strongly implied.
6. Identify important actions such as detection, monitoring,
   prediction, tracking, automation, etc.
7. Generate 2 to 3 diverse search queries optimized specifically for GitHub repository search.
8. Each search query should be concise and keyword-focused (roughly 3 to 7 meaningful terms), combining domain concepts, the core problem or action, and relevant technical concepts or technologies when genuinely useful.
9. Avoid conversational filler phrases such as "how to", "system for", "project for", "using", "build a", or "application that".
10. Ensure the 2 to 3 queries are meaningfully different from each other rather than near-duplicates.
11. Do not make claims about originality.
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

    console.log("AI analysis response:");
    console.log(text);


    // Remove markdown code fences
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();


    // Find JSON object inside the response
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");


    if (start === -1 || end === -1) {
      throw new Error(
        "AI response does not contain valid JSON"
      );
    }


    const jsonText =
      text.substring(start, end + 1);


    return JSON.parse(jsonText);

  } catch (error) {

    console.error("AI analysis failed:");
    console.error(error.message);

    throw error;
  }
};


module.exports = {
  analyzeProblem
};