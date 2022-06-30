// The required packages
require('dotenv').config()
require ('./models')
const express = require('express')
const cors = require('cors')

// App config and middlewares
const app = express()
const PORT = process.env.PORT || 8000
app.use(cors())
app.use(express.json()) // json req.bodies

const myMiddleware = ( req, res, next ) => {
    console.log('hello i am a middleware')
    res.locals.myData = 'I am data that is passed out of the middleware'
    next()
}

// Routes and Controllers
// Route specific middleware 
app.get('/', myMiddleware, (req, res) => {
    res.json({ msg: 'welcome to the backend. its good to be back' })
    console.log(res.locals.myData)
})

app.use('/api-v1/account', require('./controllers/api-v1/account'))
app.use('/api-v1/profile', require('./controllers/api-v1/profile'))
app.use('/api-v1/tasks', require('./controllers/api-v1/tasks'))


// Listening on port 

app.listen(PORT, () => {
    console.log(`Is that PORT ${PORT} that I hear?`)
})