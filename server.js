const express= require('express');
const app = express();
const mongoose =require('mongoose');
const dotenv=require('dotenv');
//import routes
const authRoute=require('./routes/auth')
dotenv.config();
//connect to db
mongoose.connect(process.env.DB_CONNECT,{useNewUrlParser:true},()=>{ console.log("connected to db")
});
//midlleware
app.use(express.json());
//route middlewares
app.use('/api/user',authRoute)
app.listen(3000)