import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: false },
    }
})

export const User = mongoose.model('User', userSchema)

export const getUsers = () => User.find()
export const getUserByEmail = (email) => User.findOne({ email })
export const getUserBySessionToken = (sessionToken) => User.findOne({
    "authentication.sessionToken": sessionToken
})
export const getUserById = (id) => User.findById(id)
export const createUser = (values) => new User(values).save().then(user => user.toObject())
export const deleteUserById = (id) => User.findOneAndDelete({ _id: id })
export const updateUserById = (id, values) => User.findByIdAndUpdate(id, values)