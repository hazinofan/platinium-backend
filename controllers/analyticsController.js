const Visit = require("../models/Visit");
const ButtonClick = require("../models/ButtonClick");
const useragent = require("user-agent-parser");
const geoip = require("geoip-lite");
const Click = require("../models/Clicks");
const Scroll = require("../models/Scroll");
const iso3166 = require("iso-3166-1");

// Track user visits & time spent on page
const trackVisit = async (req, res) => {
  try {
    const { ip, userId, referrer, page } = req.body;
    const location = geoip.lookup(ip); // Get country, region, and city

    // Ignore self-referrals (users visiting from the same domain)
    if (referrer && referrer.includes("yourwebsite.com")) {
      return res.status(200).json({ message: "Self-referrals ignored" });
    }

    const visit = new Visit({
      ip,
      userId,
      location,
      referrer: referrer || "Direct", // Store "Direct" if no referrer
      page,
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
    const countriesPerDay = await Visit.aggregate([
      {
        $group: {
          _id: { date: { $substr: ["$timestamp", 0, 10] }, country: "$location.country" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.date": -1, count: -1 } } // Sort by most recent date and highest count
    ]);

    const totalCountries = await Visit.aggregate([
      {
        $group: {
          _id: "$location.country",
          totalCount: { $sum: 1 }
        }
      },
      { $sort: { totalCount: -1 } }
    ]);

    // Convert country codes to full names
    const convertCountry = (code) => {
      const country = iso3166.whereAlpha2(code);
      return country ? country.country : code; // Return full name or original code if not found
    };

    const formattedCountriesPerDay = countriesPerDay.map(entry => ({
      _id: { date: entry._id.date, country: convertCountry(entry._id.country) },
      count: entry.count
    }));

    const formattedTotalCountries = totalCountries.map(entry => ({
      _id: convertCountry(entry._id),
      totalCount: entry.totalCount
    }));

    res.status(200).json({ countriesPerDay: formattedCountriesPerDay, totalCountries: formattedTotalCountries });
  } catch (error) {
    console.error("Error fetching visitor country analytics:", error);
    res.status(500).json({ message: "Error fetching visitor country data" });
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
    const { userId, page, x, y, buttonName } = req.body;

    // Prevent tracking clicks on admin pages
    if (page === "/admin/login" || page === "/admin/dashboard") {
      return res.status(200).json({ message: "Clicks on this page are not tracked" });
    }

    const click = new Click({ userId, page, x, y, buttonName });
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
      { $limit: 5 } // Get only top 5 referrers
    ]);

    res.status(200).json(referrers);
  } catch (error) {
    console.error("Referral analytics error:", error);
    res.status(500).json({ message: "Error fetching referral data" });
  }
};


const getClicks = async (req, res) => {
  try {
    const clicksPerDay = await Click.aggregate([
      {
        $group: {
          _id: { date: { $substr: ["$timestamp", 0, 10] }, page: "$page" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.date": -1, count: -1 } } // Sort by date (most recent first) and count
    ]);

    const totalClicks = await Click.aggregate([
      {
        $group: {
          _id: "$page",
          totalCount: { $sum: 1 }
        }
      },
      { $sort: { totalCount: -1 } }
    ]);

    res.status(200).json({ clicksPerDay, totalClicks });
  } catch (error) {
    console.error("Error fetching click data:", error);
    res.status(500).json({ message: "Error fetching click data" });
  }
};


const getScrollData = async (req, res) => {
  try {
    const scrolls = await Scroll.find().sort({ timestamp: -1 });
    res.status(200).json(scrolls);
  } catch (error) {
    console.error("Scroll data fetching error:", error);
    res.status(500).json({ message: "Error fetching scroll data" });
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
  getVisitorCountries,
  getClicks,
  getScrollData
};

