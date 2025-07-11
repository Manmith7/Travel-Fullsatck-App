import express from 'express'
import HomeRoute from './routes/home.routes.js'
import AuthRoutes from './routes/auth.routes.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv'
dotenv.config();
const app = express();

app.use(express.json())

connectDB();

app.use('/',HomeRoute);
app.use('/auth',AuthRoutes)
app.listen(8000,()=>{
    console.log('Server Listening on 8000');
})