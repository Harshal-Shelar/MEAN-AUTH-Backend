import mongoose, { Schema } from 'mongoose';

const HistorySchema = mongoose.Schema(
    {
        name:{
            type : String,
            required : true
        },
        operation:{
            type : String,
            required : true
        },
        userId:{
            type : String,
            required : true
        },
        empId:{
            type : String,
            required : true
        },
        date : {
            type : String,
            required : true
        }
    },
    {
        timestamps : true
    }
)
export default mongoose.model("history",HistorySchema )