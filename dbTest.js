const db = require('./models')

// testing user CREATE 

db.Account.create({
    name: 'First Account', 
    email: 'firs@account.com',
    password: '1234'
})
    .then(account => {
        console.log('Did this work? ', account)
    })
    .catch(console.warn)


const addProfile = async () => {
    // find the account
    const account = await db.Account.findOne({email:'firs@account.com'})
    console.log(account)
    // create a new profile
    const newProfile = await db.Profile.create({
        name: '2'
    })
    // Add the 
    account.profiles.push(newProfile)
    // save 
    await account.save()
    await newProfile.save()
    console.log(account)
}

addProfile()

const addTask = async () => {
    // find the account
    const account = await db.Account.findOne({email:'firs@account.com'})
    console.log(account)
    // create a new Task
    const newTask = await db.Task.create({
        description: 'new Task',
        completed: false
    })
    // Add the 
    account.tasks.push(newTask)
    // save 
    await account.save()
    await newTask.save()
    console.log(account)
}

addTask()

// completing a task 

const completeTask = async () => {
    // find the Task 
    const task = await db.Task.findById('62b5ee14467063340369091d')
    // task completed 
    task.completed = true 

    // find the profile
    const profile = await db.Profile.findById('62b5edf5039e050bad0a78d1')
    console.log(profile)
    task.profile = profile
    task.save()
    console.log(task)
}

completeTask()

