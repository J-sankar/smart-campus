import React, {useEffect,useState} from "react";
import { useNavigate, } from "react-router-dom";
import ClassroomCard from "../components/ClassroomCard";
import axios from 'axios';
import socketService from "../services/socket.js";


export default function Dashboard({ role, onLogout }) {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1️⃣ Fetch Initial Data on Load
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/rooms");
        setRooms(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setError("Could not load classroom data.");
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // 2️⃣ Listen for Real-Time Updates
  useEffect(() => {
    const socket = socketService.getSocket();

    const handleUpdate = (data) => {
      setRooms((prevRooms) =>
        prevRooms.map((room) => {
          if (room.roomId === data.roomId) {
            return {
              ...room,
              liveStatus: {
                ...room.liveStatus,
                currentOccupancy: data.occupancy,
                isGhost: data.isGhost,
              },
              // Update capacity if backend sends it, otherwise keep existing
              capacity: data.capacity || room.capacity, 
            };
          }
          return room;
        })
      );
    };

    socket.on("room_update", handleUpdate);
    return () => {
      socket.off("room_update", handleUpdate);
    };
  }, []);

  // 3️⃣ Helper to determine status string based on real data
  const getStatus = (room) => {
    if (room.liveStatus?.isGhost) return "ghost";

    // 2. Get values safely
    const occupancy = room.liveStatus?.currentOccupancy || 0;
    const capacity = room.capacity || 50;

    // 3. Logic Chain
    if (occupancy === 0) {
        return "available"; // Completely empty
    } 
    else if (occupancy < capacity / 2) { 
        return "partial";   // Less than half full (1 to 24 people) -> This is "Partial"
    } 
    else {
        return "occupied";  // More than half full (25+ people) -> This is "Occupied"
    }

  };

  if (loading) return <div style={{ padding: 24 }}>Loading Campus Map...</div>;
  if (error) return <div style={{ padding: 24, color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Classrooms Available Now</h2>
        <button onClick={onLogout}>Logout</button>
      </div>

     
      <div style={styles.grid}>
        {rooms.map((room) => (
          // Pass the full room object now
          <ClassroomCard
            key={room.roomId}
            room={room}         // <-- pass full object
            status={getStatus(room)}
            onClick={() => navigate(`/room/${room.roomId}`)}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    marginTop: 24,
  },
};
