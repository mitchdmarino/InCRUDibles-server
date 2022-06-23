require('dotenv').config()
require ('./models')
const express = require('express')
const cors = require('cors')

// app config and middlewares
const app = express()
const PORT = process.env.PORT || 8000
app.use(cors())
app.use(express.json()) // json req.bodies

// app.use(( req, res, next ) => {
//     console.log('hello i am a middleware')
//     res.locals.myData = 'I am data that is passed out of the middleware'
//     next()
// })
const myMiddleware = ( req, res, next ) => {
    console.log('hello i am a middleware')
    res.locals.myData = 'I am data that is passed out of the middleware'
    next()
}


// routes and controllers

// route specific middleware 


app.get('/', myMiddleware, (req, res) => {
    res.json({ msg: 'welcome to the backend. its good to be back' })
    console.log(res.locals.myData)
})

app.use('/api-v1/users', require('./controllers/api-v1/users'))


// listen on a port 

app.listen(PORT, () => {
    console.log(`is the PORT ${PORT}`)
})