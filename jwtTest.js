const jwt = require('jsonwebtoken')

// tokens that are not verified will throw an error to the catch
try {
    // create a jwt 'payload' (the information that you want to encode in the token)
    // user data from the db
    const payload = {
        name: 'test boi',
        email: 'test@testboi.com',
        // NO PASSWORD 
        id: 'hi i am the user\'s id'
    }
    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.   eyJuYW1lIjoidGVzdCBib2kiLCJlbWFpbCI6InRlc3RAdGVzdGJvaS5jb20iLCJpZCI6ImhpIGkgYW0gdGhlIHVzZXIncyBpZCIsImlhdCI6MTY1NTkyNDE5NSwiZXhwIjoxNjU1OTMwMTk1fQ.   bQ4MEbVmcQ7B_gHLPvEc47qBNuoJVXSKwP_1DrHTHqM
    // part one: how the jwt is encoded       // part two: the actual encoded payload                                                                                                               // part 3 : signature that we created with the secret
    
    // sign and encode our jwt payload 
    // jwt.sign(data to encode, secret to sign iwth, options object)
    const token = jwt.sign(payload, 'my super duper big secret', { expiresIn: 60 * 100 })
    console.log(token)
    const decode = jwt.verify(token, 'my super duper big secret')
    console.log('decoded payload: ', decode)

} catch (err) {
    console.log('jwt error',err)
}