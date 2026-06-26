import expenseModel from "../models/expenseModel.js";
import getDateRange from "../utils/datefilter.js";
import XLSX from "xlsx";

//add expense
export async function addExpense(req, res) {
    const userId = req.user._id;
    const { description, amount, category, date } = req.body;
    try {
        if (!description || !amount || !category || !date) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            });
        }
        const newExpense = new expenseModel({
            userId,
            description,
            amount,
            category,
            date,
        });
        await newExpense.save();
        res.status(201).json({
            success: true,
            message: "Expense added successfully",
            expense: newExpense,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error adding expense",
            error: error.message
        });
    }
}

//get all expenses of a user
export async function getExpenses(req, res) {
    const userId = req.user._id;
    try {
        const expenses = await expenseModel.find({ userId }).sort({ date: -1 });
        res.status(200).json({
            success: true,
            message: "Expenses fetched successfully",
            expenses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching expenses",
            error: error.message
        });
    }
}

//update expense
export async function updateExpense(req, res) {
    const { id } = req.params;
    const userId = req.user._id;
    const { description, amount } = req.body;

    try {
        const updateExpense = await expenseModel.findOneAndUpdate(
            { _id: id, userId },
            { description, amount },
            { returnDocument: "after" });

        if (!updateExpense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Expense updated successfully",
            data: updateExpense
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating expense",
            error: error.message
        });
    }
}

//to delete expense
export async function deleteExpense(req, res) {
    try {
        const deleteExpense = await expenseModel.findByIdAndDelete({ _id: req.params.id });
        if (!deleteExpense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Expense deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting expense",
            error: error.message
        });
    }
}


//to Download the data in excel sheet
export async function downloadExpenseExcel(req, res) {
    const userId = req.user._id;
    try {
        const expenses = await expenseModel.find({ userId }).sort({ date: -1 });
        const plainData = expenses.map(expense => ({
            Description: expense.description,
            Amount: expense.amount,
            Category: expense.category,
            Date: expense.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
        }));

        const worksheet = XLSX.utils.json_to_sheet(plainData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "expenseModel");
        XLSX.writeFile(workbook, "expense_details.xlsx");
        res.download("expense_details.xlsx");
        res.status(200).json({
            success: true,
            message: "Expense data downloaded successfully",
            expenses
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error downloading expense data",
            error: error.message
        });
    }
}

//get total expense overview
export async function getExpenseOverview(req, res) {
    try {
        const userId = req.user._id;
        const { range = "monthly" } = req.query;
        const { start, end } = getDateRange();

        const expenses = await expenseModel.find({
            userId,
            date: { $gte: start, $lte: end }
        }).sort({ date: -1 });

        const totalExpense = expenses.reduce((acc, cur) => acc + cur.amount, 0);
        const averageExpense = expenses.length > 0 ? totalExpense / expenses.length : 0;
        const numberOfTransactions = expenses.length;
        const recentTransactions = expenses.slice(0, 5);

        res.status(200).json({
            success: true,
            message: "Expense overview fetched successfully",
            data: {
                totalExpense,
                averageExpense,
                numberOfTransactions,
                recentTransactions,
                range
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching expense overview",
            error: error.message
        });
    }

}