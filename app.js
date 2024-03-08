var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const session = require('express-session');
const app = express();


app.use(session({
    secret: 'secret', // Change this to a random string
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));



//var usersRoutes = require('./routes/UserRoute');
//var userRoutes = require('./routes/UserRoutes');
const userModel = require( './models/User' ); 
var indexRouter = require('./routes/index');
var evenementsRoutes = require('./routes/EvenementRoute');
var offersRoutes = require('./routes/OfferRoute');
var staffRoute = require('./routes/StaffRoute');

var recruitersRoutes = require('./routes/RecruiterRoutes');


const CandidateRoutes = require('./routes/CandidateRoute');


require('dotenv').config()
    //const { loggers } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const corsOptions = require('./config/corsOptions')

const port = process.env.PORT || 3500; // Change 3500 to another port number

console.log(process.env.NODE_ENV)


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
    origin:  ["http://localhost:5173"],
    methods: ["GET", "POST","PUT","PATCH","PUT","DELETE"],
    credentials: true
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

app.use('/candidates', CandidateRoutes);
app.use('/evenements', evenementsRoutes);
app.use('/staff', staffRoute);


// app.use('/users', usersRoutes)
// app.use('/api/user', userRoutes)
 app.use('/offers', offersRoutes)
// app.use('/auth', require('./routes/UserRoutes'))




app.use('/recruiters', recruitersRoutes);






//import database
var mongoose = require('mongoose');
var configDB = require('./mongodb.json');
//mongo config
const connect = mongoose.connect(configDB.mongo.uri);

require('./models/Staff')

require('./models/Candidate')
require('./models/Evenement')
///require('./models/User')



require('./models/Recruiter')

require('./models/Offer')




// connexion base sur role
app.post('/register', (req, res) => { 
    const { name, email, password, role } = req.body;
    const allowedRoles = ['Admin','Recruter', 'Student', 'Teacher', 'Alumni'];
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
    }

    bcrypt.hash(password, 10)
        .then(hash => {
            userModel.create({ name, email, password: hash, role })
                .then(user => res.json("Success"))
                .catch(err => res.json(err))
        }).catch(err => res.json(err))
});


app.post('/Loginn', (req, res) => {
    const { email, password } = req.body;
    userModel.findOne({ email: email })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, (err, response) => {
                    if (response) {
                        const token = jwt.sign({ email: user.email, role: user.role }, "jwt-secret-key", { expiresIn: '10s' });
                        req.session.user = { email: user.email, role: user.role }; // Store user info in session
                        res.cookie('token', token);
                        return res.json({ Status: "Success", role: user.role });
                    } else {
                        return res.json("the password is incorrect");
                    }
                });
            } else {
                return res.json("No record existed");
            }
        });
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');



app.use('/', indexRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error'); 
  });




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

//app.listen(PORT, () => console.log(`Server running on port ${PORT}`))=======



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