const isSession = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/products')
    }
    next();
}

export default isSession;