
const answerModel = require("../models/answerModel");
const questionModel = require("../models/questionModel")
const userModel = require("../models/userModel");
const validator = require('../utils/validator');


const CreateQuestion = async function (req, res) {
    try {
        const userIdFromToken = req.userId

        if (!validator.isValidRequestBody(req.body)) {
            return res.status(400).send({ status: false, message: 'Invalid request Parameters. Please provide User Details' })
        }
        let { description, tags, askedBy,  isDeleted } = req.body
        // validation
        if (!validator.isValid(description)) {
            return res.status(400).send({ status: false, message: `${description} is required` })
        }
        if (!validator.isArray(tags)) { // given as not required
            return res.status(400).send({ status: false, message: `${tags} are required` })
        }
        if (!validator.isValidObjectId(askedBy)) {
            return res.status(400).send({ status: false, message: `Correct ${askedBy} userId is required` })
        }
        if (isDeleted==true) {
            return res.status(400).send({ status: false, message: `isDeleted can't be true at the time of creation` })
        }
        const user=await userModel.findById(askedBy)
        console.log(user)
        if(!user){
            return res.status(400).send({ status: false, message: `user is not present` })
        }
        //console.log(typeof askedBy)--str
       // console.log(typeof askedBy.toString())---str
       // console.log(typeof userIdFromToken)---str
        if (askedBy !== userIdFromToken) {
            return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
        }

        questionData= { description, tags, askedBy, isDeleted }
        const newQuestion = await questionModel.create(questionData);
        return res.status(201).send({ status: true, message: `Question created successfully`, data: newQuestion })

    } catch (e) {
        return res.status(500).send({ status: false, message: e.message })
    }

}
/*
GET /questions (public api) 
Returns all questions in the collection that aren't deleted. Each question should contain all the answers, if available, for it.

A guest user, a user that isnt' logged in, should be able to fetch all teh questions

You should be able to filter the result if the a query parameter like tag=adventure is present in the request. Also, the result should be sorted by the createdAt field if a sorting query parameter is present. The example for sort order query param is sort=descending. Please note that filter and sort field are optional. And either of these or they could both be passed in the request.

*/

const getQuestions = async function (req, res) {  //(public api) 
    try {
          const searchFilter={ isDeleted:false } //store all filters
          const queryParams=req.query;

          if(!validator.isValidRequestBody(queryParams)){
                    
          const {tag,createdAt,sort,questionId,description}=queryParams;
        
          //valiadting tags
          if(validator.isArray(tag)){
            searchFilter['tags']=tag
          }
          if(validator.isValid(description)){

            searchFilter['description']={}
            searchFilter['description']['$regex'] = description
            searchFilter['description']['$options'] = 'i'
         }

          if(validator.isValidObjectId(questionId))
          {
              searchFilter['_id']=questionId
          }
          if(createdAt){
          if((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(createdAt))) {
             
            searchFilter['createdAt']=createdAt

           }else{
            return res.status(400).send({status: false, message: `Date  should be in YYYY-MM-DD format ex.2022-01-06`})
           }
        }

        //    if (validator.isValid(sort)) {

        //     if (!((sort == 1) || (sort == -1))) {
        //         return res.status(400).send({ status: false, message: `priceSort should be 1 or -1 ` })
        //     }

           

          }
    let getQuestion = await questionModel.find(searchFilter)
    console.log(getQuestion)
    let arr = []
    
    let answers = []
    for(let i=0; i<getQuestion.length; i++){
        let getQuestionId = getQuestion[i]._id
        // console.log(getQuestionId)
        let getAnswer = await answerModel.find({questionId: getQuestionId,isDeleted:false}) //getting all answers for id(0),id(1),.....so on
        answers= getAnswer.map(element => element.text)  //featching textfields from answers for id(0),id(1),.....so on
        
        if(answers.length !== 0){ 
            arr.push(getQuestion[i])
            arr.push(answers)
        }
        // console.log(answers)
    }
   // console.log(arr)
    
       //  const allQuestion = await questionModel.find()
      // const allQuestion = await arr.find(searchFilter)
        return res.status(200).send({status:true,meassage:"successfully featched data", data:arr})
        
    } catch (e) {
        return res.status(500).send({ status: false, message: e.message })
    }

}

// let getQuestions = async function(req, res){

//     let getQuestion = await questionModel.find({isDeleted: false})
//     console.log(getQuestion)
//     let arr = []
    
//     let answers = []
//     for(let i=0; i<getQuestion.length; i++){
//         let getQuestionId = getQuestion[i]._id
//         // console.log(getQuestionId)
//         let getAnswer = await answerModel.find({questionId: getQuestionId,isDeleted:false}) //getting all answers for id(0),id(1),.....so on
//         answers= getAnswer.map(element => element.text)  //featching textfields from answers for id(0),id(1),.....so on
        
