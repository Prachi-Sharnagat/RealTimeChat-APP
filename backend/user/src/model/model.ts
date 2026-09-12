import mongoose, {Document, Schema} from "mongoose";

export interface IUser extends Document {
     name : string;
     email : string;
}

// mongoose schema for mongodb 
const schema : Schema<IUser> = new Schema({
    name:{
        type : String,
        required : true,
    },
    email:{
        type : String,
        required : true,
        unique : true,
    },
}, {
    timestamps: true,
})
// model name is user 
export default mongoose.model<IUser>("User", schema)