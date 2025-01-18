const mongoose = require("mongoose");

const { Schema } = mongoose;

const replySchema = new Schema({
    text: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

const commentSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    articleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
        required: true
    },
    replies: [replySchema]
}, { timestamps: true });

module.exports = mongoose.model("Comment", commentSchema);
