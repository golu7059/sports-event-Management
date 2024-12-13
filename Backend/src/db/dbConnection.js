import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Ensure no leading slash in the database name
        const dbName = process.env.DB_NAME;
        const connectionString = `${process.env.MONGODB_URI}${dbName}`;

        const connectionInstance = await mongoose.connect(connectionString);

        console.log(
            `MongoDB connected! Host: ${connectionInstance.connection.host}, Database: ${connectionInstance.connection.name}`
        );
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1); // Exit the application on connection failure
    }
};

export default connectDB;
