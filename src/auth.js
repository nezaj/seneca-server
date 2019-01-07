const jwt = require('jsonwebtoken');

const secret = 'seneca';

module.exports = {
  writeToken(payload, res) {
    res.cookie('auth', jwt.sign(payload, secret));
  },

  clearToken(res) {
    res.clearCookie('auth');
  },

  verify(token) {
    try {
      return jwt.verify(token, secret);
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        return null;
      } else {
        throw err;
      }
    }
  },

  middleware(req, res, next) {
    if (req.cookies.auth) {
      try {
        req.authUser = jwt.verify(req.cookies.auth, secret);
      } catch (err) {
        res.clearCookie('auth');
        res.status(403).send({reason: 'auth'});
      }
      next();
    } else {
      res.status(403).send({reason: 'auth'});
    }
  }
};
