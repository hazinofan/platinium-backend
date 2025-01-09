const express = require("express");
const { trackVisit, trackButtonClick, getAnalytics, getButtonClicks } = require("../controllers/analyticsController");

const router = express.Router();

// Routes for tracking visits & time spent
router.post("/track", trackVisit);
router.get("/analytics", getAnalytics);

// Routes for tracking button clicks
router.post("/button-click", trackButtonClick);
router.get("/button-analytics", getButtonClicks);

module.exports = router;
