var express = require('express');
var api = require('../controllers/api.js')
var router = express.Router();

/* GET home page. */
router.get('/subpage', api.subpage)
router.get('/message', api.message)
router.get('/fourProjects', api.fourProjects)
router.get('/allProjects', api.allProjects)
router.get('/project', api.project)

module.exports = router;
