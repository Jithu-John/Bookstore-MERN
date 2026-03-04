const jwt = require("jsonwebtoken")

const jwtmiddleware = ((req, res, next) => {
    console.log(`Inside JWT Middleware`);
    const token = req.headers.authorization.split(" ")[1]
    console.log(token);
    try {
        const jwtResponse = jwt.verify(token, process.env.jwtSecretKey)
        console.log(jwtResponse);
        req.payload = jwtResponse.userMail
        req.role = jwtResponse.role
        next()

    } catch (error) {
        res.status(500).json(`Invalid Token`)
    }

})

module.exports = jwtmiddleware