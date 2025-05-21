import express from "express";
import dotenv from "dotenv";
import bookRouter from "./routes/bookRoutes.js";

dotenv.config();
const app= express();
app.use(express.json());
const PORT= process.env.PORT;

app.use("/api/books", bookRouter);

app.listen(PORT, ()=>{
    console.log(`${PORT}`)
})

