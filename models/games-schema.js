
const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (title) => _.escape(title).trim();


const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User',
    },
    username: {
        type: String,
        required: true,
        trim: true,
    },
    review_text: {
        type: String,
        trim: true,
        required: true,
    }
});

const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        set: setName,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    genre: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        required: true,
        trim: true,
    },
    reviews: [reviewSchema],
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

gameSchema.statics.toAPI = (doc) => ({
    title: doc.title,
    rating: doc.rating,
    image: doc.image,
    genre: doc.genre,
});

module.exports = mongoose.model('Game', gameSchema);


const GameModel = mongoose.model('Game', gameSchema);

module.exports = GameModel;