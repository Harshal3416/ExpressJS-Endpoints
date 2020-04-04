require('../db/mongoose')
const Task = require('../models/tasks')

// Task.findByIdAndRemove('5e75a319bdc0e832b00ef3b2')
// .then((task)=>{
//     console.log(task)
//     return Task.countDocuments({ status: false})
// })
// .then((res)=>{
//     console.log(res)
// })
// .catch((e)=>{
//     console.log(e) 
// })

const remove = async(id) => {
    await Task.findByIdAndRemove(id)
    return await Task.countDocuments({ status: true})
}

remove('5e74c336fa46e53f50a3da38')
.then((res)=>{
    console.log(res)
})
.catch((e)=>{
    console.log(e) 
})
