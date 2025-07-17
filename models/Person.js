import mongoose from "mongoose";

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    age: {
        type: Number,
        required: true,
        min: 0,
        max: 120
    },
    userOrder:{
        type:Object,
        default: {}
    }
}, {timestamps: true, minimize: false});
export const Person = mongoose.model('Person', personSchema);