import mongoose, { mongo } from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
},{
    timestamps:true
})

const User = mongoose.model('User',userSchema)
export default User; 