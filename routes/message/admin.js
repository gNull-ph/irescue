var express = require('express');
var router = express.Router();
var jwt = require('../../function/jwt/jwt')
var Admin = require('../../function/admin/admin');
var Chat = require('../../function/chat/admin_chat');
var app = require('../../app');
/* GET home page. */
router.route('/')
.get( Admin.checkToken, function(req, res, next) {
    //include ./../message/messageForm/body
    res.render('includes/message/messageForm/body', { title: 'Express' ,authorized:true,
    Account_ID:req.decoded.Account_ID,
    Account_NAME:req.decoded.Account_NAME,
    Account_USERNAME:req.decoded.Account_USERNAME,
    Account_TYPE_ID:req.decoded.Account_TYPE_ID,
    Account_EMAIL:req.decoded.Account_EMAIL,
    Account_LOCATION:req.decoded.Account_LOCATION,
    Account_ISVERIFY:req.decoded.Account_ISVERIFY});
})
.post(Admin.checkToken, function(req, res, next) {
    //include ./../message/messageForm/body
    res.render('includes/message/messageForm/body', { title: 'Express' ,authorized:true,
    Account_ID:req.decoded.Account_ID,
    Account_NAME:req.decoded.Account_NAME,
    Account_USERNAME:req.decoded.Account_USERNAME,
    Account_TYPE_ID:req.decoded.Account_TYPE_ID,
    Account_EMAIL:req.decoded.Account_EMAIL,
    Account_LOCATION:req.decoded.Account_LOCATION,
    Account_ISVERIFY:req.decoded.Account_ISVERIFY});
});
router.get('/message/chat-thread', Admin.checkToken,Chat.getMessageByThread, function(req, res, next) {
    //res.render('includes/message/chat_box', { title: 'Express' ,authorized:true,Account_TYPE_ID:token.Account_TYPE_ID});
});
router.get('/message/chat-thread-messages', Admin.checkToken,Chat.getMessageByThread, function(req, res, next) {
    //res.render('includes/message/chat_box', { title: 'Express' ,authorized:true,Account_TYPE_ID:token.Account_TYPE_ID});
});
module.exports = router;
