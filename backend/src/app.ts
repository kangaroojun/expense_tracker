// src/app.ts
import express from 'express';
import cors from 'cors';
import accountRoutes from './routes/account.route';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Register account-related routes
app.use('/account', accountRoutes);

app.get('/', (req, res) => {
  res.send('🚀 Dumb Ideas API is running');
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});

export default app;