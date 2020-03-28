// Models help us to declare schema for the particular fields
// 'taaskStats' is the collection name
const mongoose = require('mongoose')

// INSERT Task Collection
const TaskManager = mongoose.model('taaskStats', {
    description: {
        type: String,
        required: true,
        trim : true,

    },
    status: {
        type: Boolean,
        default:false
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}) 

module.exports= TaskManager