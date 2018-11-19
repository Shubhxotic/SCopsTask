var express = require('express');
var router = express.Router();
var jwt = require("jsonwebtoken");
var jsonpatch = require("jsonpatch");
const imageThumbnail = require('image-thumbnail');
var fs=require('fs');


router.post("/login", (req,res) => {
  var user = {
    username: req.body.username,
  }

  jwt.sign({user}, "secretkey", { expiresIn: '1030s' }, (err,token) => {
    
    let val = "Bearer "+token;
    res.set("Authorization", val);

    res.json({
      token
    });

    res.end();
  })
})   


router.post('/jsonPatch', verifyToken,  (req, res, next) => {  
  if(req.get("Authorization") == undefined){
    res.statusCode(403);
    res.end();
  }
  else{
  
    jwt.verify(req.get("Authorization").split(" ")[1], 'secretkey', (err, authData) => {
      if(err) {
        res.sendStatus(403);
        res.end();
      } else {
        let jsonObj = req.body.jsonObj;
        let jsonPatch = req.body.Patch;

        patcheddoc = jsonpatch.apply_patch(jsonObj, jsonPatch);

        res.json(patcheddoc);
        res.end();
      }
    });
  }
});


router.post('/thumbnail', verifyToken,  (req, res, next) => {
  
  if(req.get("Authorization") == undefined){
    res.statusCode(403);
    res.end();
  }
  else{
    jwt.verify(req.get("Authorization").split(" ")[1], 'secretkey', (err, authData) => {
      if(err) {
        console.log("Error = ",err);
        res.sendStatus(403);
        res.end();
      } else {
        funcimageThumbnail(req,res);
      }
    });
  }
});


async function funcimageThumbnail(req,res) {
  try {
    if(req.body.uri == undefined){
      res.json({
        "error": "Please provide uri as the key in the request body."
      });
      res.end();
    }
    else{
        
      const thumbnail = await imageThumbnail({ uri: 'https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fbeebom-redkapmedia.netdna-ssl.com%2Fwp-content%2Fuploads%2F2016%2F01%2FReverse-Image-Search-Engines-Apps-And-Its-Uses-2016.jpg&f=1'},{ width: 50, height: 50 });

      //Saving thumbnail buffer to a file.

      // fs.open("public/images/image.png", 'w', function(err, fd) {  
      //   if (err) {
      //       throw 'could not open file: ' + err;
      //   }

      //   // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
      //   fs.write(fd, thumbnail, 0, thumbnail.length, null, function(err) {
      //       if (err) throw 'error writing file: ' + err;
      //       fs.close(fd, function() {
      //           console.log('wrote the file successfully');
      //       });
      //   });

      res.json({
        "thumbnail": thumbnail
      });
      res.end();
    }
  }
  catch (err) {
    res.json({
      "error": err
    });
    res.end();
  }
}


// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  
  if(req.get("Authorization")){
      
    const bearerHeader = req.get("Authorization");
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
      res.end();
    }
  }
  else {
      // Forbidden
      res.sendStatus(403);
      res.end();
  }
}




module.exports = router;
