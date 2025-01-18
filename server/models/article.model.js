const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // Reference to User model
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"  // Reference to Comment model
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"  // References to User model who liked this article
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model("Article", articleSchema);
