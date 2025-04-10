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

async function signup  (req, res, next) {
    const {email, password, fullname, street, postal, city} = req.body;

    const enteredData = {
        email:  req.body.email, 
        confirmEmail: req.body['confirm-email'],
        password: req.body.password, 
        fullname: req.body.fullname, 
        street: req.body.street, 
        postal: req.body.postal, 
        city: req.body.city
    }

    if(!validation.userDetailsAreValid(
        req.body.email, 
        req.body.password, 
        req.body.fullname, 
        req.body.street, 
        req.body.potal, 
        req.body.city)
    || !validation.emailIsConfirmed(req.body.email, req.body['confirm-email'])
    ) {
        sessionFlash.flashDataToSession(req, {
            errorMessage: 'Please check you input!',
            ...enteredData
        }, () => {
            res.redirect('/signup');
        })
        return;
    }

    const user = new User(email, password, fullname, street, postal, city );

    

    try{
        const existsAlready =  await user.existsAlready()

        if(existsAlready) {
            sessionFlash.flashDataToSession(req, {
                errorMessage: 'User exists already!',
                ...enteredData
            }, () => {
                res.redirect('/signup')
            })
        return;
        }
        await user.signup();
    } catch (error){
        next(error);        
        return;
    }

    res.redirect('/login');
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