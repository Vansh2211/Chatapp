import mongoose,{Schema,Document} from "mongoose";

export interface IDBRequest extends Document{
    sender:mongoose.Schema.Types.ObjectId;
    receiver:mongoose.Schema.Types.ObjectId;
    status : "pending" | "accepted" | "rejected";
    createdAt:Date;
}

const RequestSchema = new Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:["pending","accepted","rejected"],
        default:"pending"
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

});

const Requests = mongoose.model<IDBRequest>("Request",RequestSchema);
export default Requests;