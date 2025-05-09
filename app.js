const path = require('path');
const express = require('express');
const csrf = require('csurf');
const expressSession = require('express-session')


const createSessionConfig = require('./config/session')
const db = require('./data/database')
const addCsrfTokenMiddleware = require('./middlewares/csrf-token');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const checkAuthStatusMiddleware = require('./middlewares/check-auth');
const protectRoutesMiddleware = require('./middlewares/protect-routes');
const cartMiddleware = require('./middlewares/cart');
const updateCartPricesMiddleware = require('./middlewares/update-cart-prices');
const notFoundMiddleware = require('./middlewares/not-found')

const authRoutes = require('./routes/auth-routes');

const productsRoutes = require('./routes/products.routes');
const baseRoutes = require('./routes/base.routes');
const adminRoutes = require('./routes/admin.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/orders.routes');


const { error } = require('console');
const { constants } = require('buffer');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/products/assets/', express.static('product-data'));
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(express.json())

app.use(expressSession(createSessionConfig()));
app.use(csrf());

app.use(cartMiddleware);
app.use(updateCartPricesMiddleware)

app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(productsRoutes);
app.use('/cart', cartRoutes);

app.use('/orders',protectRoutesMiddleware, orderRoutes);
app.use('/admin',protectRoutesMiddleware ,adminRoutes);

app.use(notFoundMiddleware);

app.use(errorHandlerMiddleware);

db.connectToDatabase()
.then(() => {
    app.listen(3000);
})
.catch( (error) => {
    console.log('Failed to connect to the database!');
    console.log(error);
});
