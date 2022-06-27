const router = require('express').Router()
const db = require('../../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authLockedRoute = require('./authLockedRoute')

router.post('/', authLockedRoute, async (req,res) => {
    try {
        // find the account that is signed in
        const account = res.locals.account
        // create a new profile based on the req.body
        const newProfile = await db.Profile.create(req.body)
        // add the newprofile to the account 
        account.profiles.push(newProfile)
        // save 
        await account.save()
        await newProfile.save()
        const response = await account.populate('profiles')
        res.json(response)
    } catch (err) {
        console.warn(err)
        res.status(500).json({msg: 'server error'})
    }
})

router.put('/:id', authLockedRoute, async (req,res) => {
    try {
        const id = req.params.id
        const options = {new: true}
        // find the profile 
        const profile = await db.Profile.findByIdAndUpdate(id, req.body, options)
        const account = res.locals.account
        const response = await account.populate('profiles')
        res.json(response)
        
    } catch (err) {
        console.warn(err)
        res.status(500).json({msg: 'server error'})
    }
})

router.delete('/:id', authLockedRoute, async (req,res) => {
    try {
        const id = req.params.id
        await db.Profile.findByIdAndDelete(id)
        // no content status
        const account = res.locals.account
        const response = await account.populate('profiles')
        res.json(response)
    } catch (err) {
        console.warn(err)
        res.status(500).json({msg: 'server error'})
    }
})

module.exports = router