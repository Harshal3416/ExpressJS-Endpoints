const express = require('express')
const multer = require('multer')
const User = require('../models/user')
const auth = require('../middleware/auth')
const sharp = require('sharp')
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

// when a get call is made with /users/me, auth function is called and executed
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
        // 1MB
    },
    fileFilter(req, file, cb){

        // checking for an image
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('File must be a Image'))
        }

        cb(undefined, true)
    }
})

// upload.single() takes one parameter which is the key name and the value is file
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res)=>{
    // all the images will have a resolution of 250*250 and will be converted to PNG
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send('uploaded')
}, (error, req, res, next) => {
    res.status(400).send({error : error.message})
})

router.delete('/users/me/avatar', auth, upload.single('avatar'), async (req, res)=>{
    // to delete the avatar, set avarar as undefined
    req.user.avatar = undefined
    await req.user.save()
    res.send('uploaded')
})

router.get('/users/:id/avatar', async (req, res)=>{

    try {
        const user = await User.findById(req.params.id)

        // user doesn't exists or the user is not having avatar
        if(!user || !user.avatar){
            throw new Error()
        }

        // setting as png because all the images are converted to png using SHARP
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send(e)
    }
})

module.exports = router