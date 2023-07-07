import mongoose from "mongoose";
import bcrypt from 'bcrypt'
const { Schema } = mongoose;

async function conectDb() {
    await mongoose.connect('mongodb://127.0.0.1:27017/mysite')
    console.log('Data base connected')
}
conectDb().catch(e => console.log(e))


const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        require: true
    }
})


const User = mongoose.model('User', userSchema);
export default User;

// const addMe = async () => {
//     const password = 'Guilherm#180767';
//     const hashPassword = await bcrypt.hash(password, 12);
//     const me = new User({
//         username: 'Guilherme Cardoso',
//         password: hashPassword
//     })
//     await me.save()
// }
const addMe = async () => {

    // const user = await User.findOne({ username: 'Guilherme Cardoso' })
    // console.log(user)
    // console.log(typeof user.password)
    // const password = 'Guilherm#180767'
    // const isValid = await bcrypt.compare(password, user.password)
    // console.log(isValid)

}
addMe()