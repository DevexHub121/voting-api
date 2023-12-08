const express = require("express");
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}))
const cors = require('cors');
const connectDB = require("./db/conn")
const PORT = process.env.PORT || 5000;

const userRoutes = require("./routes/userRoutes")
const voteRoutes = require("./routes/voteRoutes")
const allowedOrigins = [
 " https://voting-app-2015d.web.app",
 'https://voting-app-2015d.firebaseapp.com',
];
app.use(cors({
    origin: allowedOrigins,
    optionsSuccessStatus: 200,
  }));
app.use("/api/user", userRoutes);
app.use("/api/votes", voteRoutes);

const start = async()=>{
  try{
    await connectDB(process.env.DATABASE_ATLAS)
    app.listen(PORT, () =>{
      console.log(`${PORT} yes i am connected`);
    });
  } catch (error) {
    console.log(error)
  }
}

start();