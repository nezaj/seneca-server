const _ = require('lodash');
const router = require('express').Router();
const bcrypt = require('bcrypt-nodejs');

const auth = require('../auth');
const User = require('../models/User');

function validateUser({email, password}) {
  const errors = [];
  /*TODO*/
  return {
    errors: [],
    cleanData: {user: {email, password}}
  }
}
function validateSession({email, password}) {
  const errors = [];
  /*TODO*/
  return {
    errors: [],
    cleanData: {user: {email, password}}
  }
}

router.post('/signup', async (req, res) => {
  const v = validateUser(req.body);

  if (v.errors.length === 0) {
    try {
      const currentUser = await User.create(v.cleanData);
      const userToken = _.pick(currentUser, ['id', 'email']);
      auth.writeToken(userToken, res);
      res.send({currentUser});
    } catch (err) {
      // TODO: Could there be other types of errors?
      res.status(400).send({field: 'email', message: 'email already exists'});
    }
  } else {
    res.status(400).send(v.errors);
  }
});

router.post('/signin', async (req, res) => {
  const v = validateSession(req.body);

  if (v.errors.length) {
    res.status(400).send(v.errors);
  } else {
    const currentUser = await User.query().findByEmail(v.cleanData.user.email);
    if (!currentUser || !bcrypt.compareSync(v.cleanData.user.password, currentUser.password)) {
      res.status(400).send({field: 'password', message: 'invalid username or password'});
    } else {
      auth.writeToken(_.pick(currentUser, ['id', 'email']), res);
      res.send({currentUser});
    }
  }
});

router.post('/signout', (req, res) => {
  auth.clearToken(res);
  res.status(200).send({});
});

module.exports = router;
