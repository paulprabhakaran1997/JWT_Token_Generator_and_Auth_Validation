const { tokenValidator } = require('./token');


const authVerify = (req, res, next) => {
    try {
        const { jwt } = req.cookies;
        const isValid = tokenValidator(jwt);
        if (isValid) {
            next();
        } else {
            res.status(400).json('Access Denied')
        }
    } catch (error) {
        res.status(400).json(error)
    }
}

module.exports = authVerify;