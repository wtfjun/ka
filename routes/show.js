var express = require('express');
var show = require('../controllers/show.js')
var router = express.Router();

/* GET home page. */
router.get('/', show.index)
router.get('/login', show.login)
router.get('/signup', show.signup)
router.get('/account', show.account)
router.get('/subpage', show.subpage)
router.get('/subpage_ueditor', show.subpage_ueditor)
router.get('/message', show.message)
router.get('/project', show.project)
router.get('/project_ueditor', show.project_ueditor)
router.get('/error', show.errorPage)

module.exports = router;
