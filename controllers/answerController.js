const answerModel = require("../models/answerModel")
const questionModel = require("../models/questionModel")
const userModel = require("../models/userModel");
const validator = require('../utils/validator');


const createAnswer =async function(req,res){
   
    try {
        const userIdFromToken = req.userId    

        if (!validator.isValidRequestBody(req.body)) {
            return res.status(400).send({ status: false, message: 'Invalid request Parameters. Please provide User Details' })
        }
        let { userId,text,questionId} = req.body
        console.log(userId)
        // validation
        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: `Correct  userId is required` })
        }
        const user=await userModel.findById(userId)
        console.log(user)
        if(!user){
            return res.status(400).send({ status: false, message: `user is not present` })
        }
        if(!validator.isValid(text))
        {
            return res.atstus(400).send({status:false,message:"provide Answer"})
        }
        if (!validator.isValidObjectId(questionId)) {
            return res.status(400).send({ status: false, message: `Correct  questionId is required` })
        }

        const question= await questionModel.findOne({_id:questionId,isDeleted:false})
        if(!question){
            return res.status(400).send({ status: false, message: `Question is either deleted or not present` })
        }

        //authentication user
        if (userId !== userIdFromToken) {
            return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
        }
        // user can't answer his own answer  ----------------- { but user can give answer to his/her answer on qura}
        // if (userId === answer.askedBy) {
        //     return res.status(401).send({ status: false, message: `user can't answer his own answer` });
        // }

        const  answerData= { answeredBy:userId,text,questionId}
        const newanswer = await answerModel.create(answerData);
        return res.status(201).send({ status: true, message: `Answer is created successfully`, data: newanswer })

    } catch (e) {
        return res.status(500).send({ status: false, message: e.message })
    }

}

const getQuestionById = async function (req, res) {  //(public api) 
    try {
        const questionId = req.params.questionId
        
        if (!validator.isValidObjectId(questionId)) {
            return res.status(400).send({ status: false, message: `Correct ${questionId} questionId is required` })
        }
        const question= await questionModel.findOne({_id:questionId,isDeleted:false})
        if(!question){
            return res.status(400).send({ status: false, message: `Question is either deleted or not present` })
        }
        const answer =await answerModel.find({questionId:questionId,isDeleted:false})
        if(!answer){
            return res.status(400).send({ status: false, message: `answer is either deleted or not present` })
        }
        console.log(answer)//array
        const allAnswers = answer.map((a)=>a=a.text);
        console.log(allAnswers)//array
        const obj={
            question:question,
            answer:allAnswers
        }
        return res.status(200).send({status:true,meassage:"successfully featched data", data:obj})
    } catch (e) {
        return res.status(500).send({ status: false, message: e.message })
    }

}

/////might be chnage
// const getAnswerById = async function (req, res) {  //(public api) 
//     try {
//         const answerId = req.params.answerId
        
//         if (!validator.isValidObjectId(answerId)) {
//             return res.status(400).send({ status: false, message: `Correct ${answerId} answerId is required` })
//         }
        
//         const answer =await answerModel.find({_id:answerId})
//        console.log(answer)
//         if(!answer){//check for deleted one
//             return res.status(400).send({ status: false, message: `answer is either deleted or not present` })
//         }
//         console.log(answer[0].answerId)
//         const answer= await answerModel.findOne({_id:answer[0].answerId,isDeleted:false});
//         console.log(answer)//array
//         const allAnswers = answer.map((a)=>a=a.text);
//         console.log(allAnswers)//array
//         const obj={
//             answer:answer,
//             answer:allAnswers
//         }
//         return res.status(200).send({status:true,meassage:"successfully featched data", data:obj})
//     } catch (e) {
//         return res.status(500).send({ status: false, message: e.message })
//     }

// }
const updateAnswerById = async function (req, res) {  //(public api) 
    try {
        
        const answerId = req.params.answerId
        const userIdFromToken = req.userId  
        if (!validator.isValidRequestBody(req.body)) {
            return res.status(400).send({ status: false, message: 'Invalid request Parameters. Please provide User Details' })
        }
        let { text } = req.body

        if (!validator.isValidObjectId(answerId)) {
            return res.status(400).send({ status: false, message: `Correct ${answerId} answerId is required` })
        }
        const answer= await answerModel.findOne({_id:answerId,isDeleted:false})
        if(!answer){
            return res.status(400).send({ status: false, message: `answer is not present` })
        }
     
        if (answer.userId.toString() !== userIdFromToken) {
            return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
        }
        if(!validator.isValid(text))
        {
            return res.status(400).send({ status: false, message: `answer can't be empty` })
        }
    
            const updatedAnswer = await answerModel.findOneAndUpdate({_id: answerId},{text:text},{new : true}) 
        
        return res.status(201).send({status:true,meassage:"data updated successfully ", data:updatedAnswer})
    } catch (e) {
        return res.status(500).send({ status: false, message: e.message});
}
}

const deleteAnswerById = async function (req, res) {  //(public api) 
    try {
        const answerId = req.params.answerId
        const userIdFromToken = req.userId 
        if (!validator.isValidObjectId(answerId)) {
            return res.status(400).send({ status: false, message: `Correct ${answerId} answerId is required` })
        }
        const answer= await answerModel.findOne({_id:answerId,isDeleted:false})
        if(!answer){
            return res.status(400).send({status:false,message:`answer is either already deleted or not present`})
        }
        if (answer['answeredBy'].toString() !== userIdFromToken) {
            return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
        }
         const updatedAnswer = await answerModel.findOneAndUpdate({_id: answerId},{isDeleted:true},
        {new : true})

        return res.status(200).send({status:true,meassage:"answer is deleted successfully ", data:updatedAnswer})
    } catch (e) {
        return res.status(500).send({ status: false, message: e.message })
    }

}

module.exports=
{
    createAnswer,
   // getAnswerById,
   updateAnswerById,
   getQuestionById,
    deleteAnswerById

}

//---------------------------------- delete answer using DeleteOne ------------------------------------------------------
// const deleteAnswerById = async function (req, res) {  //(public api) 
//     try {
//         const answerId = req.params.answerId
//         const userIdFromToken = req.userId 
//         if (!validator.isValidObjectId(answerId)) {
//             return res.status(400).send({ status: false, message: `Correct ${answerId} answerId is required` })
//         }
//         const answer= await answerModel.findOne({_id:answerId})
//         if(!answer){
//             return res.status(400).send({status:false,message:`answer is either already deleted or not present`})
//         }
//         if (answer.userId.toString() !== userIdFromToken) {
//             return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
//         }
        
//         const updatedAnswer = await answerModel.deleteOne({_id: answerId},
//         {new : true});

//         return res.status(200).send({status:true,meassage:"Answer is deleted successfully ", data:updatedAnswer})
//     } catch (e) {
//         return res.status(500).send({ status: false, message: e.message })
//     }

// }
