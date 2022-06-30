const bcrypt = require('bcrypt') 

const hashTest = async () => {
    try {
      // Test hashing
      const password = "hello"
      const saltRounds = 12
      const hashedPassword = await bcrypt.hash(password, saltRounds)
      // Matching the hash to a string
      const matchPasswords = await bcrypt.compare("hello", hashedPassword)
      console.log(matchPasswords)
    } catch (err) {
        console.log(err)
    }
}

hashTest()