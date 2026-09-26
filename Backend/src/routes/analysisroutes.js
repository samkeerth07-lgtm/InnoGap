const express = require("express");

const router = express.Router();

const {
  analyzeProblem
} = require("../controllers/analysisController");

router.post("/analysis", analyzeProblem);

module.exports = router;