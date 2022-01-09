const mongoose = require('mongoose')

const ObjectId=mongoose.Schema.Types.ObjectId
const answerSchema= new mongoose.Schema({  
    answeredBy: {
    type:ObjectId, 
    ref:"QuaraUser",
    required:true,
    trim:true
     },

    text: { type :String, required:true},

    questionId:  {
        type:ObjectId, 
        ref:"Question",
        required:true,
        trim:true
    },
    isDeleted : {type :String, default:false}


},{timestamps:true});

module.exports = mongoose.model("quoraAnswer",answerSchema);  

//converting answerSchema into model(quoraAnswers)






// {
//     answeredBy: {ObjectId, refs to User, mandatory},
//     text: {string, mandatory},
//     questionId: {ObjectId, refs to question, mandatory}, 
//     createdAt: {timestamp},
//     updatedAt: {timestamp},
//   }