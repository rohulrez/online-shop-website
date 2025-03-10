const { get } = require("../routes/auth-routes");

getSignup = (req, res) => {




    res.render('customer/auth/signup');
    return;
};

signUp = (req, res) => {

}

getLogin = (req, res) => {
    
}


module.exports = {
    getSignup: getSignup,
    getLogin: getLogin,
    signUp: signUp

}