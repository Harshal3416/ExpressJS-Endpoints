const express = require('express')
require('./db/mongoose')

const useRouterUser  = require('./routers/users')
const useRouterTask  = require('./routers/tasks')

const app = express()
const port = process.env.PORT || 3000;

app.use(express.json())

app.use(useRouterUser)
app.use(useRouterTask)

app.listen(port, ()=>{
    console.log("Server is running on port no: ", port)
})