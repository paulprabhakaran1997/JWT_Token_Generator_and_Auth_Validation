const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')

dotenv.config();
app.use(cookieParser());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL).then(() => console.log("Mongo DB Connected...!!!")).catch(err => console.log(err))

// Routes

app.use('/api/user',authRoutes);


app.listen(process.env.PORT,() =>{
    console.log("Server Running...!")
})