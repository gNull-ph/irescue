var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var User = require('./../../function/client/user');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook');
var Admin = require('./../../function/admin/admin');
var email = require('./../../function/email/email');
var jwt = require('./../../function/jwt/jwt');
var uuidv1 = require('uuid/v1'); 
var uuidv3 = require('uuid/v3');
var auth = require('./../../function/auth/auth');

router.get('/',Admin.checkadminCount,function(req,res,next){
  var token = req.cookies['_d.r']
  if(typeof token !== 'undefined'){
    req.token = token
    next()
  }else{
    res.render('./includes/Admin/login');
  }
},function(req,res,next){
  var token =  jwt.decrypt(req.token)
  if(token!=false){
      res.redirect('/')
  }else{
      next()
  }
},function(req,res,next){
  res.render('./includes/Admin/login');
})
router.route('/setup')
  .get(Admin.checkadmin,function(req,res,next){
  res.render('./includes/admin/setup');
  res.end();
})
  .post(Admin.checkadmin,function(req,res,next){
  var token  = Admin.encrypt(req,res,next)
  // res.cookie('_c',,{maxAge:Math.floor(Date.now() / 1000) + (60 * 60)})
  var code = email.createRandomKey()
  req.session._code = code
  email.sendEmail('irescue <admin@irescue.com>','malupertcbenteono@gmail.com','TEST','TESTING EMAIL','<h1>YOUR CODE IS '+code+'</h1>')
  res.redirect('/Administrator/setup/'+token+'?email='+req.body.email+'&name='+req.body.firstname+' '+req.body.lastname+'&username='+req.body.username)
})
router.get('/setup/:token',Admin.checkadmin,function(req,res,next){
  res.render('./includes/verification/codeEmailVerification',{token:req.params.token,email:req.query.email,name:req.query.name,username:req.query.username})
})
router.post('/setup/:token/verify/',Admin.checkadmin,Admin.jwt_stat,function(req,res,next){
  var code = req.session._code
  var code_user = req.body.first+'-'+req.body.second+'-'+ req.body.third
  if(code === code_user){
    console.log('same '+code);
    res.render('./includes/verification/codeEmailVerification',{token:req.params.token,_verify:true,mess:false});
  }else{
    console.log('not '+code);
    res.redirect('/');
  }
  //res.render('./includes/admin/setup')
})
router.route('/setup/:token/register',Admin.checkadmin,Admin.jwt_stat)
.post(function(req,res,next){
  var user =  jwt.decrypt(req.params.token)
  if(user!=false){
    Admin.create_Admin_Account(req,res,next,user,'/Administrator/setup/'+req.params.token+'/register')
    console.log(user)
  }else{
    console.log(req.body.password)
    res.redirect('/');
  }
  //res.render('./includes/admin/setup')
})
.get(function(req,res,next){
  var user =  jwt.decrypt(req.params.token)
    if(user!=false){
      res.render('./includes/verification/codeEmailVerification',{_verify:true,mess:user});
    }else{
      res.redirect('/');
  }
})
router.post('/setup/resend-code',Admin.checkadmin,Admin.jwt_stat,function(req,res,next){
  //res.render('./includes/admin/setup')
})

module.exports = router