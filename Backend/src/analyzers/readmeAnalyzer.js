require("dotenv").config();

const OpenAI = require("openai");

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY
});


const analyzeReadme = async (readme) => {

  if (!readme || readme.trim() === "") {
    return null;
  }

  const prompt = `
You are analyzing a GitHub project for InnoGap.

Your job is to understand what this project actually does.

Read the following GitHub README:

--- README START ---
${readme}
--- README END ---

Return ONLY a JSON object.

Do NOT include:
- explanations
- safety messages
- markdown
- code fences
- "User Safety"
- any text before or after the JSON

The JSON must use exactly this structure:

{
  "problem": "",
  "solution": "",
  "technologies": [],
  "capabilities": [],
  "whatItDoes": []
}

Rules:

1. Explain the real-world problem this project tries to solve.
2. Explain the solution or system that the project builds.
3. Extract important technologies used by the project.
4. Extract important capabilities of the solution.
5. Generate "whatItDoes" as 3 to 6 short statements describing
   the concrete actions or functions performed by the project.
6. Each "whatItDoes" item must be a specific action.
7. Do not repeat the solution description.
8. Do not include vague statements.
9. Only include actions supported by the README.
10. Do not claim that the project is original.
11. Do not invent information.
12. Keep descriptions concise.
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

    console.log("README AI analysis:");
    console.log(text);


    // Remove markdown code fences if the model adds them
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();


    // Find the JSON object inside the response
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

    console.error(
      "README analysis failed:"
    );

    console.error(error.message);

    return null;
  }
};


module.exports = {
  analyzeReadme
};