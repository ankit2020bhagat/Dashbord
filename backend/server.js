import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import dashbordRoute from "./route/dashbordRoute.js";
import cors from "cors";
dotenv.config();
const PORT = process.env.PORT || 8080;
const app = express();
connectDB();
app.use(express.json());
app.use("/dashbord", dashbordRoute);
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server listeninig on PORT ", PORT);
  }
});
