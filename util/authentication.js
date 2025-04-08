createUserSession = (req, user, action) => {
    req.session.uid = user._id.toString()
    req.session.save(action);
}

destroyUserAuthSession = (req) => {
    req.session.uid = null;
}

module.exports = {
    createUserSession: createUserSession,
    destroyUserAuthSession: destroyUserAuthSession
}