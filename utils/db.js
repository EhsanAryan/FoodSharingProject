import mongoose from "mongoose";

const connect = async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/food");
}

const close = async () => {
    await mongoose.connection.close();
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