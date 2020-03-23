const express = require('express')
require('./db/mongoose')

const useRouterUser  = require('./routers/users')
const useRouterTask  = require('./routers/tasks')

const app = express()
const port = process.env.PORT || 3000;

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

app.listen(port, ()=>{
    console.log("Server is running on port no: ", port)
})