import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food", // Reference to the Food model
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);

export default Comment;