//         if(answers.length !== 0){ 
//             arr.push(getQuestion[i])
//             arr.push(answers)
//         }
//         // console.log(answers)
//     }
//     console.log(arr)
    
//     res.status(200).send({status: true, data: arr})
    
// }

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
        const answer =await answerModel.find({questionId:questionId})
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
const updateQuestionById = async function (req, res) {  //(public api) 
    try {
        
        const questionId = req.params.questionId
        const userIdFromToken = req.userId  
        if (!validator.isValidRequestBody(req.body)) {
            return res.status(400).send({ status: false, message: 'Invalid request Parameters. Please provide User Details' })
        }
        let { description, tags } = req.body

        if (!validator.isValidObjectId(questionId)) {
            return res.status(400).send({ status: false, message: `Correct ${questionId} questionId is required` })
        }
        const question= await questionModel.findOne({_id:questionId,isDeleted:false})
        if(!question){
            return res.status(400).send({ status: false, message: `Question is either deleted or not present` })
        }
        //console.log(question.askedBy)
        //console.log(typeof question.askedBy.toString())
        if (question.askedBy.toString() !== userIdFromToken) {
            return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
        }
        if(!validator.isValid(description))
        {
            return res.status(400).send({ status: false, message: `Question can't be empty` })
        }
        if(!validator.isArray(tags))
        {
            return res.status(400).send({ status: false, message: `please provide valid set of strings` })
        }

        let obj={
            description:description,
            tags:tags
        }
      
         //console.log(obj)
           const updatedQuestion = await questionModel.findOneAndUpdate({_id: questionId},obj,{new : true}) 
           console.log(updatedQuestion)
        return res.status(200).send({status:true,meassage:"successfully featched data", data:updatedQuestion})
    } catch (e) {
        return res.status(500).send({ status: false, message: e.message })
    }
}

const deleteQuestionById = async function (req, res) {  //(public api) 
    try {
        const questionId = req.params.questionId
        const userIdFromToken = req.userId 
        if (!validator.isValidObjectId(questionId)) {
            return res.status(400).send({ status: false, message: `Correct ${questionId} questionId is required` })
        }
        const question= await questionModel.findOne({_id:questionId,isDeleted:false})
        if(!question){
            return res.status(400).send({status:false,message:`Question is either already deleted or not present`})
        }
        if (question.askedBy.toString() !== userIdFromToken) {
            return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
        }
        
        // let obj={
        //    isDeleted:true,
        //    deletedAt:new Date()
        // }
        // const updatedQuestion = await questionModel.findOneAndUpdate({_id: questionId},obj,{new : true}) 
       
        const updatedQuestion = await questionModel.findOneAndUpdate({_id: questionId},{isDeleted:true,deletedAt:new Date()},
        {new : true})

        return res.status(200).send({status:true,meassage:"Question is deleted successfully ", data:updatedQuestion})
    } catch (e) {
        return res.status(500).send({ status: false, message: e.message })
    }

}








module.exports=
{
    CreateQuestion,
    getQuestions,
    getQuestionById,
    updateQuestionById,
    deleteQuestionById
}












// const question= await questionModel.find({isDeleted:false})
//         const answer =await answerModel.find()
//         //console.log(question)
//         //console.log(answer)

//         let ab=[];
//         for(let i=0;i<=question.length;i++)
//         {  
           
//             for(let j=0;j<=answer.length;j++)
//             {

//                if(question[i]._id===answer[j].questionId)
                
//                 ab.push(question[i]._id)



//                 // console.log(question[i]._id)
//                 // console.log(answer[j].questionId)
                
               
//                // console.log(answer[j].text)
//                // ab.push(question[i]._id)
//                 // console.log(question[i]._id)
//             }
           
//            }
//         //    console.log(ab)
//             //ab.push(question[i].description)
//             //console.log(question[i].description)
//         // const  allQuestion = question.map((a)=>a=a._id);
//         // console.log(allQuestion)
          
//         // const allAnswers = answer.map((a)=>a=a.questionId);
//         // console.log(allAnswers) 
   
//         // const allAnswers = answer.map((a)=>a=a.text);
//         // console.log(allAnswers) 


       

//         // const question =await questionModel.find({isDeleted:false})
//         // const answer =await answerModel.find().populate("questionId","askedBy");
//         // if(question._id==answer.)
//         // const answer =await answerModel.find()
//         // console.log(answer)//array
//         // const allAnswers = answer.map((a)=>a=a.text);
//         // console.log(allAnswers)//array
//         const obj={
//             question:question,
//             answer:answer
//         }
//         return res.status(200).send({status:true,meassage:"successfully featched data", data:obj})
        
//         // const questionData= await answerModel.find()
//         // return res.status(200).send({status:true,meassage:"successfully featched data", data:questionData})
       
       

//     } catch (e) {
//         return res.status(500).send({ status: false, message: e.message })
//     }

// }








