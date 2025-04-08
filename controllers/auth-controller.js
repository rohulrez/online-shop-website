const User = require("../models/user.model");
const { get, post } = require("../routes/auth-routes");
const authUtil = require('../util/authentication');

getSignup = (req, res) => {
    res.render('customer/auth/signup');
};

signup = async (req, res) => {
    const {email, password, fullName, street, postalCode, city} = req.body;

    const user = new User(email, password, fullName, street, postalCode, city );

    try{
        await user.signup();
        res.redirect('/login');
    } catch (error){
        console.error('Error during signup!', error);
        res.redirect('/signup');
    }

    
}

getLogin = (req, res) => {
    res.render('customer/auth/login')
}

login = async (req, res) => {
    const user = new User(
        req.body.email, 
        req.body.password
    );
    const existingUser = await user.getUserWithSameEmail();
   
    if(!existingUser) {
        res.redirect('/login');
        return;
    };

    const passwordIsCorrect = await user.hasMatchingPassword(existingUser.password)

    if(!passwordIsCorrect) {
        res.redirect('/login');
        return;
    }

    authUtil.createUserSession(req, existingUser, () => {
        res.redirect('/');
    });
    };

    
logout = (req, res) => {
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