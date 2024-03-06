import mongoose, { Schema } from 'mongoose';

const ProductSchema = mongoose.Schema(
    {
        name:{
            type : String,
            required : true
        },
        email:{
            type : String,
            required : true
        },
        phoneNumber:{
            type : String,
            required : true
        },
        address:{
            type : String,
            required : true
        },
        salary:{
            type : String,
            required : true
        },
        empId:{
            type : String,
            required : true
        },
        userId : {
            type : String,
            required : true
        }
    },
    {
        timestamps : true
    }
)
export default mongoose.model("product",ProductSchema )