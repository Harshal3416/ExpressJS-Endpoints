const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true 
})



// const me = new User({
//     name: 'Harshal  ',
//     age: 24,
//     email: 'har.b@gmail.com',
//     date: new Date,
//     password: 'Pas'
// })

// me.save()
// .then(()=>{
//     console.log(me)
// })
// .catch((err)=>{
//     console.log("error", err)
// })


// const tsk = new TaskManager({
//     name: '  NodeJs',
//     // status: true
// }
// )

// tsk.save()
// .then(()=>{
//     console.log("saved->", tsk)
// })
// .catch((err)=>{
//     console.log("error", err)
// })