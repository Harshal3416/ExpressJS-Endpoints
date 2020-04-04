// Models help us to declare schema for the particular fields
// 'taaskStats' is the collection name
const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true,
            trim : true,
    
        },
        completed: {
            type: Boolean,
            default:false
        },
        owner:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    },{
        timestamps: true
    }
)

// INSERT Task Collection
const TaskManager = mongoose.model('taaskStats', taskSchema) 

module.exports= TaskManager