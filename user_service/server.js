import express from 'express';
import dotenv from "dotenv";
import router from './routes/userRoutes.js';

dotenv.config();
const app = express();
const PORT= process.env.PORT;
app.use(express.json())


app.use("/api/users",router)


app.listen(PORT, () => {
    console.log("hello")
})