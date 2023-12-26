const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    if(req.headers.authorization!==undefined) {
        let token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.secretKey, (err, data) => {
            if(!err) { next(); } 
            else { res.status(400).send({ message: "Invalid token" })} 
        })
    }
    else {
        res.send({ message: "Please provide your token to access the page" });
    }
}

module.exports = verifyToken;