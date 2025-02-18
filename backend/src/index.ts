import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import calculatorRoutes from './routes/calculatorRoutes';

dotenv.config();




const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());


// Route endpoints
app.use('/api/auth', authRoutes);
app.use('/api/calculator', calculatorRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));