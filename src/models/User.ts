import mongoose, { Document, Schema } from "mongoose";

interface User extends Document {
  username: string;
  password: string;
}

const userSchema = new Schema<User>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.model<User>("User", userSchema);
