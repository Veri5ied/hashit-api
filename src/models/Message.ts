import mongoose, { Document, Schema } from "mongoose";

export interface MessageDocument extends Document {
  sender: string;
  receiver: string;
  content: string;
  timestamp: Date;
}

const messageSchema = new Schema<MessageDocument>({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<MessageDocument>("Message", messageSchema);
