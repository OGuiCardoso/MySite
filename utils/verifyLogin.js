function isloggedIn(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/projects')
    }
    next();
};
export default isloggedIn