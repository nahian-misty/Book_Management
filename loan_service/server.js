import express from "express";
import dotenv from "dotenv";
import loanRouter from "./routes/loanRoutes.js";
import { connectDb } from "./DB/connectDB.js";

dotenv.config();
const app= express();
const PORT= process.env.PORT;
app.use(express.json());

app.use("/api/loans",loanRouter)

app.listen(PORT,()=>{
    console.log("running")
    connectDb();
})