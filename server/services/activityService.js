const Activity = require("../models/Activity");
const User = require("../models/user");

async function logActivity(
  userId,
  type,
  title,
  description = "",
  metadata = {}
) {
  try {
    const activity = await Activity.create({
      userId,
      type,
      title,
      description,
      metadata,
    });
       
    const user = await User.findById(userId);

    if (user) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (!user.lastActivityDate) {
        user.currentStreak = 1;
      } else {
        const lastActivity = new Date(user.lastActivityDate);
        lastActivity.setHours(0, 0, 0, 0);

        const diff =
          (today - lastActivity) / (1000 * 60 * 60 * 24);

        if (diff === 0) {
          // Same day → streak same rahegi
        } else if (diff === 1) {
          // Consecutive day → +1
          user.currentStreak += 1;
        } else {
          // Gap aa gaya → streak reset
          user.currentStreak = 1;
        }
      }

      user.lastActivityDate = new Date();

      await user.save();
    }
    return activity;
  } catch (error) {
    console.error("Activity logging error:", error.message);
    return null;
  }
}

async function getRecentActivities(userId, limit = 5) {
  return await Activity.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}

module.exports = {
  logActivity,
  getRecentActivities,
};