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
// const port = process.env.PORT || process.env.NODE_PORT || 5020;
const port = 5020;
// const dbURI = process.env.MONGODB_URI;
const dbURI = "mongodb+srv://tarnav:Flashtf@simplemodel.ubnc1gf.mongodb.net/FeedbackArcade";

//Handlebars server implementation
app.use(cors({
    origin: 'http://feedback-arcade.s3-website.us-east-2.amazonaws.com'  
}));

// Setting up Handlebars as the view engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Serve static files from public directory ( Only being used for handlebars )
app.use(express.static('public'));

app.get('/banner', (req, res) => {
    res.render('bannerAd', {
        imageSrc: '/banner.jpeg' 
    });
});


const userRoutes = require("./routes/route");

mongoose.connect(dbURI)
    .then(() => console.log('Database connected successfully'))
    .catch((err) => console.error('Database connection error:', err));


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
    app.use(cors());
    app.use(express.json());

    app.use(helmet());
    app.use(compression());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.use(session({
        key: 'sessionid',
        store: new RedisStore({ client: redisClient, }),
        secret: 'GameStore',
        resave: false,
        saveUninitialized: false,
    }));

    app.use("/api", userRoutes);


    app.listen(port, (err) => {
        if (err) {
            throw err;
        }
        console.log(`Listening on port ${port}`);
    });

});




