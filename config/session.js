const session = require('express-session');
const mongoDbStore = require('connect-mongodb-session');

const MongoDbStore = mongoDbStore(session); 


createSessionStore = () => {

    const store = new MongoDbStore({
        uri: 'mongodb://localhost:27017',
        databaseName: 'online-shop',
        collection:'sessions'
    });
    return store;
};

creatSessionConfig = () => {
    return {
        secret: 'super-secret',
        resave: false,
        saveUninitialized: false,
        store: createSessionStore(),
        cookie: {
            maxAge: 2 * 24 * 60 * 60 * 1000
        }
    }
};

module.exports = creatSessionConfig;