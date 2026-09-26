require("dotenv").config();

const OpenAI = require("openai");

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY
});

async function testOpenRouter() {
  try {
    const response = await client.chat.completions.create({
      model: "openrouter/free",
      messages: [
        {
          role: "user",
          content: "Explain what a backend is in one simple sentence."
        }
      ]
    });

    console.log("OpenRouter response:");
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("OpenRouter error:");
    console.error(error.message);
  }
}

testOpenRouter();