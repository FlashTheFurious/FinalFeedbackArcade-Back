require('dotenv').config();
const express = require("express");
const redis = require('redis');
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require('compression');
const helmet = require('helmet');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const bodyParser = require('body-parser');
const path = require('path');
// const port = process.env.PORT || process.env.NODE_PORT || 5020;
const port = 5020;
// const dbURI = process.env.MONGODB_URI;
const dbURI = "mongodb+srv://tarnav:Flashtf@simplemodel.ubnc1gf.mongodb.net/FeedbackArcade";
const { engine } = require('express-handlebars');

const redisClient = redis.createClient({
    password: 'H5PDBY74Evo9khdv81GVuB1rDpT9CFDz',
    socket: {
        host: 'redis-14955.c241.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 14955
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));


redisClient.connect().then(() => {
    const app = express();

    // Cors setup - WAS A PROBLEM
    /*
    app.use(cors({
        origin: 'http://feedback-arcade.s3-website.us-east-2.amazonaws.com'  
    }));
    */

    app.use(cors());
    
    // Middlewares
    app.use(helmet());
    app.use(compression());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Session handling
    app.use(session({
        key: 'sessionid',
        store: new RedisStore({ client: redisClient }),
        secret: 'GameStore',
        resave: false,
        saveUninitialized: false,
    }));

    // Handlebars setup
    app.engine('handlebars', engine({ defaultLayout: '' }));
    app.set('view engine', 'handlebars');
    app.set('views', path.join(__dirname, 'views'));

    // Serve static files
    app.use(express.static(path.join(__dirname, 'public')));

    // Routes
    app.get('/banner', (req, res) => {
        res.render('bannerAd', { imageSrc: '/banner.jpeg' });
    });

    // Other routes here
    const userRoutes = require("./routes/route");
    app.use("/api", userRoutes);

    // Start the server
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

    // Connect to MongoDB
    mongoose.connect(dbURI)
        .then(() => console.log('Database connected successfully'))
        .catch((err) => console.error('Database connection error:', err));
}).catch((err) => {
    console.error('Failed to connect to Redis:', err);
});