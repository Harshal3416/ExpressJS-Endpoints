require('../db/mongoose')
const User = require('../models/user')

// User.findByIdAndUpdate('5e74c119877ef41bccb214f2', { age: 1})
// .then((user)=>{
//     console.log(user)
//     return User.countDocuments({ age:1})
// })
// .then((res)=>{
//     console.log(res)
// })
// .catch((e)=>{
//     console.log(e) 
// })

const updateAgeCount = async (id, age) =>{
    const user = await User.findByIdAndUpdate(id, {age})
    const count = await User.countDocuments({age})
    return count
}

updateAgeCount('5e74c119877ef41bccb214f2', 99)
.then((count)=>{
    console.log(count)
})
.catch((e)=>{
    console.log(e) 
})