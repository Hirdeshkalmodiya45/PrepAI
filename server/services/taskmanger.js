const User = require("../models/user");
const Resume = require("../models/Resume");
const LeetcodeProgress = require("../models/LeetcodeProgress");
const InterviewAttempt = require("../models/interviewAttempt");
const { getRecentActivities } = require("./activityService");
const ResumeAnalysis = require("../models/ResumeAnalysis");
const { getTodayTasks,  completeDailyTask,}=require ("../tool/dailyTaskTools");
const buildTaskManagerPrompt = require("../prompts/taskManagePrompt");





async function getTaskData(userId){
const user = await User.findById(userId).select("name email");

const resumeAnalysis = await ResumeAnalysis.findOne({
  user: userId,
});

const leetcode = await LeetcodeProgress.findOne({
  user: userId,
});

const latestInterview = await InterviewAttempt.findOne({
  user: userId,
  completed: true,
}).sort({ createdAt: -1 });

const activities = await getRecentActivities(userId);

const todayTasks = await getTodayTasks(userId);
const prompt = buildTaskManagerPrompt({
  user,
  resumeAnalysis,
  leetcode,
  latestInterview,
  activities,
  todayTasks,
});

return prompt;


}
module.exports = {
    getTaskData
}
