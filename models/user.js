import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: null
    },
    is_admin: {
        type: Number,
        required: true,
        default: 0
    },
    favorites: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Food", // Reference to the Food model
        default: []
    },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;