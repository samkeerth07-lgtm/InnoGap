/**
 * Analysis Controller
 * Gateway handler that validates incoming requests and forwards
 * AI analysis to the Python FastAPI backend service.
 */

const getFastApiBaseUrl = () => {
  return (
    process.env.FASTAPI_BASE_URL ||
    process.env.AI_SERVICE_URL ||
    "http://127.0.0.1:8000"
  ).replace(/\/+$/, "");
};

const getFastApiTimeout = () => {
  return parseInt(process.env.FASTAPI_TIMEOUT_MS || "120000", 10);
};

const analyzeProblem = async (req, res) => {
  try {
    const { ProblemStatement, MySolution } = req.body || {};

    // 1. Validate user input
    if (!ProblemStatement || typeof ProblemStatement !== "string" || !ProblemStatement.trim()) {
      return res.status(400).json({
        error: "ProblemStatement is required"
      });
    }

    const payload = {
      ProblemStatement: ProblemStatement.trim(),
      MySolution: typeof MySolution === "string" ? MySolution.trim() : ""
    };

    const fastApiBaseUrl = getFastApiBaseUrl();
    const timeoutMs = getFastApiTimeout();
    const targetUrl = `${fastApiBaseUrl}/api/analysis`;

    let response;
    try {
      response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(timeoutMs)
      });
    } catch (fetchError) {
      if (fetchError.name === "TimeoutError") {
        console.error(`AI service timeout after ${timeoutMs}ms`);
        return res.status(504).json({
          error: "Gateway Timeout",
          message: "The AI analysis service timed out. Please try again."
        });
      }

      console.error("Failed to connect to FastAPI AI backend:", fetchError.message);
      return res.status(502).json({
        error: "Bad Gateway",
        message: "Unable to connect to the AI analysis service. Please ensure the FastAPI backend is running."
      });
    }

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: await response.text() };
      }

      console.error(`FastAPI returned HTTP ${response.status}:`, errorData);
      return res.status(response.status).json({
        error: "AI analysis failed",
        message: errorData?.detail || errorData?.message || "An error occurred during AI analysis"
      });
    }

    let result;
    try {
      result = await response.json();
    } catch (parseError) {
      console.error("Failed to parse response from FastAPI:", parseError.message);
      return res.status(502).json({
        error: "Bad Gateway",
        message: "Received invalid JSON from the AI analysis service."
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Unexpected error in analysis controller:", error.message);
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message
    });
  }
};

module.exports = {
  analyzeProblem,
  getFastApiBaseUrl,
  getFastApiTimeout
};