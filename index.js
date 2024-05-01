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

let eslintHappyCounter = 0;

function makeEslintHappy(formalityVariable){
  eslintHappyCounter + formalityVariable;
}

const redisClient = redis.createClient({
    url:"redis://default:CDvxaAEdapf7aI2LqJx8L9okB7slAMmk@redis-10505.c11.us-east-1-2.ec2.cloud.redislabs.com:10505"
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

    // Another attempt to solve CORS for the static image file
    const setCustomCacheControl = (res, path) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); // Allow resources to be accessed by different origins
        makeEslintHappy(path);
    }
    
    app.use('/static', express.static('public', {
        setHeaders: setCustomCacheControl
    }));
    
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

    // Static files
    app.use('/static', express.static('public'));

    // Serve static files
    app.use(express.static(path.join(__dirname, 'public'), {
        setHeaders: (res, path, stat) => {
            res.set('Access-Control-Allow-Origin', '*');
            res.set('Cross-Origin-Resource-Policy', 'cross-origin');
            makeEslintHappy(path);
            makeEslintHappy(stat);
        }
    }));

    //console.log("Right before banner");
    // Routes  ----- JUST added "/api" as a prefix to the route below to test the change.
    app.get('/api/banner', (req, res) => {
        res.render('bannerAd', { imageSrc: 'http://3.141.177.7:5020/banner.jpeg' });
    });

    // Other routes here
    const userRoutes = require("./routes/route");
    app.use("/api", userRoutes);

    // Middleware for 404 Not Found
    app.use((req, res, next) => {
    res.status(404).send('Page Not Found');
    makeEslintHappy(next);
    });
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