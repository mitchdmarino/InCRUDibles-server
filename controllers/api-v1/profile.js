const router = require('express').Router()
const db = require('../../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authLockedRoute = require('./authLockedRoute')

router.post('/', authLockedRoute, async (req,res) => {
    try {
        // The signed in account is searched for.
        const account = res.locals.account
        // A new profile is created based on the req.body.
        const newProfile = await db.Profile.create(req.body)
        // A new profile is added to the account .
        account.profiles.push(newProfile)
        // The account and profile are saved. 
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
        // The profile is searched for.
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
        const account = res.locals.account
        const response = await account.populate('profiles')
        res.json(response)
    } catch (err) {
        console.warn(err)
        res.status(500).json({msg: 'server error'})
    }
})

module.exports = router