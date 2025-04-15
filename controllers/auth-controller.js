const session = require("express-session");
const User = require("../models/user.model");
const authUtil = require('../util/authentication');

const sessionFlash = require('../util/session-flash')

const validation = require('../util/validation')

function getSignup (req, res) {
    let sessionData = sessionFlash.getSessionData(req);
    if(!sessionData) {
        sessionData = {
            email: '',
            confirmEmail : '',
            password: '',
            fullname: '',
            street: '',
            postal: '',
            city: ''
        }
    }
    res.render('customer/auth/signup', {inputData: sessionData});
};

async function signup(req, res, next) {
    const enteredData = {
        email: req.body.email, 
        confirmEmail: req.body['confirm-email'],
        password: req.body.password, 
        fullname: req.body.fullname, 
        street: req.body.street, 
        postal: req.body.postal,  
        city: req.body.city
    };

    if(!validation.userDetailsAreValid(
        enteredData.email, 
        enteredData.password, 
        enteredData.fullname, 
        enteredData.street, 
        enteredData.postal, 
        enteredData.city
    ) || !validation.emailIsConfirmed(enteredData.email, enteredData.confirmEmail)
    ) {
        await sessionFlash.flashDataToSession(req, {
            errorMessage: 'Please check your input!', 
            ...enteredData
        });
        return res.redirect('/signup');
    }

    const user = new User(
        enteredData.email, 
        enteredData.password, 
        enteredData.fullname, 
        enteredData.street, 
        enteredData.postal, 
        enteredData.city
    );

    try {
        const existsAlready = await user.existsAlready();
        if(existsAlready) {
            await sessionFlash.flashDataToSession(req, {
                errorMessage: 'User exists already!',
                ...enteredData
            });
            return res.redirect('/signup');
        }

        await user.signup();
        return res.redirect('/login');
    } catch(error) {
        next(error);
    }
}

function getLogin (req, res) {
    let sessionData = sessionFlash.getSessionData(req);

    if(!sessionData) {
        sessionData = {
            email: '',
            password: '', 
        }
    }
    res.render('customer/auth/login', {inputData: sessionData})
}

async function login (req, res, next) {
    const user = new User(
        req.body.email, 
        req.body.password
    );

    let existingUser;

    try{
        existingUser = await user.getUserWithSameEmail();
    } catch(error) {
        next(error);
        return;
    }
   
    const sessionErrorData = {
        errorMessage: 'Invalid Credentials - please check your email and password!',
        email: user.email,
        password: user.password
    }
       
    if(!existingUser) {
        sessionFlash.flashDataToSession(req, sessionErrorData, () => {
            res.redirect('/login');
        })
        
        return;
    };

    const passwordIsCorrect = await user.hasMatchingPassword(existingUser.password)

    if(!passwordIsCorrect) {
        sessionFlash.flashDataToSession(req, sessionErrorData, () => {
            res.redirect('/login');
        })
        return;
    }

    authUtil.createUserSession(req, existingUser, () => {
        res.redirect('/');
    });
    };


function logout (req, res) {
    authUtil.destroyUserAuthSession(req);
    res.redirect('/login');
}


module.exports = {
    getSignup: getSignup,
    getLogin: getLogin,
    signup: signup,
    login: login, 
    logout: logout
}