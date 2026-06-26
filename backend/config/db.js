import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect("mongodb://pateljaya1607_db_user:pateljaya1607_db_user@ac-bcpueuc-shard-00-00.jl5607b.mongodb.net:27017,ac-bcpueuc-shard-00-01.jl5607b.mongodb.net:27017,ac-bcpueuc-shard-00-02.jl5607b.mongodb.net:27017/ExpenseTrackerDB?ssl=true&replicaSet=atlas-fm8caq-shard-0&authSource=admin&appName=Cluster0")
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch((error) => {
            console.error("Error connecting to MongoDB:", error);
        });
}