const bcrypt = require('bcrypt') 

const hashTest = async () => {
    try {
        const password = 'hello'
        const saltRounds = 12
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        // console.log(password, hashedPassword)
        const matchPasswords = await bcrypt.compare('hello', hashedPassword)
        console.log(matchPasswords)
    } catch (err) {
        console.log(err)
    }
}

hashTest()