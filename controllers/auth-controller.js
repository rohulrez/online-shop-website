const User = require("../models/user.model");
const { get, post } = require("../routes/auth-routes");

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


module.exports = {
    getSignup: getSignup,
    getLogin: getLogin,
    signup: signup

}