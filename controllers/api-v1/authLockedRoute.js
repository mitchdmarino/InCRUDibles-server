const jwt = require('jsonwebtoken')
const db = require('../../models')

const authLockedRoute = async (req, res, next) => {
    try {
        // The jwt from the client is sent in the headers 
        const authHeader = req.headers.authorization
        console.log(authHeader)
        // The jwt is decoded.
        // A catch will be thrown if the signature is invalid.
        const decode = jwt.verify(authHeader, process.env.JWT_SECRET)
        console.log(decode)
        
        // The account in the db that sent the jwt is found.
        const foundAccount = await db.Account.findById(decode.id)

        // The account is mounted on the res.locals, so the downstream route has the logged in account.        
        res.locals.account = foundAccount
        
        next()

    } catch (err) {
        // This means there is a authentication error 
        console.warn(err)
        res.status(401).json({ msg: 'User authentication FAILED! 🤬🤯'})
    }
}

module.exports = authLockedRoute