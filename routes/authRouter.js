var express = require('express');
var router = express.Router();
var {createUser,loginUserCtrl,getAllUser,getSingleUSer,deleteAuser,updtateUser}=require('../controller/userCtrl')
/* GET users listing. */
router.post('/register',createUser);
router.post('/login',loginUserCtrl);
router.get('/getAllUser',getAllUser);
router.get('/getUser/:id',getSingleUSer);
router.delete('/deleteUser/:id',deleteAuser);
router.put('/updateUser/:id',updtateUser);



module.exports = router;
