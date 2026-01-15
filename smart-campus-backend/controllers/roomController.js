import Room from '../models/Room.js';
import History from '../models/History.js';
import { getRoomSchedule } from '../services/calendarService.js'; // Ensure this exists
import { notifyRoomUpdate } from '../services/socketService.js';

/**
 * 🤖 CALLED BY: Python AI Service
 * ROUTE: POST /api/rooms/update-status
 */
export const updateRoomStatus = async (req, res) => {
  try {
    


    const { cameraId, personCount } = req.body;
    console.log(cameraId)
    // 1. Find the room connected to this camera
    const room = await Room.findOne({ cameraId });
    if (!room) {
      return res.status(404).json({ error: "Camera not linked to any room" });
    }

    // 2. CHECK GHOST STATUS (The "Smart" Logic)
    // We check if the room is currently booked in Google Calendar
    let isGhost = false;
    try {
      const schedule = await getRoomSchedule(room.googleCalendarId);
      
      // Check if there is a booking happening RIGHT NOW
      const now = new Date();
      const currentBooking = schedule.find(event => 
        new Date(event.start) <= now && new Date(event.end) >= now
      );

      // 👻 CONDITION: Booked + Empty (0 people) = Ghost
      if (currentBooking && personCount === 0) {
        isGhost = true;
      }
    } catch (err) {
      console.error("⚠️ Calendar check failed, skipping ghost logic:", err.message);
    }

    // 3. UPDATE DATABASE (Live Status)
    room.liveStatus.currentOccupancy = personCount;
    room.liveStatus.isOccupied = personCount > 0;
    room.liveStatus.lastUpdated = new Date();
    room.liveStatus.isGhost = isGhost;
    
    await room.save();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    await History.create({
      roomId: room.roomId,
      occupancy: personCount,
      capacity: room.capacity,
      isGhost: isGhost,
      dayOfWeek: days[new Date().getDay()]
    });

    // 4. LOG HISTORY (Snapshot every 15 mins for Analytics)
    // We check the last history entry to avoid spamming the DB
    // const lastHistory = await RoomHistory.findOne({ roomId: room._id })
    //   .sort({ timestamp: -1 });

    // const shouldLog = !lastHistory || (new Date() - lastHistory.timestamp) > 15 * 60 * 1000;

    // if (shouldLog) {
    //   await RoomHistory.create({
    //     roomId: room._id,
    //     occupancy: count,
    //     timestamp: new Date()
    //   });
    // }

    // 5. REAL-TIME NOTIFICATION (WebSockets)
    // We get the 'io' instance we attached in server.js
    const io = req.app.get('socketio');
    notifyRoomUpdate(io, room);

    res.json({ success: true, room: room.name, isGhost });

  } catch (error) {
    console.error("❌ updateRoomStatus Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

/**
 * 👤 CALLED BY: React Frontend
 * ROUTE: GET /api/rooms
 */
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().select('roomId name liveStatus type capacity');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

/**
 * 👤 CALLED BY: React Frontend (Detail View)
 * ROUTE: GET /api/rooms/:id
 */
export const getRoomDetails = async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.id });
    if (!room) return res.status(404).json({ error: "Room not found" });

    // Fetch Live Schedule from Google
    const schedule = await getRoomSchedule(room.googleCalendarId);

    res.json({ ...room.toObject(), schedule });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};