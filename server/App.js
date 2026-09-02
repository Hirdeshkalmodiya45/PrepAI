const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || "8000";
app.use(cors());
app.use(express.json());

const loginRouter = require("./router/login");
const signupRouter = require("./router/signup");
const leetcodeRouter = require("./router/leetcode");
const dsaAiAnalysisRouter = require("./router/dsa_Ai_analysis");
const interviewQuestionRouter = require("./router/interview_question");
const ai_coach=require("./router/ai_coach");
const dashboardRoutes = require("./router/dasboard");
console.log("Dashboard routes:", dashboardRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/coach",ai_coach);


app.use("/api/interview", interviewQuestionRouter);

app.use("/api/leetcode", leetcodeRouter);
app.use("/api/dsa", dsaAiAnalysisRouter);

app.use("/api/auth", loginRouter);
app.use("/api/auth", signupRouter);

let dbUrl = process.env.MOONGO_DB_URL || "localhost:27017/genaiproject";
if (!dbUrl.startsWith("mongodb://") && !dbUrl.startsWith("mongodb+srv://")) {
  dbUrl = "mongodb://" + dbUrl;
}

mongoose.connect(dbUrl)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
