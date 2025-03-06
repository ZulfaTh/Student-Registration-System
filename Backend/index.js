require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes=require('./routes/users');
const authRoutes=require('./routes/auth');

//middlewares
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.DB_URL)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Welcome to the Student Management System');
});

// Set port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

//routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

