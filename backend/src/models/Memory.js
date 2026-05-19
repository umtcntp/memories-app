const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        type: {
            type: String,
            enum: ["photo", "video", "note", "audio", "music", "special_day"],
            required: true,
        },

        driveFileId: {
            type: String,
            default: "",
            trim: true,
        },

        date: {
            type: Date,
        },

        tags: {
            type: [String],
            default: [],
        },

        isFavorite: {
            type: Boolean,
            default: false,
        },
        duration: {
            type: String,
            default: "",
            trim: true,
        },

        artist: {
            type: String,
            default: "",
            trim: true,
        },

        location: {
            type: String,
            default: "",
            trim: true,
        },

        coverImageFileId: {
            type: String,
            default: "",
            trim: true,
        },
        externalUrl: {
            type: String,
            default: "",
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Memory = mongoose.model("Memory", memorySchema);

module.exports = Memory;