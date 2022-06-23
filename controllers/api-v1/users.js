const router = require('express').Router()
const db = require('../../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authLockedRoute = require('./authLockedRoute')

// POST /users/register -- CREATE a new user 
router.post('/register', async (req, res) => {
    try {
        /// check if the user exists already 
        const findUser = await db.User.findOne({
            email: req.body.email
        })

        // disallow users from registerring twice
        if (findUser) {
            return res.status(400).json({ msg: 'email exists already' })
        }
        // hash the user's password
        const password = req.body.password
        const saltRounds = 12
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        //create a new user with the hashed password 
        const newUser = new db.User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        await newUser.save()
        // sign the user in 
        // create the jwt payload
        const payload = {
            name: newUser.name,
            email: newUser.email,
            id: newUser.id
        }
        // sign the token and send it back 
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 24 }) // expires in one day
        res.json({ token })
    } catch (err) {
        console.warn(err)
        // handle validation errors
        if (err.name === 'ValidationError') {
            res.status(400).json({ msg: err.message })
        } else {
            // handle all other errors
            res.status(500).json({ msg: 'server error 500 😡' })
        }
        res.status(500).json(err)

    }
})

// POST /users/login -- validate the login credentials
router.post('/login', async (req, res) => {
    try {
        // all the data will come in on the req.body
        console.log(req.body)
        // try to find the user in the database 
        const findUser = await db.User.findOne({
            email: req.body.email
        })

        // if the user is not found, send a status of 400 and let the user know login failed 
        if (!findUser) {
            return res.status(400).json({ msg: 'Invalid Login' })
        }
        // console.log(findUser)
        // Check if the supplied password matches the hash in the db 
        const passwordCheck = await bcrypt.compare(req.body.password, findUser.password )
        // console.log(passwordCheck)
        // if they do not match, return and let the user know that login has failed 
        if (!passwordCheck) {
            return res.status(400).json({msg: 'Invalid Login '})
        }
        // Create a jwt payload 
        const payload = {
            name: findUser.name,
            email: findUser.email,
            id: findUser.id
        } 
        // sign the jwt and send it back 
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 24 }) // expires in one day
        res.json({ token })
       
    } catch (err) {
        console.log(err)
    }
})

// GET /auth-locked -- checks users credentials and only sends back privilaged information if user is logged in properly
router.get('/auth-locked', authLockedRoute, (req, res) => {
    console.log('the current user is ', res.locals.user)
    res.json({ msg: 'welcome to the secret auth-locked route 🕵🏻‍♂️' })
    
})

module.exports = router 
