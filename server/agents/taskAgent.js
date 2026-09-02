const { invokeLLM } = require("../services/groqService");
const { getTaskData } = require("../services/taskmanger");

const {
  getTodayTasks,
  createDailyTask,
  completeDailyTask,
} = require("../tool/dailyTaskTools");

const {
  getOrCreateConversation,
  getHistory,
  saveMessage,
} = require("../memory/memoryManager");


async function taskManagerAgent(userId, message) {
  try {

    // =========================
    // USER CONTEXT + TASKS
    // =========================

    const prompt = await getTaskData(userId);

    const conversation = await getOrCreateConversation(
      userId,
      "task"
    );

    // =========================
    // CONVERSATION HISTORY
    // =========================

    const history = await getHistory(conversation._id);

    const messages = [
      {
        role: "system",
        content: prompt,
      },

      ...history.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),

      {
        role: "user",
        content: message,
      },
    ];

    // =========================
    // AI
    // =========================

    const aiResponse = await invokeLLM(messages);

    const cleanResponse = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const action = JSON.parse(cleanResponse);

    console.log("AI Action:", action);

    // Save user message
    await saveMessage(
      conversation._id,
      "user",
      message
    );


    // =========================
    // GET TODAY TASKS
    // =========================

   if (action.action === "GET_TODAY_TASKS") {

  const tasks = await getTodayTasks(userId);

  let reply;

  if (tasks.length === 0) {
    reply = "You don't have any tasks for today.";
  } else {
    reply =
      "Here are your tasks for today:\n\n" +
      tasks
        .map(
          (task, index) =>
            `${index + 1}. ${task.title}${
              task.completed ? " ✅" : " ⏳"
            }`
        )
        .join("\n");
  }

  await saveMessage(
    conversation._id,
    "assistant",
    reply
  );

  return reply; // ⭐ string
}

    // =========================
    // CREATE TASKS
    // =========================

    if (action.action === "CREATE_TASKS") {

  const createdTasks = [];

  for (const task of action.tasks || []) {

    const result = await createDailyTask(
      userId,
      task.title,
      task.description,
      task.type
    );

    if (result.success) {
      createdTasks.push(result.task);
    }
  }

  const reply =
    createdTasks.length > 0
      ? `Created ${createdTasks.length} task(s) successfully.`
      : "No new tasks were created.";

  await saveMessage(
    conversation._id,
    "assistant",
    reply
  );

  return reply;
}

  

    // =========================
    // COMPLETE TASK
    // =========================

    if (action.action === "COMPLETE_TASK") {

  const result = await completeDailyTask(
    userId,
    action.taskId
  );

  const reply = result.success
    ? `Task "${result.task.title}" completed successfully. 🔥`
    : result.message;

  await saveMessage(
    conversation._id,
    "assistant",
    reply
  );

  return reply;
}

    // =========================
    // NONE
    // =========================

    const reply =
      action.message || "No action required.";

    await saveMessage(
      conversation._id,
      "assistant",
      reply
    );

    return {
      message: reply,
    };

  } catch (error) {

    console.error(
      "Task Manager Agent Error:",
      error
    );

    throw error;
  }
}


module.exports = taskManagerAgent;