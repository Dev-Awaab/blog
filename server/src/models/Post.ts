import { Schema, model, Document } from "mongoose";

interface IPost extends Document {
  title: string;
  content: string;
  image: string;
  author: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default model<IPost>("Post", postSchema);
