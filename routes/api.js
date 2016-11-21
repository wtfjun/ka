var express = require('express');
var api = require('../controllers/api.js')
var router = express.Router();

/* GET home page. */
router.get('/subpage', api.subpage)
router.get('/message', api.message)

module.exports = router;
