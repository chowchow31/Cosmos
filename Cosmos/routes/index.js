var express = require('express');
var router = express.Router();
var i18next = require('i18next');
var emailService = require('../lib/email')('')
var settings = require('../settings')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'COSMOS' });
});

/* project */
router.get('/gallery', function(req, res, next) {
  res.render('gallery', { title: 'Work Gallery' });
});

/* about us */
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About Us' });
});

/* contact us */
router.get('/contact', function(req, res, next) {
  var alert;
  if (req.query.success) alert="已成功送出!";
  res.render('contact', { title: 'Contact Us', alert:alert});
});

router.post('/contact', function(req, res, next) {

  var html = "<b>Project Inquiry</b><br><br>Company Name : " + req.body.companyName + "<br>"+"Name : " + req.body.name+ "<br>"+"Email : " + req.body.email+ "<br>"+"Phone : " + req.body.phone+ "<br>"+"Description : <pre>" + req.body.description + "</pre>"
  emailService.send(settings.app.support, "COSMOS Project Inquiry", html, function (err) {
    if (err) {
      console.log(err);
    }
  });
  //send email
  return res.redirect(303, '/contact?success=true');
});


/* contact us */
router.get('/work', function(req, res, next) {
  res.render('work', { title: 'Work' });
});


//change language
router.get('/changeLanguage/:lang', function (req, res) {
  if (!req.params.lang) res.end();

  var lang = req.params.lang;
  
  i18next.changeLanguage(lang, function (err, t) {
      req.i18n.changeLanguage(lang);
      console.log(i18next.language);
      //req.session.lng = lang;
      res.cookie('lang', lang, { signed: false, httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000});
      res.end();
  });
});




/* contact us */
router.get('/looping', function(req, res, next) {
  res.render('looping', { title: 'Contact Us' });
});


module.exports = router;
