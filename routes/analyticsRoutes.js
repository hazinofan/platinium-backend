const express = require("express");
const { 
  trackVisit, 
  trackButtonClick, 
  getAnalytics, 
  getButtonClicks, 
  trackClick, 
  trackScroll, 
  getTopReferrers,
  getVisitorCountries,
  getClicks,
  getScrollData,
  getDailyReport,
  getAllReports
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
router.get("/clicks", getClicks);
router.get("/scroll-data", getScrollData);
router.get("/daily-report", getDailyReport); // Generates and stores the report
router.get("/reports", getAllReports); // Fetch all stored reports


/* ---------------------- BUTTON CLICK TRACKING ---------------------- */

// Track specific button clicks
router.post("/button-click", trackButtonClick);
router.get("/button-clicks", getButtonClicks); // Changed "button-analytics" to "button-clicks" for consistency

module.exports = router;
