const Visit = require("../models/Visit");
const ButtonClick = require("../models/ButtonClick");
const useragent = require("user-agent-parser");
const geoip = require("geoip-lite");

// Track user visits & time spent on page
const trackVisit = async (req, res) => {
  try {
    const { ip, referrer, page, timeSpent } = req.body;
    const location = geoip.lookup(ip);
    const userAgent = useragent(req.headers["user-agent"]);

    const visit = new Visit({ ip, location, userAgent, referrer, page, timeSpent });
    await visit.save();

    res.status(200).json({ message: "Visit tracked successfully" });
  } catch (error) {
    console.error("Tracking error:", error);
    res.status(500).json({ message: "Error tracking visit" });
  }
};

// Track button clicks
const trackButtonClick = async (req, res) => {
  try {
    const { buttonId } = req.body;

    let buttonClick = await ButtonClick.findOne({ buttonId, date: new Date().toISOString().slice(0, 10) });

    if (!buttonClick) {
      buttonClick = new ButtonClick({ buttonId, clicks: 1 });
    } else {
      buttonClick.clicks += 1;
    }

    await buttonClick.save();
    res.status(200).json({ message: "Button click recorded" });
  } catch (error) {
    console.error("Button click tracking error:", error);
    res.status(500).json({ message: "Error tracking button click" });
  }
};

// Get analytics data for visits
const getAnalytics = async (req, res) => {
  try {
    const visits = await Visit.find().sort({ timestamp: -1 });
    res.status(200).json(visits);
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Error fetching analytics" });
  }
};

// Get button click analytics
const getButtonClicks = async (req, res) => {
  try {
    const clicks = await ButtonClick.find().sort({ date: -1 });
    res.status(200).json(clicks);
  } catch (error) {
    console.error("Error fetching button click data:", error);
    res.status(500).json({ message: "Error fetching button click data" });
  }
};

module.exports = { trackVisit, trackButtonClick, getAnalytics, getButtonClicks };
