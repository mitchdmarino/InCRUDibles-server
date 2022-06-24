const router = require('express').Router()
const db = require('../../models')
const authLockedRoute = require('./authLockedRoute')

router.post('/', authLockedRoute, async (req,res) => {
    try {
        // find the account that is signed in
        const account = res.locals.account
        // create a new task based on the req.body
        const newTask = await db.Task.create(req.body)
        // add the newtask to the account 
        account.tasks.push(newTask)
        // save 
        await account.save()
        await newTask.save()
        res.json(account)
    } catch (err) {
        console.warn(err)
        res.status(500).json({msg: 'server error'})
    }
})

router.put('/:id', async (req,res) => {
    try {
        const id = req.params.id
        const options = {new: true}
        // find the task 
        const task = await db.Task.findByIdAndUpdate(id, req.body, options)
        res.json(task)
        
    } catch (err) {
        console.warn(err)
        res.status(500).json({msg: 'server error'})
    }
})

router.delete('/:id', async (req,res) => {
    try {
        const id = req.params.id
        await db.Task.findByIdAndDelete(id)
        // no content status
        res.sendStatus(204)
    } catch (err) {
        console.warn(err)
        res.status(500).json({msg: 'server error'})
    }
})

module.exports = router