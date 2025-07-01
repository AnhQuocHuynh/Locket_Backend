const express = require('express');
const User = require('../models/User');
// const Friendship = require('../models/Friendship');
const { authenticate } = require('../middleware/auth');

const router = express.Router();



module.exports = router; 