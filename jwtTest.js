const jwt = require('jsonwebtoken')

// Tokens that are not verified will throw an error to the catch.
try {
  // Creating a jwt 'payload' (The info that you want to encode in the token)
  // This is user data from the DB.
  const payload = {
    name: "test boi",
    email: "test@testboi.com",
    // NO PASSWORD
    id: "hi i am the user's id",
  }

  // Sign and encode our jwt payload

  // Part one of a jwt is how it is encoded (how to get the data out of part two)
  // Part two of a jwt is the encoded payload (or user data)
  // Part three of a jwt is the signature
  const token = jwt.sign(payload, "my super duper big secret", {
    expiresIn: 60 * 100,
  })
  console.log(token)
  const decode = jwt.verify(token, "my super duper big secret")
  console.log("decoded payload: ", decode)
} catch (err) {
    console.log('jwt error',err)
}