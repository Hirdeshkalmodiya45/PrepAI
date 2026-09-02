const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const dashboardService = require("../services/dashboardService");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const data = await dashboardService.getDashboardData(
      req.user.userId
    );

    res.status(200).json(data);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Dashboard loading failed",
    });
  }
});

module.exports = router;