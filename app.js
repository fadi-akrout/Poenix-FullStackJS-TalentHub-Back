require('dotenv').config()
require('express-async-errors')

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cors = require('cors');
const corsOptions = require('./config/corsOptions')

const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const accountStatsRoute = require("./routes/accountStatsRoute");



//const session = require('express-session');
const app = express();
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "PUT", "DELETE", "PATCH", "POST"],
    credentials: true,

}));
//app.use(cors(corsOptions))

//app.options('*', cors());



/* app.use(session({
    secret: 'secret', // Change this to a random string
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));*/

var usersRoutes = require('./routes/UserRoute');
var userRoutes = require('./routes/UserRoutes');
//const userModel = require( './models/User' ); 
var indexRouter = require('./routes/index');
var evenementsRoutes = require('./routes/EvenementRoute');
var offersRoutes = require('./routes/OfferRoute');
var staffRoute = require('./routes/StaffRoute');

var recruitersRoutes = require('./routes/RecruiterRoutes');


const StudentRoutes = require('./routes/StudentRoute');
const AlumniRoutes = require('./routes/AlumniRoute');


//const { loggers } = require('./middleware/logger')

const port = process.env.PORT || 5000; // Change 3500 to another port number

console.log(process.env.NODE_ENV)


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

//app.use(logger('dev'));
//app.use(express.urlencoded({ extended: false }));
//app.use(express.static(path.join(__dirname, 'public')));




app.use(logger)


app.use(express.json())

app.use(cookieParser())

app.use('/students', StudentRoutes);
app.use('/alumnis', AlumniRoutes);
app.use('/evenements', evenementsRoutes);
app.use('/staff', staffRoute);


//app.use('/users', usersRoutes)
//app.use('/api/user', userRoutes)
app.use('/offers', offersRoutes)


app.use('/stat', accountStatsRoute)

app.use('/recruiters', recruitersRoutes);






//import database

var configDB = require('./mongodb.json');
//mongo config
const connect = mongoose.connect(configDB.mongo.uriDevops);

require('./models/Staff')

require('./models/Student')
require('./models/Alumni')
require('./models/Evenement')
require('./models/User')



require('./models/Recruiter')

require('./models/Offer')





/* 


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');



app.use('/', indexRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error'); 
  });

 */

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))
app.use('/users', require('./routes/UserRoute'))
app.use('/notes', require('./routes/noteRoutes'))
app.use('/auth', require('./routes/authRoutes'))


app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})



app.use(errorHandler)

/* 
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

*/

module.exports = app;