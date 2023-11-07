var express = require('express');
var router = express.Router();
var {createUser,loginUserCtrl,getAllUser,getSingleUSer,deleteAuser,updtateUser, blockUser, unblockUser,handleRefreshToken,logoutUser}=require('../controller/userCtrl');
const { authMiddleware,isAdmin } = require('../middleware/authMiddleware');
/* GET users listing. */
router.post('/register',createUser);
router.post('/login',loginUserCtrl);
router.get('/getAllUser',authMiddleware,isAdmin,getAllUser);
router.get('/getUser/:id',authMiddleware,getSingleUSer);
router.delete('/deleteUser/:id',deleteAuser);
router.put('/updateUser/:id',updtateUser);
router.put('/logOutUser',logoutUser);
router.put('/blockUser/:id',authMiddleware,isAdmin,blockUser);
router.put('/unblockUser/:id',authMiddleware,isAdmin,unblockUser);
router.get('/refreshToken',handleRefreshToken);



module.exports = router;
