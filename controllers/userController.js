const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const validator = require('../utils/validator');


//Q1
const registerUser = async function (req, res) {
    try {
        if (!validator.isValidRequestBody(req.body)) {
            return res.status(400).send({ status: false, message: 'Invalid request Parameters. Please provide User Details' })
        }
        let { fname, lname, email, phone, password } = req.body
        // validation
        if (!validator.isValid(fname)) {
            return res.status(400).send({ status: false, message: `${fname} is required` })
        }
        if (!validator.isValid(lname)) {
            return res.status(400).send({ status: false, message: `${lname} is required` })
        }
        if (!validator.validateEmail(email)) {
            return res.status(400).send({ status: false, message: `${email} should be valid Email adreess` })
        }
        const presentEmail = await userModel.findOne({ email: email })
        if (presentEmail) {
            return res.status(400).send({ status: false, message: `${email} is already Present` })
        }
        if (!validator.isValidNumber(phone)) {
            return res.status(400).send({ status: false, message: `${phone} should be valid  Indian Mobile Number` })
        }
        const presentPhone = await userModel.findOne({ phone: phone })
        if (presentPhone) {
            return res.status(400).send({ status: false, message: `${phone} is already Present` })
        }
       // password = password.trim()
       
        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: `Password is required` })
        }
        password = password.trim()

        if (!validator.isValidLength(password, 8, 15)) {
            return res.status(400).send({ status: false, message: `Password length must be between 8 to 15 char long` })
        }
        fname = fname.trim()
        lname = lname.trim()
        email = email.trim()
        phone = phone.trim()
      

        //encrypting password
        const encrypt = await bcrypt.hash(password, 10)
        const userData = { fname, lname, email, phone, password: encrypt }

        const newUser = await userModel.create(userData);
        return res.status(201).send({ status: true, message: `User created successfully`, data: newUser })

    } catch (e) {
        return res.status(500).send({ status: false, message: e.message })
    }

}




///Authentication
//Q2

const login = async function (req, res) {

    try {
        const requestBody = req.body;

        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({
                status: false, message: "Invalid request parameters. Please provide login details",
            });
        }

        // Extract params
        const { email, password } = requestBody;

        // Validation starts
        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, message: `Email is required` });
        }

        if (!validator.validateEmail(email)) {
            return res.status(400).send({ status: false, message: `Email should be a valid email address` });
        }

        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: `Password is required` });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).send({ status: false, message: `user not exist` });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        console.log(validPassword)

        // Validation ends


        if (validPassword) {

            let token = await jwt.sign({ _id: user._id }, "radium", { expiresIn: "1h" })// iat: Math.floor(Date.now() / 1000),

            return res.status(200).send({ status: true, message: `User login successfull`, data: { userId: user._id, token: token } });

        } else {
            return res.status(400).send({
                status: false,
                msg: "invalid Credentials"
            })
        }
    } catch (e) {
        return res.status(500).send({ status: false, message: e.message })
    }

}

const getUser = async function (req, res) {
    try {
        const user_Id = req.params.userId;
        const userIdFromToken = req.userId
        console.log(user_Id)
        console.log(userIdFromToken)
        if (!validator.isValidObjectId(user_Id)) {
            return res.status(400).send({ status: false, message: `${user_Id} is not valid` })
        }
        if (!validator.isValidObjectId(userIdFromToken)) {
            return res.status(400).send({ status: false, message: `${userIdFromToken} Invalid user id ` })
        }
        const user = await userModel.findOne({ _id: user_Id })
        console.log(user)
        if (!user) {
            return res.status(404).send({ status: false, message: `user not found` })
        }
        if (user_Id.toString() !== userIdFromToken) {
            return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
        }
        return res.status(200).send({ status: true, message: "User profile details", data: user });
    }
    catch (error) {
        return res.send({ status: false, message: error.message });
    }
}

const updateDetails = async function (req, res) {
    try {
        const requestBody = req.body
        const params = req.params
        const userId = params.userId  //req.params.userId
        console.log(userId)
        const userIdFromToken = req.userId



        if (!validator.isValidObjectId(userId)) {
            res.status(400).send({ status: false, message: `${userId} is not a valid user id` })
            return
        }

        if (!validator.isValidObjectId(userIdFromToken)) {
            return res.status(400).send({ status: false, message: `${userIdFromToken} Invalid user id ` })
        }

        const user = await userModel.findOne({ _id: userId })
        if (!user) {
            return res.status(404).send({ status: false, message: `user not found` })
        }

        if (userId.toString() !== userIdFromToken) {
            res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
            return
        }

        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'No paramateres passed. user unmodified' })

        }

        // Extract params
        let { fname, lname, email, phone, password } = requestBody;

        fname = fname.trim()
        lname = lname.trim()
        email = email.trim()
        phone = phone.trim()
        password = password.trim()


        let obj = {}
        if (validator.isValidString(fname)) {
            obj['fname'] = fname
        }
        if (validator.isValidString(lname)) {
            obj['lname'] = lname
        }
        if (validator.isValidString(email)) {
            if (!validator.validateEmail(email)) {
                return res.status(400).send({ status: false, message: `Email should be a valid email address` })
            }
            let isEmailAlredyPresent = await userModel.findOne({ email: email })

            if (isEmailAlredyPresent) {
                return res.status(400).send({ status: false, message: `Email Already Present` });
            }
            //already present, VALID(done)
            obj['email'] = email
        }
        if (validator.isValidNumber(phone)) {
            if (!/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(phone)) {
                return res.status(400).send({ status: false, message: `Mobile should be a valid number` });
            }
            let isPhoneAlredyPresent = await userModel.findOne({ phone: phone })

            if (isPhoneAlredyPresent) {
                return res.status(400).send({ status: false, message: `Phone Already Present` });
            }
            //already present, VALID(done)
            obj['phone'] = phone
        }
        if (validator.isValidString(password)) {
            const encrypt = await bcrypt.hash(password, 10)
            obj['password'] = encrypt
        }

        const updatedUserData = await userModel.findOneAndUpdate({ _id: userId }, obj, { new: true })

        return res.status(200).send({ status: true, message: true, data: updatedUserData })

    } catch (e) {
        return res.status(500).send({ status: false, message: e.message })
    }
}




module.exports = {
    registerUser,
    login,
    getUser,
    updateDetails
}










