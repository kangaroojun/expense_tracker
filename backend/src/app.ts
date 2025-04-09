// src/app.ts
import express from 'express';
import cors from 'cors';
import accountRoutes from './routes/account.route';
import ideaRoutes from './routes/idea.route';
import imageRoutes from './routes/image.route';
import { authenticateToken } from './middleware/auth.middleware';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Register account-related routes
app.use('/account', accountRoutes);

// Register idea-related routes
app.use('/idea', authenticateToken, ideaRoutes);

// Register image-related routes
app.use('/image', imageRoutes);

app.get('/', (req, res) => {
  res.send('🚀 Dumb Ideas API is running');
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});

export default app;