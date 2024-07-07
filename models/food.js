import mongoose from "mongoose";

const foodSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    instruction: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ["B", "M", "A"], // Before, Main, After
    },
});

const Food = mongoose.models.Food || mongoose.model("Food", foodSchema);

export default Food;