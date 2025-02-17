import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  password: string;
  mobile: number;
  online: boolean;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: Number, required: true },
  online: { type: Boolean, default: false },
});

const User = model<IUser>("User ", userSchema);
export default User;
