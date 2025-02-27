
getSignup = (req, res) => {
    res.render('auth/signup');
    return;
};

getLogin = (req, res) => {
    
}


module.exports = {
    getSignup: getSignup,
    getLogin: getLogin,

}