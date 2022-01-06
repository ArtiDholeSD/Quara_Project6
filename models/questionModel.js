
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const questionSchema = new mongoose.Schema(
    {
        description: { type: String, required: true },
        tags:  [{
            type: String
        }], //gievn as not required
        askedBy: { 
            type: ObjectId,
            required: true,
            trim:true,
            ref: "QuaraUser" }, //a referenec to user collection

        isDeleted: { type: Boolean, default: false },
        deletedAt: {type:Date}, 

    }, { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);

// { 
//     description: {string,mandatory} ,
//     tag: {array of string},
//     askedBy: {a referenec to user collection.,},
//     deletedAt: {Date, when the document is deleted}, 
//     isDeleted: {boolean, default: false},
//     createdAt: {timestamp},
//     updatedAt: {timestamp},
//   }






















