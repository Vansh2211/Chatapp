import mongoose, { Schema, Document } from "mongoose";

interface IGroup extends Document {
  id: string;
  name: string;
  admin: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const Group = new Schema<IGroup>(
  {
    name: {
      type: String,
      required: true,
      // unique:true
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Groups = mongoose.model<IGroup>("Group", Group);
export default Groups;
