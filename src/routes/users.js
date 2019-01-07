const _ = require('lodash');
const router = require('express').Router();

const auth = require('../auth');
const User = require('../models/User');

router.get('/current_user', auth.middleware, async (req, res) => {
  const currentUser = await User.query().findById(req.authUser.id)
  res.send({currentUser})
});

module.exports = router;
