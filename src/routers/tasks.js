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

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0
router.get('/tasks', auth, async (req,res)=>{
const match = {}
if(req.query.completed){
    // req.query.completed always returns a string
    // convert string into boolean value
    match.completed = req.query.completed === 'true'
}

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip)
            }             
        }).execPopulate()      
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }

})

router.get('/tasks/:id',auth, async (req,res)=>{
    
    const _id = req.params.id;

    try {
        const task = await Task.findOne({ _id, owner: req.user._id})

        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        console.log("get sin task", e)
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const valid = ['description', 'completed']
    const isValid = updates.every((update) => valid.includes(update))
    if(!isValid){
        return res.status(400).send({error: "invalid"})
    }    
    
    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})        
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((el) => task[el] = req.body[el] );

        await task.save()
        res.send(task)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const tsk = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!tsk){
            return res.status(404).send()
        }
        res.send(tsk)

    } catch (e) {
        res.status(500).send(e)
    }
})


module.exports = router