import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
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
    images: {
        type: [String], // An array of strings
        required: true,
        validate: {
            validator: function (v) {
                return v.length <= 4;
            },
            message: props => `${props.value} exceeds the limit of 4 images.`
        }
    },
    likes: {
        type: Number,
        required: true,
        default: 0,
        validate: {
            validator: function (v) {
                return v >= 0;
            },
            message: props => `Number of likes (${props.value}) Can't be negative.`
        }
    },
    category: {
        type: String,
        required: true,
        enum: ["B", "M", "A"], // Valid values for this field (B: Before, M: Main, A: After)
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true,
    },
}, { timestamps: true });

const Food = mongoose.models.Food || mongoose.model("Food", foodSchema);

export default Food;