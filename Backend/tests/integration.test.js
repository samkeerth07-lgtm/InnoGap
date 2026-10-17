const { test, describe, before, after } = require("node:test");
const assert = require("node:assert");
const http = require("node:http");
const app = require("../src/app");

describe("InnoGap Backend Integration Tests", () => {
  let server;
  let backendPort;
  let mockFastApiServer;
  let mockFastApiPort;
  let lastMockFastApiRequest = null;
  let mockFastApiResponseStatus = 200;
  let mockFastApiResponseBody = {};
  let mockFastApiDelayMs = 0;

  before(async () => {
    // 1. Start mock FastAPI server
    mockFastApiServer = http.createServer(async (req, res) => {
      let body = "";
      for await (const chunk of req) {
        body += chunk;
      }
      lastMockFastApiRequest = {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: body ? JSON.parse(body) : null
      };

      if (mockFastApiDelayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, mockFastApiDelayMs));
      }

      res.writeHead(mockFastApiResponseStatus, { "Content-Type": "application/json" });
      res.end(JSON.stringify(mockFastApiResponseBody));
    });

    await new Promise((resolve) => mockFastApiServer.listen(0, "127.0.0.1", resolve));
    mockFastApiPort = mockFastApiServer.address().port;
    process.env.FASTAPI_BASE_URL = `http://127.0.0.1:${mockFastApiPort}`;
    process.env.FASTAPI_TIMEOUT_MS = "2000";

    // 2. Start Express app server
    await new Promise((resolve) => {
      server = app.listen(0, "127.0.0.1", () => {
        backendPort = server.address().port;
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise((resolve) => server.close(resolve));
    await new Promise((resolve) => mockFastApiServer.close(resolve));
  });

  test("GET /api/health returns 200 with expected health message", async () => {
    const res = await fetch(`http://127.0.0.1:${backendPort}/api/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.message, "InnoGap backend is working");
  });

  test("POST /api/analysis returns 400 when ProblemStatement is missing", async () => {
    const res = await fetch(`http://127.0.0.1:${backendPort}/api/analysis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ MySolution: "Only solution provided" })
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.error, "ProblemStatement is required");
  });

  test("POST /api/analysis forwards valid request to FastAPI and returns result", async () => {
    mockFastApiResponseStatus = 200;
    mockFastApiResponseBody = {
      status: "Analysis Complete",
      title: "Smart Street Light Optimization",
      description: "Analysis description",
      overallResult: "Partially Existing",
      overallResultNote: "Found similar solutions in the market.",
      proposed: "Solar-powered mesh sensors",
      existingTech: ["IoT", "LoRaWAN"],
      potentialGap: "Low cost mesh networking for rural roads",
      summary: "Comparison summary",
      similarSolutions: [
        {
          id: "github-123",
          name: "smart-light",
          type: "Open Source Project"
        }
      ],
      verification: {
        passed: true,
        checks: ["Checks completed"],
        confidence: 1.0,
        evidence: [],
        warnings: []
      }
    };

    const res = await fetch(`http://127.0.0.1:${backendPort}/api/analysis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ProblemStatement: "Smart Street Light Optimization",
        MySolution: "Solar-powered mesh sensors"
      })
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();

    // Verify forwarded payload to mock FastAPI
    assert.strictEqual(lastMockFastApiRequest.method, "POST");
    assert.strictEqual(lastMockFastApiRequest.url, "/api/analysis");
    assert.strictEqual(lastMockFastApiRequest.body.ProblemStatement, "Smart Street Light Optimization");
    assert.strictEqual(lastMockFastApiRequest.body.MySolution, "Solar-powered mesh sensors");

    // Verify response returned to caller
    assert.strictEqual(data.title, "Smart Street Light Optimization");
    assert.strictEqual(data.overallResult, "Partially Existing");
    assert.strictEqual(data.verification.passed, true);
    assert.strictEqual(data.similarSolutions.length, 1);
  });

  test("POST /api/analysis handles FastAPI errors gracefully (500 from upstream)", async () => {
    mockFastApiResponseStatus = 500;
    mockFastApiResponseBody = {
      error: "Analysis failed",
      message: "OpenRouter rate limit reached"
    };

    const res = await fetch(`http://127.0.0.1:${backendPort}/api/analysis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ProblemStatement: "Smart Street Light Optimization",
        MySolution: "Solar-powered mesh sensors"
      })
    });

    assert.strictEqual(res.status, 500);
    const data = await res.json();
    assert.strictEqual(data.error, "AI analysis failed");
    assert.strictEqual(data.message, "OpenRouter rate limit reached");
  });

  test("POST /api/analysis handles FastAPI timeout gracefully (504 Gateway Timeout)", async () => {
    process.env.FASTAPI_TIMEOUT_MS = "100";
    mockFastApiDelayMs = 300;
    mockFastApiResponseStatus = 200;
    mockFastApiResponseBody = { status: "Done" };

    const res = await fetch(`http://127.0.0.1:${backendPort}/api/analysis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ProblemStatement: "Timeout test",
        MySolution: "Timeout test solution"
      })
    });

    // Reset delay and timeout
    mockFastApiDelayMs = 0;
    process.env.FASTAPI_TIMEOUT_MS = "2000";

    assert.strictEqual(res.status, 504);
    const data = await res.json();
    assert.strictEqual(data.error, "Gateway Timeout");
  });

  test("POST /api/analysis returns 502 when FastAPI service is unreachable", async () => {
    // Point to an unused local port
    process.env.FASTAPI_BASE_URL = "http://127.0.0.1:59999";

    const res = await fetch(`http://127.0.0.1:${backendPort}/api/analysis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ProblemStatement: "Unreachable test",
        MySolution: "Solution"
      })
    });

    // Restore URL
    process.env.FASTAPI_BASE_URL = `http://127.0.0.1:${mockFastApiPort}`;

    assert.strictEqual(res.status, 502);
    const data = await res.json();
    assert.strictEqual(data.error, "Bad Gateway");
  });

  test("Rate limiter enforces request limits and returns 429", async () => {
    const { rateLimiter } = require("../src/middlewares/rateLimiter");
    const express = require("express");
    const testApp = express();
    testApp.use(express.json());
    testApp.use(rateLimiter({ max: 2, windowMs: 1000 }));
    testApp.get("/test-limit", (req, res) => res.json({ ok: true }));

    const testServer = await new Promise((resolve) => {
      const s = testApp.listen(0, "127.0.0.1", () => resolve(s));
    });
    const port = testServer.address().port;

    const res1 = await fetch(`http://127.0.0.1:${port}/test-limit`);
    assert.strictEqual(res1.status, 200);

    const res2 = await fetch(`http://127.0.0.1:${port}/test-limit`);
    assert.strictEqual(res2.status, 200);

    const res3 = await fetch(`http://127.0.0.1:${port}/test-limit`);
    assert.strictEqual(res3.status, 429);
    const data3 = await res3.json();
    assert.strictEqual(data3.error, "Too Many Requests");

    await new Promise((resolve) => testServer.close(resolve));
  });
});
