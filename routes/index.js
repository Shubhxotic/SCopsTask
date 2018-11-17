var express = require('express');
var router = express.Router();
var jwt = require("jsonwebtoken")


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.post("/login", (req,res) => {

})


module.exports = router;
