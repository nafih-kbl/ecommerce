var express = require('express');
var router = express.Router();
var {createUser,loginUserCtrl}=require('../controller/userCtrl')
/* GET users listing. */
router.post('/register',createUser);
router.post('/login',loginUserCtrl);



module.exports = router;
