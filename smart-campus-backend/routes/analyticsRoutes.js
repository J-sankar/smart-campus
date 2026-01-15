import express from 'express';
import { generateRoomInsights } from '../services/geminiService.js';

const router = express.Router();

router.get('/insight/:roomId', async (req, res) => {
  const { roomId } = req.params;
  
  console.log(`🤖 Generating AI insights for Room ${roomId}...`);
  const insight = await generateRoomInsights(roomId);
  
  res.json(insight);
});

export default router;