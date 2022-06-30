const mongoose = require('mongoose')

// The Profile Schema 
const ProfileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    color: String,
    image: String,
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Profile', ProfileSchema)