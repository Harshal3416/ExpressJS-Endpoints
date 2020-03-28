const express = require('express')
require('./db/mongoose')

const useRouterUser  = require('./routers/users')
const useRouterTask  = require('./routers/tasks')

const app = express()
const port = process.env.PORT || 3000;

// app.use((req, res, next)=>{
//     if(req.method === 'GET'){
//         res.send('Get req disabled')
//     }
//     else{
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send('service under maintainance')
// })

app.use(express.json())

app.use(useRouterUser)
app.use(useRouterTask)

const jwt = require('jsonwebtoken')

const funcn = async () => {
    const token = jwt.sign({ _id: 'abc1423' }, 'thisismynewcourse', { expiresIn : '7 days'})
    // console.log(token)

    const data = jwt.verify(token, 'thisismynewcourse')
    // console.log(data)
}

funcn()

const Task = require('./models/tasks')
const User = require('./models/user')

const a = async() => {
    // const task = await Task.findById('5e7f46672ee4a02de0dbe41b')
    // console.log(task.owner)
    // await task.populate('owner').execPopulate()
    // console.log(task.owner.name)

    
    const user = await User.findById('5e7b6c4b72b018052027509c')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}

a()

app.listen(port, ()=>{
    console.log("Server is running on port no: ", port)
})