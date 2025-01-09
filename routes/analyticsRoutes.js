const express = require("express");
const { 
  trackVisit, 
  trackButtonClick, 
  getAnalytics, 
  getButtonClicks, 
  trackClick, 
  trackScroll, 
  getTopReferrers,
  getVisitorCountries
} = require("../controllers/analyticsController");

const router = express.Router();

/* ---------------------- USER ACTIVITY TRACKING ---------------------- */

// Track website visits & time spent
router.post("/track", trackVisit);
router.get("/analytics", getAnalytics);

// Track user interactions (heatmaps, scrolls, shares)
router.post("/click", trackClick);      // Track clicks (heatmap data)
router.post("/scroll", trackScroll);    // Track scroll depth
router.get("/referrers", getTopReferrers); // Track referral sources
router.get("/visitor-countries", getVisitorCountries);

/* ---------------------- BUTTON CLICK TRACKING ---------------------- */

// Track specific button clicks
router.post("/button-click", trackButtonClick);
router.get("/button-clicks", getButtonClicks); // Changed "button-analytics" to "button-clicks" for consistency

module.exports = router;
