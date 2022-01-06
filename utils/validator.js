const mongoose = require('mongoose')




const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const  reNumber = /^[6-9]\d{9}$/;
//const reNumber = "(\+91)?(-)?\s*?(91)?\s*?(\d{3})-?\s*?(\d{3})-?\s*?(\d{4})";
const checkMinMax=/^.{8,15}$/;

const validateEmail = function(email) {
    return re.test(email)
};

const isValid = function(value) {
    if(typeof value === 'undefined' || value === null) return false
    if(typeof value === 'string' && value.trim().length === 0) return false
    if(typeof value === 'number' && value.toString().trim().length === 0) return false
    return true;
}

/*const isValidTitle = function(title) {
    return systemConfig.titleEnumArray.indexOf(title) !== -1
}*/

const isValidRequestBody = function(requestBody) {
    return Object.keys(requestBody).length > 0
}

const isValidObjectId = function(objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const isValidString = function(value) {
    return Object.prototype.toString.call(value) === "[object String]"
}

const isArray = function(arr) {
    return Array.isArray(arr)
}

const isValidNumber = function(value) {
    return !isNaN(Number(value)) && reNumber.test(value)
}
const isValidAvailableSizes = function (value) {
    return ['S','XS','M','X','L','XXL','XL'].indexOf(value)!== -1
}

const isValidLength = function(value, min, max) {
    const len = String(value).length
    return len >= min && len <= max
}
// Validate string length
//------------->{/^.{1,35}$/.test(variable) // min - 1, max - 35}
const isNumberLength = function(variable) {
    return checkMinMax.test(variable)
};
const isInValidRange = function(value, min, max) {
    if(!isValidNumber(value)) return false
    return value >= min && value <= max
}



module.exports = {
    validateEmail,
    emailRegex: re,

    isValid,
    isValidRequestBody,
    isValidObjectId,
    isValidString,
    isValidAvailableSizes,
    isValidNumber,
    isValidLength,
    isNumberLength,
    isInValidRange,
    isArray
    
};