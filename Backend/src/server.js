import express from "express";
import cors from "cors"
import dotenv from "dotenv";
// const express = require("express");
// const { exec } = require("child_process");

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(express.json());
// app.use(urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static('public'))


import router from "./routes/simulations.routes.js"
app.use(router);
// app.post("/simulate/jt", (req, res) => {
//   const { P1, P2, T, dt, totalTime } = req.body;
//   // const command = `jt_sim.exe ${P1} ${P2} ${T} ${dt} ${totalTime}`;
//   const command = `D:\\GitHub\\ThermoLabs\\Backend\\src\\jt_sim.exe ${P1} ${P2} ${T} ${dt} ${totalTime}`;

//   exec(command, (error, stdout, stderr) => {
//     if (error) {
//       return res.status(500).json({ error: stderr });
//     }

//     // Convert output into structured data
//     const lines = stdout.split("\n");

//     let data = [];
//     for (let i = 1; i < lines.length; i++) {
//       const parts = lines[i].trim().split(/\s+/);
//       if (parts.length === 3) {
//         data.push({
//           time: parseFloat(parts[0]),
//           pressure: parseFloat(parts[1]),
//           temperature: parseFloat(parts[2]),
//         });
//       }
//     }

//     res.json({
//       success: true,
//       data,
//     });
//   });
// });

dotenv.config({path: './env'})

//db connection pending
// connectDB()
// .then(()=>{
//     app.listen(process.env.PORT || 8000, ()=>{
//         console.log(`Server is running at port : ${process.env.PORT}`)
//     })
// })
// .catch((err)=>{
//     console.log("MongoDB connection Failed!", err)
// })

app.listen(8000, () => {
  console.log("Server running on port: 8000");
});