const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        age: {
            type: Number,
            required: true,
            validate(val){
                if(val < 0 || val == null){
                    throw new Error('Age Must be > 0')
                }
            }
        },
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
            trim: true,
            validate(val){
                if(!validator.isEmail(val)){
                    throw new Error('Is not a proper email id') 
                }
            }
        },
        password: {
            type: String,
            required: true,
            minlength: 7,
            trin: true,
            validate(val){
                if(val.includes('password')){
                    throw new Error('Is not a proper password') 
                }
                
            }
        }
    }
)

userSchema.statics.findByCredentials = async (email, password) => {

    const user = await User.findOne({ email })

    if(!user){
        throw new Error('unable to login')
    }

    console.log(password,user.password)

    const isMatch = await bcrypt.compare(password, user.password)

    console.log(isMatch)

    if(!isMatch){
        throw new Error('unable to login')  
    }

    return user
}

// Hash the password before save
userSchema.pre('save', async function(){
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
        
    // next()
})

// INSERT User Data
const User = mongoose.model('User', userSchema)

module.exports = User