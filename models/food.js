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
    category: {
        type: String,
        required: true,
        enum: ["B", "M", "A"], // Before, Main, After
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
});

const Food = mongoose.models.Food || mongoose.model("Food", foodSchema);

export default Food;