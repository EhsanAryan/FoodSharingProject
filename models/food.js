import mongoose from "mongoose";

const foodSchema = mongoose.Schema({
    name: {
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
        required: true
    },
});

const Food = mongoose.models.Food || mongoose.model("Food", foodSchema);

export default Food;