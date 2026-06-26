import express from "express";
import { addExpense, getExpenses, updateExpense, deleteExpense, downloadExpenseExcel, getExpenseOverview } from "../controllers/expenseController.js";
import authMiddleware from "../middleware/auth.js";

const expenseRouter = express.Router();

expenseRouter.post("/add", authMiddleware, addExpense);
expenseRouter.get("/get", authMiddleware, getExpenses);

expenseRouter.put("/update/:id", authMiddleware, updateExpense);
expenseRouter.get("/downloadExcel", authMiddleware, downloadExpenseExcel);

expenseRouter.delete("/delete/:id", authMiddleware, deleteExpense);
expenseRouter.get("/overview", authMiddleware, getExpenseOverview);

export default expenseRouter;
