const db = require('./models')

// Testing the ability to create an account. 

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
    // An account is searched for.
    const account = await db.Account.findOne({email:'firs@account.com'})
    console.log(account)
    // A new profile is created.
    const newProfile = await db.Profile.create({
        name: '2'
    })
    // The profile is added.
    account.profiles.push(newProfile)
    // The account and new profile that belongs to it are saved. 
    await account.save()
    await newProfile.save()
    console.log(account)
}

addProfile()

const addTask = async () => {
    // The account is searched for.
    const account = await db.Account.findOne({email:'firs@account.com'})
    console.log(account)
    // A new task is created.
    const newTask = await db.Task.create({
        description: 'new Task',
        completed: false
    })
    // The task is added to the account.
    account.tasks.push(newTask)
    // save 
    await account.save()
    await newTask.save()
    console.log(account)
}

addTask()

const completeTask = async () => {
    // A task is searched for. 
    const task = await db.Task.findById('62b5ee14467063340369091d')
    // The task is completed.
    task.completed = true 

    // The profile that completed the task is searched for and it is saved.
    const profile = await db.Profile.findById('62b5edf5039e050bad0a78d1')
    task.profile = profile
    task.save()
}

completeTask()

