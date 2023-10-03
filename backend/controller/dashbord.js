import Dashbord from "../model/dbSchema.js";
import data from "../data.js";
import { response } from "express";
export const addData = async (req, res) => {
  try {
    const data = await Dashbord.create(req.body);
    if (data) {
      return res
        .status(201)
        .json({ message: "Data added successfully", data: data });
    } else {
      return res.json({ message: "Failed to add" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const insertMany = async (req, res) => {
  const result = await Dashbord.insertMany(data);
  if (result) {
    res.status(202).json({ data: result });
  }
};

export const getData = async (req, res) => {
  const data = await Dashbord.find();
  if (data) {
    res.status(200).json({ dashbord: data });
  }
};
