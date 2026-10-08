require("dotenv").config();

const OpenAI = require("openai");

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY
});

const analyzeRelevance = async (
  problemStatement,
  mySolution,
  title,
  abstract
) => {

  const prompt = `
You are a relevance filter for InnoGap.

Your job is to decide whether a research paper is genuinely
related to the user's problem and proposed solution.

USER PROBLEM:
${problemStatement}

USER PROPOSED SOLUTION:
${mySolution}

RESEARCH PAPER TITLE:
${title}

RESEARCH PAPER ABSTRACT:
${abstract}

Return ONLY valid JSON.

Use exactly this structure:

{
  "relevant": true,
  "score": 0,
  "reason": ""
}

Rules:

1. "relevant" must be either true or false.

2. "score" must be a number from 0 to 100.

3. The paper should be considered relevant when it has
meaningful overlap with the user's actual problem,
objective, use case, or proposed solution.

4. Give more importance to:
- the real-world problem
- the target users or environment
- the objective
- the functionality
- the type of system being proposed

5. The proposed solution is important.
A paper should not be considered relevant just because
it uses similar technologies.

6. Technologies such as:
- AI
- machine learning
- IoT
- sensors
- computer vision
- deep learning

are NOT enough by themselves to make a paper relevant.

7. For example, if the user is solving room availability
using occupancy detection, a paper about plant detection
using computer vision is NOT relevant.

8. A paper about detecting room occupancy using sensors
is relevant even if it uses different technologies.

9. A paper about occupancy detection for energy management
may be related, but should only be considered relevant if
there is meaningful overlap with the user's actual problem
or proposed solution.

10. Do not judge patentability, ownership, or originality.

11. Do not invent information.

12. Keep the reason short and specific.
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

    console.log("Relevance AI response:");
    console.log(text);

    text = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error(
        "Relevance AI response does not contain valid JSON"
      );
    }

    const jsonText =
      text.substring(start, end + 1);

    return JSON.parse(jsonText);

  } catch (error) {

    console.error(
      "Relevance analysis failed:"
    );

    console.error(error.message);

    return {
      relevant: false,
      score: 0,
      reason: "Relevance analysis failed."
    };
  }
};

const analyzeRepositoryRelevance = async (
  problemStatement,
  mySolution,
  repoData = {}
) => {
  const {
    name = "",
    description = "",
    technologies = [],
    readmeExcerpt = ""
  } = repoData;

  const prompt = `
You are a relevance filter for InnoGap.

Your job is to decide whether an open-source GitHub repository is genuinely related to the student's problem and proposed solution.

STUDENT PROBLEM:
${problemStatement}

STUDENT PROPOSED SOLUTION:
${mySolution}

GITHUB REPOSITORY NAME:
${name}

GITHUB REPOSITORY DESCRIPTION:
${description}

DETECTED TECHNOLOGIES:
${Array.isArray(technologies) ? technologies.join(", ") : technologies}

README EXCERPT:
${readmeExcerpt}

Return ONLY valid JSON.

Use exactly this structure:

{
  "relevant": true,
  "score": 0,
  "reason": ""
}

Rules:
1. "relevant" must be true or false. Set relevant to true when score is 50 or higher.
2. "score" must be an integer from 0 to 100 representing the degree of functional and problem relevance.
3. Judge functional and problem alignment, NOT superficial keyword overlap.
4. Give high relevance (score 70-100) if the repository addresses the same core problem, builds a similar type of system, or solves a closely related challenge.
5. Give moderate relevance (score 50-69) if the repository addresses a related domain or provides key functional mechanisms applicable to the student's idea.
6. Give low relevance (score 0-49, relevant: false) if:
   - The repository merely shares generic tech buzzwords (e.g. IoT, AI, Python, React, sensors) but solves a completely unrelated problem.
   - For example: if the student is solving street light failure detection, a general IoT home automation switch or a computer-vision plant disease detector is NOT relevant.
7. Do not judge patentability or legal originality.
8. Keep the reason concise (1-2 sentences).
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

    text = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error(
        "Repository relevance AI response does not contain valid JSON"
      );
    }

    const jsonText = text.substring(start, end + 1);
    const parsed = JSON.parse(jsonText);

    const score = typeof parsed.score === "number" ? parsed.score : Number(parsed.score) || 0;
    const isRelevant = Boolean(parsed.relevant && score >= 50);

    return {
      relevant: isRelevant,
      score,
      reason: parsed.reason || "Relevance evaluated based on problem and solution alignment."
    };
  } catch (error) {
    console.error("Repository relevance analysis failed:");
    console.error(error.message);

    return {
      relevant: false,
      score: 0,
      reason: "Repository relevance analysis could not be completed."
    };
  }
};

module.exports = {
  analyzeRelevance,
  analyzeRepositoryRelevance
};
