const DailyTask = require("../models/DailyTask");
const { logActivity } = require("../services/activityService");

async function getTodayTasks(userId) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return await DailyTask.find({
    user: userId,
    taskDate: {
      $gte: start,
      $lt: end,
    },
  })
    .sort({ createdAt: 1 })
    .lean();
}

async function createDailyTask(
  userId,
  title,
  description = "",
  type = "GENERAL"
) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const existingTask = await DailyTask.findOne({
    user: userId,
    title: title,
    taskDate: {
      $gte: start,
    },
  });

  if (existingTask) {
    return {
      success: false,
      message: "This task already exists today.",
      task: existingTask,
    };
  }

  const task = await DailyTask.create({
    user: userId,
    title,
    description,
    type,
    taskDate: new Date(),
  });

  return {
    success: true,
    task,
  };
}

async function completeDailyTask(userId, taskId) {
  const task = await DailyTask.findOneAndUpdate(
    {
      _id: taskId,
      user: userId,
      completed: false,
    },
    {
      completed: true,
    },
    {
      new: true,
    }
  );

  if (!task) {
    return {
      success: false,
      message: "Task not found or already completed.",
    };
  }

  await logActivity(
    userId,
    "DAILY_TASK_COMPLETE",
    "Daily Task Completed",
    task.title
  );

  return {
    success: true,
    task,
  };
}

async function deleteDailyTask(userId, taskId) {
  const task = await DailyTask.findOneAndDelete({
    _id: taskId,
    user: userId,
  });

  if (!task) {
    return {
      success: false,
      message: "Task not found.",
    };
  }

  return {
    success: true,
    message: "Task deleted successfully.",
    task,
  };
}

module.exports = {
  getTodayTasks,
  createDailyTask,
  completeDailyTask,
  deleteDailyTask,
};