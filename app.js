var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');


var usersRoutes = require('./routes/UserRoute');
var userRoutes = require('./routes/UserRoutes');

var indexRouter = require('./routes/index');
var evenementsRoutes = require('./routes/EvenementRoute');
var offersRoutes = require('./routes/OfferRoute');


require('dotenv').config()
//const { loggers } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const corsOptions = require('./config/corsOptions')
const PORT = process.env.PORT || 3001

console.log(process.env.NODE_ENV)
var app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
    origin: 'http://localhost:5173' // Autorise seulement l'accès de cette origine
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var port = process.env.PORT || 3500; // Utilisez le port fourni par l'environnement ou 3500 si aucun port n'est fourni
app.listen(port, function() {
    console.log('Server listening on port ' + port);
});


//app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())


app.use('/evenements', evenementsRoutes);
app.use('/users', usersRoutes)
app.use('/api/user',userRoutes)
app.use('/offers', offersRoutes)


//import database
var mongoose = require('mongoose');
var configDB = require('./mongodb.json');
//mongo config
const connect = mongoose.connect(configDB.mongo.uri);



require('./models/Evenement')
require('./models/User')
require('./models/offer')


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');



app.use('/', indexRouter);




//app.use('/', express.static(path.join(__dirname, 'public')))

//app.use('/', require('./routes/root'))


/* app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})
 */
app.use(errorHandler)

//app.listen(PORT, () => console.log(`Server running on port ${PORT}`))


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



module.exports = app;