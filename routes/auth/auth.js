var express = require('express');
var router = express.Router();
var Password =require('./../../function/password/password')
var auth = require('./../../function/auth/auth');
var Admin = require('../../function/admin/admin')
var bcrypt = require('./../../function/bcrypt/bcrypt')
var jwt = require('./../../function/jwt/jwt')
router.post('/',function(req,res,next){
  res.send('FUCK YOU ')
})
router.post( '/user',auth.isCookieAvailable, async function(req, res, next) {
  try{
    req.check('username','Invalid username').isLength({min:5}).withMessage('Username must be at least 5 chars long')
    req.check('password','Invalid password').isLength({min:5}).withMessage('Password must be at least 5 chars long')
    .matches(/\d/).withMessage('Password must contain a number')
    var errors = req.validationErrors();
    if(errors){
      console.log(errors.find(x => x.location === 'body').msg)
      res.render('includes/components/alert/alert-danger',{heading:errors.find(x => x.location === 'body').msg,message:errors.find(x => x.location === 'body').value,message_bottom:'',success:false})
    }else{
      var username = req.body.username
      var password = req.body.password
      var table = req.body.table
      var admin_tbl = 'account_admin'
      var client = 'account_client'
      var token =  jwt.decrypt(req.token)
        if(table === 'admin'){
          var ID = await Admin.isRegister(username)
          if(ID !=false){
            var hash= await Password.getPass(ID,admin_tbl)
            if(await bcrypt.compareHash(password,hash)){
              var data =  await Admin.info(ID)
              var token =  jwt.encrypt(data,'12h')
              var hostname = req.headers.host;
              res.cookie('_d.r', token, {  path: '/',expires: new Date(Date.now() + 60000*60*12), httpOnly: true })
              res.send({ title: 'Express' ,authorized:true,Account_TYPE_ID:token.Account_TYPE_ID});
              //res.send({success:true})
            }else{
              res.render('includes/components/alert/alert-danger',{heading:'Username or password was Incorrect.',message:'Username or password was Incorrect.',message_bottom:'Username or password was Incorrect.',success:false})
            }
            
          }else{
            res.render('includes/components/alert/alert-danger',{heading:'Username or password was Incorrect.',message:'Username or password was Incorrect.',message_bottom:'Username or password was Incorrect.',success:false})
          }
        }
        else if(table === 'client'){
          Password.getPass(_id,client)
        }else{
          res.render('includes/components/alert/alert-danger',{heading:'Route not found.',message:'Route not found.',message_bottom:'Route not found.',success:false})
      }
    }
      
  }catch(e){
    console.log(e)
  }
})

module.exports = router;

