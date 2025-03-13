const User = require("../models/user.model");
const { get } = require("../routes/auth-routes");

getSignup = (req, res) => {
    res.render('customer/auth/signup');
};

signup = async (req, res) => {
   const user =  new User(
    req.body.email, 
    req.body.password, 
    req.body.fullname, 
    req.body.street,
    req.body.postalCode,
    req.body.city
    );

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


module.exports = {
    getSignup: getSignup,
    getLogin: getLogin,
    signup: signup

}