import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import aiRoutes from './routes/ai.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.get('/', (req, res) => {
  res.json({ message: 'CodePix API' });
});

app.use('/api/ai', aiRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
