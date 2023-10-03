import express from "express";
import { addData, getData, insertMany } from "../controller/dashbord.js";
const dashbordRoute = express.Router();

dashbordRoute.post("/addata", addData);
dashbordRoute.get("/insermany", insertMany);
dashbordRoute.get("/getdata", getData);
export default dashbordRoute;
