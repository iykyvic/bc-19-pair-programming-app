var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('layouts/pair', { 
  	title: 'Pair' 
  });
});

router.get('/about', function(req, res){
  res.render('layouts/about', {
    title: 'About'
  });
});

router.get('/sign-in', function(req, res){
  res.render('layouts/sign-in', {
    title: 'Login'
  });
});

router.get('/dashboard', function(req, res){
  res.render('layouts/dashboard', {
    title: 'Dashboard'
  });
});
//account for error 404
router.get('/404', function(req, res){
  next();
});

router.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('error', { url: req.url });
    return;
  }
});
module.exports = router;
