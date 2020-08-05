const mongoose = require('mongoose')

const AnswerSchema = new mongoose.Schema({
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true
    },
    vote: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

})

module.exports = mongoose.model("Answer", AnswerSchema)