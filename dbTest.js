const db = require('./models')

// testing user CREATE 

db.User.create({
    name: 'Test boi', 
    email: 'test@boi.com',
    password: '1234'
})
    .then(user => {
        console.log('what up test boiii!!! ', user)
    })
    .catch(console.warn)