const express = require('express');
const app = express();
const routes = require('./routes');

const jsonParser = require('body-parser').json;
const bodyParser = require('body-parser')

const logger = require('morgan');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const users = require('./routes');
const courses = require('./routes');
const reviews = require('./routes');

const mid = require('./middleware');

app.use(logger('dev'));
app.use(jsonParser());

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);


// connect to the Mongo DB server.
mongoose.connect('mongodb://localhost:27017/rest', { useMongoClient: true });
const db = mongoose.connection;

// Connection Error
db.on('error', function(err) {
  console.error('connection error:', err.message);
});

// First time Event Handler
db.once('open', function() {
  console.log('db connection successful');
  if (process.env.NODE_ENV != 'production') {
    const seeder = require('mongoose-seeder');
    const data = require('./src/data/data.json');
    seeder
      .seed(data, {dropDatabase: true})
      .then(function(dbData) {
      })
      .catch(function(err) {
        // handle  the error
        console.log(err);
      });
  }
});


// express session
app.use(session({
  secret: 'who killed bambis mum',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.use('/api', routes);

// catch 404
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log('Express server is listening on port', port);
});

module.exports = app;
