const mongoose = require('mongoose')

const AccountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        required: true
    },
    password: {
        type: String, 
        required: true
    }, 
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    profiles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('Account', AccountSchema)