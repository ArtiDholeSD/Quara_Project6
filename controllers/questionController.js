
const questionModel = require("../models/questionModel")
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const validator = require('../utils/validator');


const CreateQuestion = async function (req, res) {
    try {
        if (!validator.isValidRequestBody(req.body)) {
            return res.status(400).send({ status: false, message: 'Invalid request Parameters. Please provide User Details' })
        }
        let { description, tag, askedBy, deletedAt, isDeleted } = req.body
        // validation
        if (!validator.isValid(description)) {
            return res.status(400).send({ status: false, message: `${description} is required` })
        }
        if (!validator.isValid(tag)) {
            return res.status(400).send({ status: false, message: `${tag} is required` })
        }
      
      
     
        { description, tag, askedBy, deletedAt, isDeleted }
        const newQuestion = await questionModel.create(userData);
        return res.status(201).send({ status: true, message: `Question created successfully`, data: newQuestion })

    } catch (e) {
        return res.status(500).send({ status: false, message: e.message })
    }

}


module.exports=
{
    CreateQuestion
}






















// //Q3
// const getThisBlog = async function (req, res) {

//     try {
        
//        if(Object.values(req.query).length===0){//returns array of i.e.[isDeleted:false,isPublished:true, ]
//             let filter={isDeleted:false,isPublished:true,authorId:req.validToken._id}
//             let data=await blogModel.find(filter)
//             if(data){
//                 res.status(200).send({status:true,data:data})
//             }else{
//                 res.status(404).send({status:false,msg:"no such blog found"})
//             }
           
//        }else{
//            req.query["authorId"]=req.validToken._id
//            data=await blogModel.find(req.query)
//            if(data){
//                res.status(200).send({status:true,data:data})
//            }else{
//                res.status(404).send({status:false,msg:"no such blog found"})
//            }
//            }
//         }
//     catch (err) {
//         console.log(err)
//         res.send(err)
//     }
// }

// //Q4-
// const updateDetails = async function (req, res) {
//     try {
//         const title = req.body.title;
//         const body = req.body.body;
//         const tags = req.body.tags;
//         const subcategory = req.body.subcategory;
//         let id=req.validToken._id
//         let Update = {}
//         Update.title = await blogModel.findOneAndUpdate({ _id: req.params.blogId, isDeleted:false, authorId:id }, { title: title }, { new: true })

//         Update.body = await blogModel.findOneAndUpdate({ _id: req.params.blogId, isDeleted:false, authorId:id  }, { body: body }, { new: true })

//         Update.tags = await blogModel.findOneAndUpdate({ _id: req.params.blogId , isDeleted:false, authorId:id}, { $push: { tags: tags } }, { new: true })

//         Update.subcategory = await blogModel.findOneAndUpdate({ _id: req.params.blogId, isDeleted:false, authorId:id  }, { $push: { subcategory: subcategory } }, { new: true })

//         Update.isPublished = await blogModel.findOneAndUpdate({ _id: req.params.blogId , isDeleted:false, authorId:id }, { isPublished: true }, { new: true })

//         Update.publishedAt = await blogModel.findOneAndUpdate({ _id: req.params.blogId, isDeleted:false, authorId:id  }, { publishedAt: String(new Date()) }, { new: true })
        
//         let updatedBlog = await blogModel.find({ _id: req.params.blogId, isDeleted:false, authorId:id })

//         res.send({ data: updatedBlog })

//     } catch (err) {
//         res.status(500).send({ msg: err });
//     }

// }





// //Q5-
// let deleteBlog = async function (req, res) {
//     try {
       
//         let filter={isDeleted:false}  
//         filter["authorId"]=req.validToken._id
//         filter["_id"]=req.params.blogId
//         console.log(filter)
//         let deletedTime = String(new Date());
       
//         let DeletedBlog=await blogModel.findOneAndUpdate(filter,{isDeleted: true, deletedAt: deletedTime })
//         if(DeletedBlog){
//             res.status(200).send( {status: true, msg: "Blog has been deleted" })
//         }else{
//             res.status(404).send({status: false, msg: "either the blog is already deleted or you are not valid author to access this blog" })
//         }
//     }
//     catch (err) {
//         console.log(err)
//         res.send(err)
//     }
// }

// //Q6-

// const specificDelete = async function (req, res) {
//     try {
//         const filter = {
//             isDeleted: false,
//             isPublished:false,
            
//         };
//         filter["authorId"]=req.validToken._id
        
        
//         if (req.query.category) {
//             filter["category"] = req.query.category;
//         }
//         if (req.query.AuthorId) {
//         filter["authorId"] = req.query.AuthorId;
//         }
//         if (req.query.tags) {
//             filter["tags"] = req.query.tags;
//         }
//         if (req.query.subcategory) {
//             filter["subcategory"] = req.query.subcategory;
//         }
       
//         let deletedTime = String(new Date());
//         let deleteData = await blogModel.findOneAndUpdate(filter, {
//             isDeleted: true,
//             deletedAt: deletedTime
//         });
      
//         if (deleteData) {
//             res.status(200).send({ status: true, msg: "Blog has been deleted" });
//         } else {
//             res.status(404).send({ status: false, msg: "no such blog exist" });
//         }
//     } catch {
//         res.status(500).send({ status: false, msg: "Something went wrong" });
//     }
// }



// module.exports.createBlog = createBlog;
// module.exports.getThisBlog = getThisBlog;
// module.exports.updateDetails = updateDetails
// module.exports.deleteBlog = deleteBlog
// module.exports.specificDelete = specificDelete




