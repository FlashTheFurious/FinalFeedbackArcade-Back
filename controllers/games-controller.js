const Game = require('../models/games-schema');


const addGame = async (req, res) => {
    console.log("In add game")
    const { title, genre, image, description } = req.body;
    console.log(req.body, "body");
    if (!title || !genre || !description || !image) {
        return res.status(400).json({ error: 'title, genre, image, description are required!' });
    }
    const gameData = {
        title,
        genre,
        image,
        description,
    };

    try {
        const newGame = new Game(gameData);
        await newGame.save();
        return res.status(201).json({ title: newGame.title, genre: newGame.genre, image: newGame.image, description: newGame.description });
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Game already exists!' });
        }
        return res.status(500).json({ error: 'An error occurred adding G=game!' });
    }
};

const getGames = async (req, res) => {
    try {

        const games = await Game.find();
        return res.json({ games });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving games!' });
    }
};

const deleteGame = async (req, res) => {
    try {
        await Game.deleteOne({ _id: req.params.id });
        return res.status(200).json({ message: 'Game deleted successfully!' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error deleting game' });
    }
};

const getSingleGame = async (req, res) => {
    try {
        const game = await Game.findOne({ _id: req.params.id });
        return res.json({ game });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving game!' });
    }
};

const addGameReview = async (req, res) => {
    try {
        const game = await Game.findOne({ _id: req.params.id });
        if (!game) {
            return res.status(404).json({ error: 'Game not found!' });
        }

        const { review_text, userId, username } = req.body;
        if (!review_text || !userId || !username) {
            return res.status(400).json({ error: 'review_text, userId, and username are required!' });
        }

        game.reviews.push({ userId, username, review_text });
        await game.save();
        
        return res.status(201).json({ game });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error adding review!' });
    }
};

const searchGames = async (req, res) => {
    try {
        const searchTerm = req.query.q; // Get the search term from query parameter 'q'
        const games = await Game.find({ title: { $regex: new RegExp(searchTerm, 'i') } });
        res.json({ games });
    } catch (error) {
        console.error('Error searching games:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = searchGames;

module.exports = searchGames;


module.exports = addGameReview;


module.exports = {
    addGame,
    getGames,
    getGames,
    deleteGame,
    getSingleGame,
    addGameReview,
};
