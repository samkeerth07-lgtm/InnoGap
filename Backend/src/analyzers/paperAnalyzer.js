require("dotenv").config();

const OpenAI = require("openai");

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY
});

const analyzePaper = async (
  title,
  abstractText,
  metadata = {}
) => {
  const paperContext = JSON.stringify({
    title: title || "",
    abstract: abstractText || "",
    metadata: metadata || {}
  }, null, 2);

  const prompt = `
You are analyzing a research paper for InnoGap.

Your job is to understand the technical problem, the research approach,
its method or solution, and the capabilities it provides.

Do NOT determine legal novelty, patentability, or ownership.
Only analyze technical and functional similarity.

Paper information:
${paperContext}

Return ONLY valid JSON.

Use exactly this structure:

{
  "problem": "",
  "solution": "",
  "technologies": [],
  "capabilities": [],
  "whatItDoes": []
}

Rules:
1. Identify the problem addressed by the research.
2. Explain the proposed solution, method, model, system, or technical approach.
3. Extract technologies/algorithms/models only when supported by the available paper information.
4. Extract important capabilities.
5. Generate 3 to 6 concrete "whatItDoes" actions.
6. Do not invent information.
7. Do not claim the research is original.
8. Do not determine patentability or legal novelty.
9. Keep the response concise.
10. Return ONLY JSON.
11. No markdown.
12. No code fences.
13. No text before or after the JSON.
`;

  try {
    const response = await client.chat.completions.create({
      model: "openrouter/free",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    let text = response.choices[0].message.content;

    console.log("Paper AI analysis:");
    console.log(text);

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("Paper AI response does not contain valid JSON");
    }

    const jsonText = text.substring(start, end + 1);

    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Paper analysis failed:");
    console.error(error.message);

    return {
      problem: "",
      solution: "",
      technologies: [],
      capabilities: [],
      whatItDoes: []
    };
  }
};

module.exports = {
  analyzePaper
};
