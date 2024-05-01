const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const gamesController = require('../controllers/games-controller');

// Routes for AUTH operations
router.post('/login', userController.login);
router.post('/register', userController.register);

// Routes for Games
router.get('/games', gamesController.getGames);
router.get('/games/:id', gamesController.getSingleGame);
router.post('/games', gamesController.addGame);
router.post('/games/:id/reviews', gamesController.addGameReview);
router.delete('/games/:id', gamesController.deleteGame);
//router.get('/games/search', gamesController.searchGames);
router.post('/user/find', userController.validateUser);
router.put('/user/change-password', userController.updatePassword);


module.exports = router;
