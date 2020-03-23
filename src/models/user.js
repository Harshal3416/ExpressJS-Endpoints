// Models help us to declare schema for the particular fields
// 'User' is the collection name

// npm i bcrypt > to encript the password in one way
// harshal -> $1j$shvchvH -> harshal (2 way)
// harshal -> $1j$shvchvH  (1 way)

// npm i validator > to use readymade validator (ex: isEmail)

const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
                if(val.toLowerCase().includes('password')){
                    throw new Error('Is not a proper password') 
                }
                
            }
        },
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }]
    }
)

userSchema.methods.generateAuthToken = async function (){
    const user = this
    const token = jwt.sign({ _id : user._id.toString()}, 'checktokens')  
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

// syntax to use declared schema functions from routers page
userSchema.statics.findByCredentials = async (email, password) => {

    // get an object with the given email
    const user = await User.findOne({ email })

    if(!user) throw new Error('unable to login')

    // compare password 
    // 19Lpa@mean $2a$08$rs0erCneC7g3Ad80c74LIuWRA6roG.ckzHp9hTbP8wpEIRx.C8nii
    // is true

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) throw new Error('unable to login')  

    return user
}

// Hash the password before save
userSchema.pre('save', async function(){
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
        
    next()
})

// INSERT User Data
const User = mongoose.model('User', userSchema)

module.exports = User