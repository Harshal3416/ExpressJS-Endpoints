const express = require('express')
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

// when a get call is made with /users, auth function is called and executed
// 3rd parameter will be executed only if the next() is called from auth function
router.get('/users/me', auth, async (req, res)=>{
 
    res.send(req.user)
    // try{
    //     const user = await User.find({})
    //     res.send(user)
    // }
    // catch(e){
    //     res.status(500).send(e)
    // }
})

router.get('/users/:id', async (req, res)=>{
    const _id = req.params.id;
    console.log(req.params)

    try{
        const user = await User.findById(_id)
        if(!user){
         return res.status(404).send()
        }
        res.send(user)
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.patch('/users/:id', async (req, res)=>{

    const updates = Object.keys(req.body)
    const valid = ['name', 'age', 'email', 'password']
    const isValid = updates.every((update) => valid.includes(update))

    if(!isValid){
        return res.status(400).send({error: "invalid"})
    }

    try {

        const user = await User.findById(req.params.id)
        
        updates.forEach((up) => user[up] = req.body[up])
        await user.save()

        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        console.log("error found", e)
        res.status(400).send(e)
    }
})

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)

    } catch (e) {
        res.status(500).send(e)
    }
})


module.exports = router