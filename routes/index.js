var express = require('express');
var router = express.Router();
var userModel = require("./users");
var passport = require("passport");
var path=require("path");



const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/signup', function (req, res) {
  res.render("signup")
})

router.post('/register', function (req, res) {
  userModel.findOne({ username: req.body.username })
    .then(function (user) {
      if (user) res.send("User already exist");
      else {
        var newUser = new userModel({
          username: req.body.username,
          email: req.body.email,
          contact: req.body.contact,
        })
        userModel.register(newUser, req.body.password)
          .then(function (u) {
            passport.authenticate("local")(req, res, function () {
              res.redirect('/feed');
            })
          })
      }
    })
})

router.post('/login', passport.authenticate('local',{
  successRedirect:'/feed',
  failureRedirect:'/'
}),function(req,res){});

router.get('/feed',isLoggedIn,function(req,res){
  userModel.findOne({username:req.session.passport.user})
  .then(function(user){
    res.render('feed',{user});
  })
})

router.post('/add',isLoggedIn,function(req,res){
  userModel.findOne({username:req.session.passport.user})
  .then(function(user){
    user.work.push({title:req.body.title, disc:req.body.disc})
    user.save()
    .then(function(u){
      res.redirect('back');
    })
  })
})

router.get('/edit/:id',isLoggedIn,function(req,res){
  userModel.findOne({username:req.session.passport.user})
  .then(function(user){
    res.render('edit',{user,index:user.work.indexOf(req.params.id)+1})
  })
})
router.post('/edit/:id',isLoggedIn,function(req,res){
  userModel.findOne({username:req.session.passport.user})
  .then(function(user){
    user.work.splice({_id:req.params.id},1);
    user.work.push({title:req.body.title, disc:req.body.disc,status:req.body.status})
    user.save()
    .then(function(u){
      res.redirect('/feed');
    })
    })
})
router.get('/delete/:id',isLoggedIn,function(req,res){
  userModel.findOne({username:req.session.passport.user})
  .then(function(user){
    user.work.splice({_id:req.params.id},1);
    user.save()
    .then(function(u){
      res.redirect('back');
    })
  })
})

function isLoggedIn(req,res,next){
if(req.isAuthenticated()){
  return next();
}
else{
  res.redirect('/');
}
}
module.exports = router;
