var express = require('express');
var router = express.Router();
var jwt = require("jsonwebtoken");
var jsonpatch = require("jsonpatch");

/* GET home page. */
router.get('/', verifyToken,   function(req, res, next) {
  
  console.log("Cookie", req.cookies.AuthToken);

  jwt.verify(req.cookies.AuthToken.token, 'secretkey', (err, authData) => {
    if(err) {
      console.log("Error = ",err);
      res.sendStatus(403);
    } else {
      res.render('index', { title: 'Express' , authData: authData});
    }
  });

});



router.post('/jsonPatch', verifyToken,   function(req, res, next) {
  
  console.log("Cookie", req.cookies.AuthToken);

  jwt.verify(req.cookies.AuthToken.token, 'secretkey', (err, authData) => {
    if(err) {
      console.log("Error = ",err);
      res.sendStatus(403);
    } else {
      let jsonObj = req.body.jsonObj;
      let jsonPatch = req.body.Patch;
      
      console.log(req.body);
      
      console.log(jsonObj,jsonPatch);

      patcheddoc = jsonpatch.apply_patch(jsonObj, jsonPatch);

      console.log(patcheddoc);

      res.render('index', { title: 'Express' , authData: authData});
    }
  });

});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});




router.post("/login", (req,res) => {
  var user = {
    username: req.body.username,
  }

  jwt.sign({user}, "secretkey", { expiresIn: '1030s' }, (err,token) => {
    
    MyCookie = {
      token
    }

    res.cookie("AuthToken",MyCookie,{maxAge: 1000*2*60});
    
    res.json({
      token
    });
  })
})   


// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  
  if(req.cookies.AuthToken){
      
    const bearerHeader = req.cookies.AuthToken.token;
    console.log("Bearer =  ",bearerHeader);
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
      // Split at the space
      const bearer = bearerHeader.split(' ');
      // Get token from array
      const bearerToken = bearer[1];
      // Set the token
      req.token = bearerToken;
      // Next middleware
      next();
    }
    else {
      // Forbidden
      res.sendStatus(403);
    }
  }
  else {
      // Forbidden
      res.sendStatus(403);
  }
}

module.exports = router;
