const User = require("../models/user");
const Resume = require("../models/Resume");
const LeetcodeProgress = require("../models/LeetcodeProgress");
const InterviewAttempt = require("../models/interviewAttempt");
const { getRecentActivities } = require("./activityService");
const ResumeAnalysis = require("../models/ResumeAnalysis");
const DailyTask = require("../models/DailyTask");

async function getDashboardData(userId) {
  // User
  const user = await User.findById(userId).select("name email currentStreak lastActivityDate");

  // Resume
const resumeAnalysis = await ResumeAnalysis.findOne({
    user: userId,
});

  // DSA Progress
  const leetcode = await LeetcodeProgress.findOne({ user: userId });

  // Latest Completed Interview
  const latestInterview = await InterviewAttempt.findOne({
    user: userId,
    completed: true,
  }).sort({ createdAt: -1 });

  // Recent Activities
  const activities = await getRecentActivities(userId);

  // Resume Score
  const resumeScore = resumeAnalysis?.atsScore || 0;

  // DSA Score (0 - 40)
  const dsaScore = leetcode
    ? (leetcode.aiAnalysis?.readiness?.percent || 0) * 0.4
    : 0;

  // Interview Score (0 - 30)
  const interviewScore = latestInterview
    ? latestInterview.score * 0.3
    : 0;

  // Activity Score (0 - 10)
  const activityScore = Math.min(activities.length * 2, 10);
   //
const todayStart = new Date();
todayStart.setHours(0, 0, 0, 0);

const tomorrow = new Date(todayStart);
tomorrow.setDate(tomorrow.getDate() + 1);

const todayTasks = await DailyTask.find({
  user: userId,
  taskDate: {
    $gte: todayStart,
    $lt: tomorrow,
  },
})
.sort({ createdAt: 1 })
.lean();

const completedTasks = todayTasks.filter(
  task => task.completed
).length;

  const placementScore = Math.round(
    resumeScore +
    dsaScore +
    interviewScore +
    activityScore
  );
return {
  user: {
    name: user?.name || "User",
    email: user?.email || "",
  },

  placementScore,

  
  streak: user?.currentStreak || 0,

  resume: {
    uploaded: !!resumeAnalysis,
    atsScore: resumeAnalysis?.atsScore || 0,
  },

  dsa: {
    solved: leetcode?.totalSolved || 0,
    total: 500,
    easy: leetcode?.easySolved || 0,
    medium: leetcode?.mediumSolved || 0,
    hard: leetcode?.hardSolved || 0,
    ranking: leetcode?.ranking || 0,
  },

  mockInterview: {
    score: latestInterview?.score || 0,
    completed: latestInterview?.completed || false,
  },

  recentActivities: activities,

  recommendations: resumeAnalysis?.recommendations || [],
  todayTasks: todayTasks,

taskProgress: {
  completed: completedTasks,
  total: todayTasks.length,
},
};
}

module.exports = {
  getDashboardData,
};