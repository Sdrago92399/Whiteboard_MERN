const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    boardTitle: {
        type: String,
        required: [true, "board title is required"],
    },
    // boardDescription: {
    //     type: String,
    //     required: [true, "board description is required"],
    // },
    boardElements: mongoose.Schema.Types.Mixed,
    members: [{
        memberId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        lastAccessedAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Board", boardSchema);