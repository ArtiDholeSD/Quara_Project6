const express = require('express');
const router = express.Router();


const userController= require("../controllers/userController");
const md=require("../middleware/common")


//------------- feature 1   User------------------------------------------------------

router.post('/register',userController.registerUser);
router.post("/login", userController.login)   
router.get("/user/:userId/profile",md.authMiddleware,userController.getUser)
router.put("/user/:userId/profile",md.authMiddleware,userController.updateDetails)

//------------- feature 2   question------------------------------------------------------












module.exports = router;