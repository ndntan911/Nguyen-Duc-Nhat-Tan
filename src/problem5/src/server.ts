import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import itemRoutes from './routes/itemRoutes';

// Load Environment variables theoretically
// import dotenv from 'dotenv';
// dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Default Route
app.get('/', (req, res) => {
    res.send('Welcome to the Item API Server');
});

// API Routes
app.use('/api', itemRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running strongly on port ${PORT}`);
});
