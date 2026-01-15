import express from 'express';
import cors from 'cors';
import roomRoutes from './routes/roomRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js'

// Initialize Express
const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // Allow your React Frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('🚀 Smart Campus Backend is Running...');
});

// Mount Routes
app.use('/api/rooms', roomRoutes);
app.use('/api/analytics', analyticsRoutes);

export default app;