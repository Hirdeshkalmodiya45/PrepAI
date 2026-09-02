const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const User = require("../models/user");
const { fetchLeetcodeData } = require("../services/leetcode.service.js");
const LeetcodeProgress = require("../models/LeetcodeProgress");
const { analyzeDSA } = require("../services/aiservice");




router.post("/sync", authMiddleware, async(req,res)=>{
      try {
        console.log("Syncing Leetcode progress for user:",req.user.userId );
    const user = await User.findById(req.user.userId);
       if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const leetcodeData = await fetchLeetcodeData(user.leetcodeUsername);
    const stats = leetcodeData.data.matchedUser.submitStats.acSubmissionNum;
    const totalSolved = stats.find(
    item => item.difficulty === "All"
).count;
const easySolved = stats.find(
    item => item.difficulty === "Easy"
).count;
const mediumSolved = stats.find(
    item => item.difficulty === "Medium"
).count;
const hardSolved = stats.find(
    item => item.difficulty === "Hard"
).count;
const ranking = leetcodeData.data.matchedUser.profile.ranking;
 
const aiAnalysis = await analyzeDSA({
    username: user.leetcodeUsername,
    totalSolved,
    easySolved,
    mediumSolved,
    hardSolved,
    ranking,
});

    await LeetcodeProgress.findOneAndUpdate(
    { user: user._id },

    {
        totalSolved,
        easySolved,
        mediumSolved,
        hardSolved,
        ranking,
           
        lastSynced: new Date(),
        aiAnalysis: aiAnalysis
    },

    {
        upsert: true,
        new: true
    }
);


  return res.status(200).json({
    success:true,
    username:user.leetcodeUsername,

    totalSolved,
    easySolved,
    mediumSolved,
    hardSolved,
    aiAnalysis,
    ranking
});

}
catch (error) { 
    console.error("Error occurred while syncing Leetcode progress:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
}

})
router.get("/profile",authMiddleware, async(req,res)=>{
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
  
const progress = await LeetcodeProgress.findOne({ user: user._id });

return res.json({
    success: true,
    data: {
        username: user.leetcodeUsername,
        ranking: progress.ranking,
        totalSolved: progress.totalSolved,
        easySolved: progress.easySolved,
        mediumSolved: progress.mediumSolved,
        hardSolved: progress.hardSolved,
        aiAnalysis: progress.aiAnalysis,
        lastSynced: progress.lastSynced
    }
});
        console.log("Fetched Leetcode profile for user:", leetcodeData.data);
    } catch (error) {
        console.error("Error occurred while fetching Leetcode profile:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
module.exports = router;
