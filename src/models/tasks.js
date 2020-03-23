const mongoose = require('mongoose')
const validator = require('validator')


// INSERT Task Collection
const TaskManager = mongoose.model('taaskStats', {
    name: {
        type: String,
        required: true,
        trim : true,

    },
    status: {
        type: Boolean,
        default:false
    }
}) 



module.exports= TaskManager