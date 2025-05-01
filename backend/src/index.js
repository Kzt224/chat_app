import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import cors from "cors";
import dotenv from "dotenv";
import {connectDB} from "./lib/db.js";
import cookieParser from "cookie-parser";
import { app,server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json({limit: "50mb"}));
app.use(cookieParser());
app.use(express.urlencoded({limit: "50mb",extended: true}));

app.use('/api/auth',authRoutes);
app.use('/api/messages',messageRoute);


server.listen(PORT,() => {
    console.log("app running on port 5000");
    connectDB();
});