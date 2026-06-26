import express from "express";
import { addIncome, getIncomes, updateIncome, deleteIncome, downloadIncomeExcel, getIncomeOverview } from "../controllers/incomeConteoller.js";
import authMiddleware from "../middleware/auth.js";
import { get } from "mongoose";

const incomeRouter = express.Router();

incomeRouter.post("/add", authMiddleware, addIncome);
incomeRouter.get("/get", authMiddleware, getIncomes);

incomeRouter.put("/update/:id", authMiddleware, updateIncome);
incomeRouter.get("/downloadExcel", authMiddleware, downloadIncomeExcel);

incomeRouter.delete("/delete/:id", authMiddleware, deleteIncome);
incomeRouter.get("/overview", authMiddleware, getIncomeOverview);

export default incomeRouter;