const jwt = require('jsonwebtoken')
const db = require('../../models')

const authLockedRoute = async (req, res, next) => {
    try {
        // jwt from the client sent in the headers 
        const authHeader = req.headers.authorization
        console.log(authHeader)
        // decode the jwt -- will throw to the catch if the signature is invalid 
        const decode = jwt.verify(authHeader, process.env.JWT_SECRET)
        console.log(decode)
        
        // find the account in the db that sent the jwt 
        const foundAccount = await db.Account.findById(decode.id) // add .populate('') here

        // mount the account on the res.locals, so the downstream route has the logged in account         
        res.locals.account = foundAccount
        
        next()

    } catch (err) {
        // this means there is a authentication error 
        console.warn(err)
        res.status(401).json({ msg: 'User Auth FAILED 🤬🤯'})
    }
}

module.exports = authLockedRoute