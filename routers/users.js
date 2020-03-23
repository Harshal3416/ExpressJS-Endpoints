const express = require('express')
const User = require('../models/user')

const router = new express.Router()

router.post('/users', async (req, res) => {

    const user = new User(req.body)
    
    try{
        await user.save()
        res.status(201).send(user)
    }
    catch(e){
        res.status(400).send(e)
    }
    // user.save()
    // .then(()=>{
    //     res.status(201).send(user)
    // })
    // .catch((error)=>{
    //     res.status(400).send(error)
    // })
})

router.post('/users/login', async (req, res) => {
    try {
        console.log("hi")
        const user = await User.findByCredentials(req.body.email, req.body.password)
        console.log("user", user)
        res.send(user)
    } catch (e) {
        res.send(e)
    }
})

router.get('/users', async (req, res)=>{
 
    try{
        const user = await User.find({})
        res.send(user)
    }
    catch(e){
        res.status(500).send(e)
    }
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