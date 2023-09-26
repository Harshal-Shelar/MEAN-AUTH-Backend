import mongoose from 'mongoose';

const RoleScheme = mongoose.Schema(
    {
        role : {
            type : String,
            required : true
        }
    },
    {
        timestamp : true
    }
)

export default mongoose.model("Role",RoleScheme )