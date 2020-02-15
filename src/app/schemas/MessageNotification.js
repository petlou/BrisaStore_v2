import mongoose from 'mongoose';

const MessageNotificationSchema = new mongoose.Schema(
  {
    content: {
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

export default mongoose.model('MessageNotification', MessageNotificationSchema);
