const express = require('express');
const router = express.Router();


const userController= require("../controllers/userController");
const questionController= require("../controllers/questionController");
const answerController = require("../controllers/answerController")
const md=require("../middleware/common")


//------------- feature 1   User------------------------------------------------------

router.post('/register',userController.registerUser);
router.post("/login", userController.login)   
router.get("/user/:userId/profile",md.authMiddleware,userController.getUser)
router.put("/user/:userId/profile",md.authMiddleware,userController.updateDetails)

//------------- feature 2   question------------------------------------------------------

router.post('/question',md.authMiddleware,questionController.CreateQuestion);
router.get('/questions',questionController.getQuestions);
router.get('/questions/:questionId',questionController.getQuestionById);

router.put('/questions/:questionId',md.authMiddleware,questionController.updateQuestionById);
router.delete('/questions/:questionId',md.authMiddleware,questionController.deleteQuestionById);

//------------- feature 3   answer------------------------------------------------------

router.post('/answer',md.authMiddleware,answerController.createAnswer);
//router.get('questions/:questionId/answer',answerController.getAnswerById);
router.get('/answer/:answerId',answerController.getQuestionById);
router.put('/answer/:answerId',md.authMiddleware,answerController.updateAnswerById);
router.delete('/answer/:answerId',md.authMiddleware,answerController.deleteAnswerById);

// PUT /answer/:answerId
// DELETE answers/:answerId






module.exports = router;