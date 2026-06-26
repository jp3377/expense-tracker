// import { use } from "react";
import incomeModel from "../models/incomeModel.js";
import XLSX from "xlsx";
import getDateRange from "../utils/datefilter.js";

//add income
export async function addIncome(req, res) {
    const userId = req.user._id;
    const { description, amount, category, date } = req.body;

    try {
        if (!description || !amount || !category || !date) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            });
        }

        const newIncome = new incomeModel({
            userId,
            description,
            amount,
            category,
            date,
        });

        await newIncome.save();
        res.status(201).json({
            success: true,
            message: "Income added successfully",
            income: newIncome,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error adding income",
            error: error.message
        });
    }
}

//to get all income of a user
export async function getIncomes(req, res) {
    const userId = req.user._id;

    try {
        const incomes = await incomeModel.find({ userId }).sort({ date: -1 });
        res.status(200).json({
            success: true,
            message: "Incomes fetched successfully",
            incomes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching incomes",
            error: error.message
        });
    }
}

//to update income
export async function updateIncome(req, res) {
    const { id } = req.params;
    const userId = req.user._id;
    const { description, amount } = req.body;

    try {
        const updateIncome = await incomeModel.findOneAndUpdate(
            { _id: id, userId },
            { description, amount },
            { returnDocument: "after" });

        if (!updateIncome) {
            return res.status(404).json({
                success: false,
                message: "Income not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Income updated successfully",
            data: updateIncome
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating income",
            error: error.message
        });
    }
}

//to delete income
export async function deleteIncome(req, res) {

    try {
        const deleteIncome = await incomeModel.findByIdAndDelete({ _id: req.params.id });
        if (!deleteIncome) {
            return res.status(404).json({
                success: false,
                message: "Income not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Income deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting income",
            error: error.message
        });
    }
}

//to Download the data in excel sheet
export async function downloadIncomeExcel(req, res) {
    const userId = req.user._id;
    try {
        const incomes = await incomeModel.find({ userId }).sort({ date: -1 });
        const plainData = incomes.map(income => ({
            Description: income.description,
            Amount: income.amount,
            Category: income.category,
            Date: new Date(income.date).toLocaleDateString(), 
        }));

        const worksheet = XLSX.utils.json_to_sheet(plainData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "incomeModel");
        XLSX.writeFile(workbook, "income_details.xlsx");
        res.download("income_details.xlsx");
        res.status(200).json({
            success: true,
            message: "Income data downloaded successfully",
            incomes
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error downloading income data",
            error: error.message
        });
    }
}


//to get total income overview
export async function getIncomeOverview(req, res) {
    try {
        const userId = req.user._id;
        const { range = "monthly" } = req.query;
        const { start, end } = getDateRange();

        const incomes = await incomeModel.find({
            userId,
            date: { $gte: start, $lte: end }
        }).sort({ date: -1 });


        const totalIncome = incomes.reduce((acc, cur) => acc + cur.amount, 0);
        const averageIncome = incomes.length > 0 ? totalIncome / incomes.length : 0;
        const numberOfTransactions = incomes.length;

        const recentTransactions = incomes.slice(0, 9);

        res.status(200).json({  
            success: true,
            message: "Income overview fetched successfully",
            data: {
                totalIncome,
                averageIncome,
                numberOfTransactions,
                recentTransactions,
                range
            }
        });
    }
    catch (error) { 
        res.status(500).json({
            success: false,
            message: "Error fetching income overview",
            error: error.message
        });
    }

}
