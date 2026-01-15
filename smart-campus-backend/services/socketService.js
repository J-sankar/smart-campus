/**
 * 🔌 socketService.js
 * Centralized place to handle WebSocket emissions.
 */

// Helper to standardise the event name and data structure
export const notifyRoomUpdate = (io, roomData) => {
  if (!io) return;

  // We emit to a specific event that the Frontend listens to
  io.emit('room_update', {
    roomId: roomData.roomId,
    occupancy: roomData.liveStatus.currentOccupancy,
    capacity: roomData.capacity,
    isGhost: roomData.liveStatus.isGhost,
    lastUpdated: roomData.liveStatus.lastUpdated
  });
  
  console.log(`📡 Socket emitted update for Room ${roomData.roomId}`);
};

export const notifyAlert = (io, message) => {
  if (!io) return;
  io.emit('global_alert', { message });
};