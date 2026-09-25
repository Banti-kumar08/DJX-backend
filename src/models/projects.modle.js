import mongoose, { Schema } from "mongoose";


const projectSchema = new Schema({
    title: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});

export const Project = mongoose.model("Project", projectSchema);