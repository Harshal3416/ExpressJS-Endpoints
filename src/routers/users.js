const express = require('express')
const multer = require('multer')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/users', async (req, res) => {

    const user = new User(req.body)

    console.log(user)
    
    try{       
        await user.save()
        const token = await user.generateAuthToken()
        console.log(token)
        res.status(201).send({user, token})
    }
    catch(e){
        console.log(e)
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (e) {
        res.send(e)
    }
})


// to logout, just delete the token for the logged in user
// Logged in user will be saved in req.user
router.post('/user/logout', auth, async (req, res)=> {
    try {
        req.user.tokens = req.user.tokens.filter((token)=> {
            return token.token !== req.token
        })
        await req.user.save()
        res.send("logged out")
    } catch (e) {
        res.ststus(500).send(e)
    }
})

router.post('/users/logoutAll', auth, async (req, res)=>{
    try {
        req.user.tokens = []
        await req.user.save()
        res.send("logged out all")
    } catch (e) {
        res.status(500).send(e)
    }
})

// when a get call is made with /users, auth function is called and executed
// 3rd parameter will be executed only if the next() is called from auth function
router.get('/users/me', auth, async (req, res)=>{
 
    res.send(req.user)
    // As we can get the userdata from login, no need to find for the user again
    // try{
    //     const user = await User.find({})
    //     res.send(user)
    // }
    // catch(e){
    //     res.status(500).send(e)
    // }
})

// A loggedin user should not be able to view other users details, so commented this function
// router.get('/users/:id', async (req, res)=>{
//     const _id = req.params.id;
//     console.log(req.params)

//     try{
//         const user = await User.findById(_id)
//         if(!user){
//          return res.status(404).send()
//         }
//         res.send(user)
//     }
//     catch(e){
//         res.status(500).send(e)
//     }
// })

router.patch('/users/me', auth, async (req, res)=>{

    const updates = Object.keys(req.body)
    const valid = ['name', 'age', 'email', 'password']
    const isValid = updates.every((update) => valid.includes(update))

    if(!isValid){
        return res.status(400).send({error: "invalid"})
    }

    try {        
        updates.forEach((up) => req.user[up] = req.body[up])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        console.log("error found", e)
        res.status(400).send(e)
    }
})

// A user can delete his own account
router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        // if(!user){
        //     return res.status(404).send()
        // }

        // --OR--

        await req.user.remove()
        res.send(req.user)

    } catch (e) {
        res.status(500).send(e)
    }
})

const upload = multer({
    
    // dest: 'avatars', //path to save images
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){

        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('File must be a word'))
        }

        cb(undefined, true)
    }
})

// upload.single() takes one parameter which is the key name and the value is file
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res)=>{
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send('uploaded')
}, (error, req, res, next) => {
    res.status(400).send({error : error.message})
})

router.delete('/users/me/avatar', auth, upload.single('avatar'), async (req, res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send('uploaded')
})

router.get('/users/:id/avatar', async (req, res)=>{
    console.log("avatar")
    try {
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send(e)
    }
})

module.exports = router