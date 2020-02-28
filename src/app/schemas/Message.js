import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    sent: {
      type: Number,
      required: true,
    },
    received: {
      type: Number,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    date: {
      type: String,
    },
    read: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Message', MessageSchema);
