import mongoose from "mongoose";

const connect = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/food", {
            serverSelectionTimeoutMS: 7000, // 7 seconds
        });
        // console.log("======================");
        // console.log("Connected to the database");
        // console.log("======================");
    } catch (error) {
        // console.log("======================");
        // console.log(error);
        // console.log("======================");
    }
}

const close = async () => {
    // await mongoose.connection.close();
    await mongoose.disconnect();
}

const convertToObject = (doc) => {
    doc._id = doc._id.toString();
    return doc;
}

const db = {
    connect,
    close,
    convertToObject
};

export default db;