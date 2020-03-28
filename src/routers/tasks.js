const express = require('express')

const Task = require('../models/tasks')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try{
        await task.save()
        res.status(201).send(task)
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.get('/tasks', async (req,res)=>{

    try {
        const task =  await Tasks.find({})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }

})

router.get('/tasks/:id', async (req,res)=>{
    
    const _id = req.params.id;

    try {
        const task = await Tasks.findById(_id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const valid = ['name', 'status']
    const isValid = updates.every((update) => valid.includes(update))
    if(!isValid){
        return res.status(400).send({error: "invalid"})
    }    
    
    try {

        const task = await Tasks.findById(req.params.id)
        
        updates.forEach((el) => task[el] = req.body[el] );

        await task.save()

        // const task = await Tasks.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/tasks/:id', async (req, res) => {
    try {
        const tsk = await Tasks.findByIdAndDelete(req.params.id)
        if(!tsk){
            return res.status(404).send()
        }
        res.send(tsk)

    } catch (e) {
        res.status(500).send(e)
    }
})


module.exports = router