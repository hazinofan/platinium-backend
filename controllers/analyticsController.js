const Visit = require("../models/Visit");
const ButtonClick = require("../models/ButtonClick");
const useragent = require("user-agent-parser");
const geoip = require("geoip-lite");
const Click = require("../models/Clicks");
const Scroll = require("../models/Scroll");

// Track user visits & time spent on page
const trackVisit = async (req, res) => {
  try {
    const { ip, userId, referrer, page, timeSpent } = req.body;
    const location = geoip.lookup(ip); // Get country, region, and city

    const visit = new Visit({
      ip,
      userId,
      location, // Save location data
      referrer,
      page,
      timeSpent,
      isReturning: await Visit.exists({ userId }) ? true : false,
    });

    await visit.save();
    res.status(200).json({ message: "Visit tracked successfully" });
  } catch (error) {
    console.error("Tracking error:", error);
    res.status(500).json({ message: "Error tracking visit" });
  }
};

// how many clients from one countrie
const getVisitorCountries = async (req, res) => {
  try {
    const countries = await Visit.aggregate([
      { $group: { _id: "$location.country", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json(countries);
  } catch (error) {
    console.error("Error fetching country analytics:", error);
    res.status(500).json({ message: "Error fetching country data" });
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

const trackClick = async (req, res) => {
  try {
    const { userId, page, x, y } = req.body;

    const click = new Click({ userId, page, x, y });
    await click.save();

    res.status(200).json({ message: "Click recorded" });
  } catch (error) {
    console.error("Click tracking error:", error);
    res.status(500).json({ message: "Error tracking click" });
  }
};

const trackScroll = async (req, res) => {
  try {
    const { userId, page, scrollPercentage } = req.body;

    const scroll = new Scroll({ userId, page, scrollPercentage });
    await scroll.save();

    res.status(200).json({ message: "Scroll depth recorded" });
  } catch (error) {
    console.error("Scroll tracking error:", error);
    res.status(500).json({ message: "Error tracking scroll depth" });
  }
};

const getTopReferrers = async (req, res) => {
  try {
    const referrers = await Visit.aggregate([
      { $group: { _id: "$referrer", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json(referrers);
  } catch (error) {
    console.error("Referral analytics error:", error);
    res.status(500).json({ message: "Error fetching referral data" });
  }
};



module.exports = { 
  trackVisit, 
  trackButtonClick, 
  getAnalytics, 
  getButtonClicks, 
  trackClick, 
  trackScroll, 
  getTopReferrers,
  getVisitorCountries  
};

