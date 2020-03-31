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

const multer = require('multer')

const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){

        if(!file.originalname.match(/\.(doc|docx)$/)){
            return cb(new Error('File must be a word'))
        }

        cb(undefined, true)

        // cb(new Error('File must be a PDF'))
        // cb(undefined, true)
        // cb(undefined, false)
    }
})
app.post('/upload', upload.single('upload'), (req, res)=>{
    res.send()
})

app.listen(port, ()=>{
    console.log("Server is running on port no: ", port)
})