const express = require("express");

const router = express.Router();

const {
  analyzeProblem
} = require("../controllers/analysisController");
const {
  rateLimiter
} = require("../middlewares/rateLimiter");

router.post("/analysis", rateLimiter(), analyzeProblem);

module.exports = router;