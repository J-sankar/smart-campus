import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  occupancy: Number,
  capacity: Number,
  isGhost: Boolean, // Was it a ghost booking?
  dayOfWeek: String // "Monday", "Tuesday"... (Helps AI find patterns)
});

export default mongoose.model('History', historySchema);