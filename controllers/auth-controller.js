const { get } = require("../routes/auth-routes");

getSignup = (req, res) => {
    



    res.render('customer/auth/signup');
    return;
};

getLogin = (req, res) => {
    
}


module.exports = {
    getSignup: getSignup,
    getLogin: getLogin,

}