const mongoose = require('mongoose')

// The task schema
const TaskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        required: true,
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    deadline: String,
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    } 
})

module.exports = mongoose.model('Task', TaskSchema)