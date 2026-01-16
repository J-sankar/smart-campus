import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  // 🆔 BASIC INFO
  roomId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true // Faster lookups
  },
  name: { 
    type: String, 
    required: true 
  }, // e.g., "Chemistry Lab 101"
  
  type: {
    type: String,
    enum: ['Classroom', 'Laboratory', 'Seminar Hall', 'Library', 'Office'],
    default: 'Classroom'
  },

  capacity: { 
    type: Number, 
    required: true 
  },
  
  // 📅 GOOGLE CALENDAR INTEGRATION
  // This ID (e.g., "c_188...group.calendar.google.com") tells the backend 
  // which specific Google Calendar to check for this room.
  googleCalendarId: { 
    type: String, 
    required: true,
    unique: true 
  },

  // 📹 AI CAMERA LINK
  // Matches the ID sent by your Python Worker (e.g., "CAM_001")
  cameraId: { 
    type: String, 
    default: null 
  },

  // 🟢 LIVE AI STATUS (Updated every few seconds)
  liveStatus: {
    currentOccupancy: { type: Number, default: 0 }, // How many people are there right now?
    lastUpdated: { type: Date, default: Date.now },
    
    // 👻 THE GHOST FLAG
    // Calculated field: True if (Calendar says "Busy" AND Occupancy == 0)
    isGhost: { type: Boolean, default: false }
  }

}, { timestamps: true });

export default mongoose.model('Room', RoomSchema);