const express = require("express");

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());

const analysisRoutes = require("./routes/analysisroutes");

app.use("/api", analysisRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    message: "InnoGap backend is working"
  });
});

module.exports = app;