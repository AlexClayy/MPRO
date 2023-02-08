import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 5,
    },
    balance: {
        type: Number,
        default: 500,
    }
})

export default mongoose.model('User', userSchema);