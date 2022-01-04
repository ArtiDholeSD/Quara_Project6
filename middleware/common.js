const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    try {
        const bearerHeader = req.headers['authorization']
        console.log(bearerHeader)
        if(!bearerHeader) {
            res.status(403).send({status: false, message: `Missing authentication token in request`})
          
        }
               const bearer= bearerHeader.split(' ');
               const bearerToken =bearer[1];
               console.log(bearerToken)

            let decoded = jwt.verify(bearerToken, "radium");
            console.log("a",decoded)// { _id: '61d3ffbdb92018f32465c0ee', iat: 1641291639, exp: 1641295239 }

        if(!decoded) {
           
            return res.status(403).send({status: false, message: `Invalid authentication token in request`})
            
        }

        req.userId = decoded._id
        console.log("from middleware",req.userId)
        next()
    } catch (error) {
        console.error(`Error! ${error.message}`)
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.authMiddleware = authMiddleware