const generalAgent = require("./generalAgent");
const dsaAgent = require("./dsaAgent");
 const resumeAgent = require("./resumAgent");
const taskManagerAgent=require("./taskAgent");
async function agentManager({ coach, userId, message }) {
  switch (coach) {
    case "general":
      return await generalAgent(userId, message);

    case "dsa":
      return await dsaAgent(userId, message);

   case "resume":
      return await resumeAgent(userId, message);

     case "task":

      return await taskManagerAgent(userId, message);

    default:
      throw new Error("Invalid coach");
  }
}

module.exports = agentManager;