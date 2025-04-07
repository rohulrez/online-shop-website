const path = require('path');
const express = require('express');
const csrf = require('csurf');
const expressSession = require('express-session')


const creatSessionConfig = require('./config/session')
const db = require('./data/database')
const addCsrfTokenMiddleware = require('./middlewares/csrf-token');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const checkAuthStatusMiddleware = require('./middlewares/check-auth')
const authRoutes = require('./routes/auth-routes');

const productsRoutes = require('./routes/products.routes');
const baseRoutes = require('./routes/base.routes');

const { error } = require('console');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

app.use(expressSession(creatSessionConfig()));

app.use(csrf());

app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);
app.use(errorHandlerMiddleware);

app.use(productsRoutes);

app.use(baseRoutes);
app.use(authRoutes);

db.connectToDatabase()
.then(() => {
    app.listen(3000);
})
.catch( (error) => {
    console.log('Failed to connect to the database!');
    console.log(error);
});
