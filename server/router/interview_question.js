const express= require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

const InterviewAttempt = require("../models/interviewAttempt"); 
const { generateInterviewQuestions } = require("../services/generateInterviewQuestions");
const InterviewQuestion = require("../models/interviewQuestion");
const { evaluateInterview } = require("../services/evaluateInterview");
const User = require("../models/user");
const { logActivity } = require("../services/activityService");
console.log(InterviewQuestion);
router.post("/start", authMiddleware, async (req, res) => {
    try {
        const{role, difficulty, totalQuestions} = req.body;
        const lastAttempt = await InterviewAttempt.findOne({
    user: req.user.userId,
    role,
    difficulty,
    completed: true,
}).sort({ setNumber: -1 });
// let nextSet = 1;

// if (lastAttempt) {
//     nextSet = lastAttempt.setNumber + 1;
// }

const nextSet = lastAttempt ? lastAttempt.setNumber + 1 : 1;


        const questionSet = await InterviewQuestion.findOne({
    role,
    difficulty,
    setNumber: nextSet
})
if (questionSet) {
    return res.json({
        success: true,
        data: questionSet,
    });
}
const questions = await generateInterviewQuestions({
    role,
    difficulty,
    totalQuestions,
});

console.log("Generated questions:", questions);
const newQuestionSet = await InterviewQuestion.create({
    role,
    difficulty,
    setNumber: nextSet,
    totalQuestions,
    questions,
});

return res.json({
    success: true,
    data: newQuestionSet,
})
    } catch (error) {
        console.error("Error starting interview:", error);
        res.status(500).json({
            success: false,
            message: "Failed to start interview",
        });
    }
})


router.post("/finish", authMiddleware, async (req, res) => {

    try {

        const {
            role,
            difficulty,
            setNumber,
            answers
        } = req.body;

        const result = await evaluateInterview({
            role,
            difficulty,
            answers
        });

        await InterviewAttempt.create({

            user: req.user.userId,

            role,

            difficulty,

            setNumber,

            answers,

            score: result.score,

            feedback: result.feedback,

            completed: true

        });

        res.json({

            success: true,

            score: result.score,

            feedback: result.feedback

        });
        await logActivity(
  userId,
  "MOCK_INTERVIEW",
  "Mock Interview Completed",
  role,
  {
    score: result.score,
    topic: "Node.js",
  }
);

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Interview evaluation failed"

        });

    }

});
module.exports = router;