import mongoose, { Document, Schema } from "mongoose";
import { MessageDocument } from "./Message";

interface User extends Document {
  username: string;
  password: string;
  messages: MessageDocument[];
  email?: string;
  passwordResetToken?: string;
  passwordResetTokenExpires?: Date | number;
}

const userSchema = new Schema<User>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  email: { type: String, required: false },
  passwordResetToken: { type: String, required: false },
  passwordResetTokenExpires: { type: Date, required: false },
});

export default mongoose.model<User>("User", userSchema);
